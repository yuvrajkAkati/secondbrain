import {v} from "convex/values"

import {mutation,query} from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel";
import { IndexRangeBuilder } from "convex/server";
import { throwDeprecation } from "process";


export const getDocuments = query({
    args : {
        parentDocument : v.optional(v.id("documents"))
    },
    handler : async(ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();
        
        if(!identity) throw new Error("Not Authenticated")
        const userId = identity.subject;
        const documents = ctx.db
            .query("documents")
            .withIndex("by_user_parent",(q)=>
                q
                    .eq("userId",userId)
                    .eq("parentDocument",args.parentDocument)
            )
            .filter((q) => 
                q.eq(q.field("isArchived"),false)
            )
            .order("desc")
            .collect();
            return documents;
    }
})



export const create = mutation({
    args : {
        title : v.string(),
        parentDocument : v.optional(v.id("documents"))
    },
    handler : async (ctx,args) => {
        const user = await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not authenticated")
        }
        const userId = user.subject
        const document = ctx.db.insert("documents",{
            title : args.title,
            userId : userId,
            parentDocument : args.parentDocument,
            isArchived : false,
            isPublished : false,
        })
        return document
    }
})

export const archive = mutation({
    args : {
        documentId : v.id("documents"),
    }, 
    handler : async(ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not authenticated")
        }
        const userId = user.subject
        const existingDocument = await ctx.db.get(args.documentId)
        if (!existingDocument) {
            throw new Error("document does not exist")
        }
        if(existingDocument.userId !== userId){
            throw new Error("Unauthorized")
        }
        
        const  recursiveDocument = async (documentId : Id<"documents">) => {
            const children = await ctx.db
                    .query("documents")
                    .withIndex("by_user_parent",(q)=>(
                            q
                            .eq("userId",userId)
                            .eq("parentDocument",documentId)
                    ))
                    .collect()
            for(const child of children){
                await ctx.db.patch(child._id,{
                    isArchived : true
                })
                await recursiveDocument(child._id);
            }
        }

        recursiveDocument(args.documentId)

        const document = await ctx.db.patch(args.documentId,{
            isArchived : true
        })


        return document;
    }
})

export const fetchArchive = query({
    args : {

    },
    handler : async(ctx,args) => {
        const user = await ctx.auth.getUserIdentity()
        if(!user) throw new Error("Not authenticated")

        const userId = user.subject;
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user",(q) => q.eq("userId",userId))
            .filter((q)=>(
                q.eq(q.field("isArchived"),true)                
            ))
            .order("desc")
            .collect();
        
            return documents;
    }
})


export const restore = mutation({
    args : {
        documentId : v.id("documents")
    },
    handler : async(ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if(!user) throw new Error("Not authenticated")

        const userId = user.subject
        const existingDocument = await ctx.db.get(args.documentId)
        if(!existingDocument) throw new Error("Document doesnt exists!")
        if(existingDocument.userId !== userId) throw new Error("Not Authenticated")
            const recursiveRestore = async(documentId : Id<"documents">) => {
            const childrens = await ctx.db
                .query("documents")
                .withIndex("by_user_parent",(q)=>(
                    q.eq("userId",userId).eq("parentDocument",documentId)
                ))
                .collect()
                for(const child of childrens){
                    await ctx.db.patch(child._id,{
                        isArchived : false
                    })
                    await recursiveRestore(child._id)
                }
        }
        const options : Partial<Doc<"documents">> = {
            isArchived : false
        }
        if(existingDocument.parentDocument){
            const parent = await ctx.db.get(existingDocument.parentDocument)
            if(parent?.isArchived){
                options.parentDocument = undefined;
            }
        }
        const document = await ctx.db.patch(args.documentId,options)
        recursiveRestore(args.documentId)
        return document
    },
})


export const deletePermanently = mutation({
    args : {
        documentId : v.id("documents")
    },
    handler : async(ctx,args) => {
        const user = await ctx.auth.getUserIdentity()
        if(!user) throw new Error("Not authenticated")

        const userId = user.subject
        const existingDocument = await ctx.db.get(args.documentId)
        if(!existingDocument) throw new Error("Document doesnt exists!")
        if(existingDocument.userId !== userId) throw new Error("Not Authenticated")
        const document = await ctx.db.delete(args.documentId)
        return document;
        
    }
})

export const getSearch = query({
    handler : async(ctx) => {
        const user = await ctx.auth.getUserIdentity()
        if(!user) throw new Error("Not authenticated")
        const userId = user.subject
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user",(q)=>q.eq("userId",userId))
            .filter((q)=>q.eq(q.field("isArchived"),false))
            .order("desc")
            .collect()
        return documents
    }
})

export const getById = query({
    args : {
        documentId : v.id("documents")
    },
    handler : async(ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        const document = await ctx.db.get(args.documentId)
        if(!document){
            throw new Error("Not found")
        }
        
        if(document.isPublished && !document.isArchived){
            return document
        }
        
        if(!user) throw new Error("Not authenticated")
        const userId = user.subject

        if(document.userId !== userId) throw new Error("unauthorized")

        return document;

        }
})


export const update = mutation({
    args : {
        id : v.id("documents"),
        title : v.optional(v.string()),
        content : v.optional(v.string()),
        coverImage : v.optional(v.string()),
        icon : v.optional(v.string()),
        isPublished : v.optional(v.boolean())
    },
    handler : async(ctx,args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Unauthorized")
        }
        const userId = identity.subject
        const {id , ...rest} = args
        const existingDocument = await ctx.db.get(args.id)
        if(!existingDocument){
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId){
            throw new Error("Unauthorized")
        }

        const document = await ctx.db.patch((args.id),{
            ...rest
        })
        return document;
    }
})


export const removeIcon = mutation({
    args : {
        id : v.id("documents")
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Unauthorized")
        }
        const userId = identity.subject

        const existingDocument = await ctx.db.get(args.id);
        if(!existingDocument) throw new Error("Not found")

        if(existingDocument.userId !== userId) throw new Error("Unauthorized")

        const document = await ctx.db.patch(args.id,{
            icon : undefined
        })

        return document;
    }
})

export const removeCoverImage =  mutation({
    args : {
        id : v.id("documents")
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Unauthorized")
        }
        const userId = identity.subject;
        const existingDocument = await ctx.db.get(args.id) 
        if(!existingDocument) throw new Error("Document does not exist!")
        if(existingDocument.userId !== userId) throw new Error("Unauthorized")

        const document = await ctx.db.patch(args.id,{
            coverImage : undefined
        })
        return document;
    },
})