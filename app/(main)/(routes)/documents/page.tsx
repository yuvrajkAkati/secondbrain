"use client"
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

const DocumentsPage = () => {
    const {user} = useUser()
    const create = useMutation(api.document.create)

    const onCreate = () => {
        const asd = create({title : "Untitled"})
        toast.promise(asd,{
            loading : "Creating a new note...",
            success : "New Note Created!",
            error : "Failed to create a new note."
        })
    }
    
    console.log(user)
    return ( <div className="flex flex-col items-center justify-center h-full w-screen space-y-2">
        {/* insert image if needed */}
        <h2 className="uppercase bg-gradient-to-r from-purple-900 via-purple-400 to-purple-900 bg-clip-text text-transparent font-bold">
            welcome to {user?.firstName}&apos;s secondBrain
        </h2>
        <Button variant={"ghost"} size="sm" className="bg-gradient-to-r from-purple-900 via-purple-400 to-purple-900 bg-clip-text text-transparent" onClick={onCreate}>
            <PlusCircle className=""/>
            Add a note
        </Button>
    </div> ) ;
}
 
export default DocumentsPage;