"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { create } from "@/convex/document";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";

import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, ChevronUp, Delete, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";
import { useRouter } from "next/navigation";
import { eventNames, title } from "process";
import { toast } from "sonner";

interface ItemProps{
    id? : Id<"documents">;
    documentIcon? : string;
    active? : boolean;
    expanded? : boolean;
    isSearch? : boolean;
    level? : number;
    onExpand? : () => void; 
    label : string;
    onClick : () => void;
    icon : LucideIcon;
}
const Item = ({
    id,
    label,
    onClick,
    icon : Icon,
    documentIcon,
    active,
    expanded,
    isSearch,
    level,
    onExpand
} : ItemProps) => {
    const {user} = useUser()
    const mutation = useMutation(api.document.create)
    const archive = useMutation(api.document.archive)
    const router = useRouter()

    const onArchive = (event : React.MouseEvent<HTMLDivElement,MouseEvent>) => {
        event.stopPropagation()
        if(!id) return;
        const promise = archive({ documentId : id });
        toast.promise(promise,{
            success : "Note deleted!",
            loading : "Deleting",
            error : "Fail to delete note"
        })
    }

    const handleExpand = (
        event : React.MouseEvent<HTMLDivElement,MouseEvent>
    ) => {
        event.stopPropagation()
        onExpand?.()
    }

    const  onCreate = (
        event : React.MouseEvent<HTMLDivElement,MouseEvent>
    ) => {
        event.stopPropagation()
        if(!id) return;
        const promise = mutation({title : "untitled",parentDocument : id}).then((documentId) => {
            if(!expanded){
                onExpand?.()
            }
            // router.push(`/documents/${documentId}`)
        })
        toast.promise(promise,{
            loading : "Creating...",
            success : "New Note created",
            error : "Failed to create !"
        })
    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight
    return ( 
        <div 
            onClick={onClick}
            role="button"
            style={{paddingLeft : level ? `${(level*12) + 12}px` : "12px"}}
            className={cn("w-full  flex gap-2 text-sm items-center text-violet-300 hover:bg-purple-900 py-1",
                active && "bg-violet-900"
            )}
        >
            {!!id && (
                    <div
                        role="button"
                        className="h-full rounded-sm mr-1"
                        onClick={handleExpand}
                    >
                        <ChevronIcon/>
                    </div>
                )
            }
            {documentIcon ? (
                    <div>
                        {documentIcon}    
                    </div>
                ) : (
                        <Icon className="shrink-0 h-[18px]"></Icon>
                )}
            <span className="truncate">{label}</span>
            {isSearch && (
                <kbd className="ml-auto mr-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-muted- opacity-100">
                    <span>
                        CTRL + K
                    </span>
                </kbd>
            )}
            {
                !!id && (
                    <div className="ml-auto flex items-center gap-x-2 mr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger onClick={(e)=>{e.stopPropagation()}} asChild>
                                <div className="opacity-0 ml-auto h-full hover:opacity-100 bg-purple-700 rounded shadow data-[state=open]:opacity-100"><MoreHorizontal className="h-4 w-4"></MoreHorizontal></div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60 " align="start" side="right" sideOffset={10} forceMount>
                                <DropdownMenuItem  onClick={onArchive}>
                                    <Trash className="h-4 w-4"></Trash>
                                    <div>DELETE</div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <div className="text-xs text-muted-foreground">Last edited by {user?.fullName}</div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="opacity-0 group hover:opacity-100 h-full mr-auto rounded-sm hover:bg-purple-300 dark:hover:bg-purple-600 border transition" role="button" onClick={onCreate}>   
                            <Plus className="h-4 w-4 "></Plus>
                        </div>
                    </div>
                )
            }
        </div>
     );
}

Item.Skeleton = function itemSkeleton({level} : {level? : number}){
    return (
        <div style={{
            paddingLeft : level? `${(level * 12) + 25}px` : "12px"
        }}
        className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4 bg-purple-900"></Skeleton>
            <Skeleton className="h-4 w-[70%] bg-purple-700"></Skeleton>
        </div>
    )
}

export default Item;