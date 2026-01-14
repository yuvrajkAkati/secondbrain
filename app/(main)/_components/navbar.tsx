"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Title from "./title";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";
import AiButton from "./ai-button";

interface NavbarProps{
    isCollapsed : boolean;
    onResetWidth : ()=> void;
}



const Navbar = ({isCollapsed,onResetWidth} : NavbarProps) => {
    const params = useParams()
    const document = useQuery(api.document.getById,{
        documentId : params.documentId as Id<"documents"> 
    }) 

    if(document === undefined){
        return (
        <div className="pl-6 pt-6 text-muted-foreground w-full flex justify-between items-center gap-x-4 ">
            <Title.Skeleton></Title.Skeleton>
            <div className="flex items-center gap-x-2">
                <Menu.Skeleton/>
            </div>
        </div>)
    }

    if(document === null){
        return null;
    }

    return ( 
        <>
            <nav className="pl-6 w-full flex items-center gap-x-4 pt-6 pb-6">
                {isCollapsed && (
                    <MenuIcon
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6 "
                    >
                    </MenuIcon>
                )}
                <div className="flex items-center justify-between w-full ">
                    <Title initialData = {document}/>
                    <div className="flex items-center gap-x-2">
                        <AiButton></AiButton>
                        <Publish initialData={document}/>
                        <Menu documentId={document._id}/>
                    </div>
                </div>
            </nav>
            {document.isArchived && (
                <Banner documentId = {document._id}></Banner>                
            )}
        </>
    );
}
 
export default Navbar;