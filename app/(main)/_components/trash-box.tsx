"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { Search, Trash, Undo } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const TrashBox = () => {
    const router = useRouter()
    const params = useParams()

    const documents = useQuery(api.document.fetchArchive)

    const restore = useMutation(api.document.restore)
    const remove = useMutation(api.document.deletePermanently)

    const [search, setSearch] = useState("")

    const filteredDocuments = documents?.filter((document) =>
        document.title
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`)
    }

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    ) => {
        event.stopPropagation()

        const promise = restore({
            documentId,
        })

        toast.promise(promise, {
            loading: "Restoring Note...",
            success: "Note restored",
            error: "Failed to restore!",
        })
    }

    const onRemove = (
        documentId: Id<"documents">
    ) => {
        const promise = remove({
            documentId,
        })

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note Deleted",
            error: "Failed to delete note!",
        })

        if (params.documentId === documentId) {
            router.push(`/documents`)
        }
    }

    if (documents === undefined) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3">
                    <Spinner size="lg" />
                    <span className="text-xs text-white/40">
                        Loading archived notes...
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full text-sm text-white">
            <div className="border-b border-violet-500/10 p-3">
                <div
                    className="
                        flex
                        items-center
                        gap-x-2
                        rounded-xl
                        border
                        border-violet-500/20
                        bg-white/[0.03]
                        px-3
                        backdrop-blur-xl
                    "
                >
                    <Search className="h-4 w-4 text-violet-400" />

                    <Input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search archived notes..."
                        className="
                            border-none
                            bg-transparent
                            text-white
                            placeholder:text-white/30
                            focus-visible:ring-0
                            focus-visible:ring-offset-0
                        "
                    />
                </div>
            </div>

            <div className="px-2 py-2">
                {filteredDocuments?.length === 0 && (
                    <div className="flex h-32 items-center justify-center">
                        <p className="text-xs text-white/40">
                            No archived notes found
                        </p>
                    </div>
                )}

                {filteredDocuments?.map((document) => (
                    <div
                        key={document._id}
                        role="button"
                        onClick={() =>
                            onClick(document._id)
                        }
                        className="
                            group
                            mb-1
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-xl
                            px-3
                            py-2
                            transition-all
                            duration-200
                            hover:bg-violet-500/10
                        "
                    >
                        <span
                            className="
                                truncate
                                font-medium
                                text-white/80
                                transition-colors
                                group-hover:text-white
                            "
                        >
                            {document.title}
                        </span>

                        <div className="flex items-center gap-1">
                            <div
                                role="button"
                                onClick={(e) =>
                                    onRestore(
                                        e,
                                        document._id
                                    )
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-white/40
                                    transition-all
                                    duration-200
                                    hover:bg-violet-500/15
                                    hover:text-violet-300
                                "
                            >
                                <Undo className="h-4 w-4" />
                            </div>

                            <ConfirmModal
                                onConfirm={() =>
                                    onRemove(document._id)
                                }
                            >
                                <div
                                    role="button"
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        text-white/40
                                        transition-all
                                        duration-200
                                        hover:bg-red-500/10
                                        hover:text-red-300
                                    "
                                >
                                    <Trash className="h-4 w-4" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrashBox