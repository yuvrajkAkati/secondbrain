"use client"

import Cover from "@/app/(main)/_components/cover";
import ToolBar from "@/app/(main)/_components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { use, useMemo } from "react";
import dynamic from "next/dynamic";


interface DocumentIdPageProps{
    params : Promise<{
        documentId : Id<"documents">
    }>
}

const DocumentIdPage = ({
} : DocumentIdPageProps) => {
    const Editor = useMemo(()=>dynamic(()=>import("@/components/ui/editor"),{ssr : false}),[])
    const params = useParams()
    const document = useQuery(api.document.getById,{
        documentId : params.documentId as Id<"documents">
    })

    const update = useMutation(api.document.update)
    const onChange = (content : string) => {
        update({
            id : params.documentId as Id<"documents">,
            content : content
        })
    }

    if(document === undefined){
        return <div>
            <Cover.Skeleton></Cover.Skeleton>
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                <div className="space-y-4 pl-8 pt-4 ">
                    <Skeleton className="h-14 w-[50%]"></Skeleton>
                    <Skeleton className="h-4 w-[80%]"></Skeleton>
                    <Skeleton className="h-4 w-[40%]"></Skeleton>
                    <Skeleton className="h-4 w-[60%]"></Skeleton>
                </div>
            </div>
        </div>
    }

    if(document === null){
        return <div>
            Not found
        </div>
    }

    return ( 
        <div className="pb-40 flex flex-col w-full min-h-screen">
  {/* ✅ Cover spans full width */}
  <div className="w-full">
    <Cover preview url={document.coverImage} />
  </div>
    <div className="h-[5vh]"></div>
  {/* ✅ Content area centered on large screens */}
  <div className="flex justify-center w-full ">
    <div className="flex flex-col w-full md:max-w-3xl lg:max-w-6xl px-4">
      <ToolBar preview initialData={document} />
      <div className="h-[3vh]"></div>
      <Editor editable={false} onChange={onChange} initialContent={document.content} />
    </div>
  </div>
</div>

     );
}
 
export default DocumentIdPage;