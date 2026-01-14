"use client"
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
    documentId : Id<"documents">
}
const Banner = (
    {documentId} : BannerProps
) => {
    const router = useRouter()
    const remove = useMutation(api.document.deletePermanently)
    const restore = useMutation(api.document.restore)
    const onRemove = () => {
        const promise = remove({
            documentId : documentId 
        })
        toast.promise(promise,{
            success : "Note deleted",
            loading : "Deleting note...",
            error : "Failed to delete note"
        })
        router.push("/documents")
    }
    function onRestore (){
        const promise = restore({
            documentId : documentId
        })

        toast.promise(promise,{
            success : "Note recovered!",
            loading : "Recovering Note",
            error : "Failed to recover note"
        })
    }
    return ( 
        <div role="button" onClick={onRemove} className="w-full bg-red-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p>This is in the trash.</p>
            <Button className="h-6 p-4" onClick={onRestore}>Restore this page</Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button className="h-6 p-4">Delete this forever</Button>
            </ConfirmModal>
        </div>
    );
}
 
export default Banner;