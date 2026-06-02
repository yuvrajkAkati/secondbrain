"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface BannerProps {
    documentId: Id<"documents">
}

const Banner = ({ documentId }: BannerProps) => {
    const router = useRouter()
    const remove = useMutation(api.document.deletePermanently)
    const restore = useMutation(api.document.restore)

    const onRemove = () => {
        const promise = remove({
            documentId: documentId
        })

        toast.promise(promise, {
            success: "Note deleted",
            loading: "Deleting note...",
            error: "Failed to delete note"
        })

        router.push("/documents")
    }

    function onRestore() {
        const promise = restore({
            documentId: documentId
        })

        toast.promise(promise, {
            success: "Note recovered!",
            loading: "Recovering Note",
            error: "Failed to recover note"
        })
    }

    return (
        <div
            role="button"
            onClick={onRemove}
            className="relative flex w-full items-center justify-center gap-x-4 overflow-hidden border-b border-violet-500/20 bg-gradient-to-r from-black via-violet-950/80 to-black px-4 py-3 text-center backdrop-blur-xl"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_70%)]" />

            <p className="relative text-sm font-medium text-white/90">
                This page is currently in the trash.
            </p>

            <Button
                onClick={onRestore}
                className="relative h-8 rounded-full border border-violet-400/30 bg-white/10 px-5 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-violet-500 hover:text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.45)]"
            >
                Restore Page
            </Button>

            <ConfirmModal onConfirm={onRemove}>
                <Button
                    variant="ghost"
                    className="relative h-8 rounded-full border border-white/10 bg-white/5 px-5 text-xs font-medium text-white/80 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                >
                    Delete Forever
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Banner