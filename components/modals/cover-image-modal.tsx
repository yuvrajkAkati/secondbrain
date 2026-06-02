"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCoverImage } from "@/hooks/use-cover-image"
import { SingleImageDropzone } from "../upload/single-image"
import { useState } from "react"
import { useEdgeStore } from "@/lib/edgestore"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { Loader2, ImageIcon } from "lucide-react"

export const CoverImageModal = () => {
    const params = useParams()

    const update = useMutation(api.document.update)

    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const coverImage = useCoverImage()

    const { edgestore } = useEdgeStore()

    const [file, setFile] =
        useState<File | null>(null)

    const onClose = () => {
        setIsSubmitting(false)
        setFile(null)
        coverImage.onClose()
    }

    const onChange = async (
        file?: File
    ) => {
        if (!file) return

        try {
            setIsSubmitting(true)
            setFile(file)

            const res =
                await edgestore.publicFiles.upload({
                    file,
                    options: {
                        replaceTargetUrl:
                            coverImage.url,
                    },
                    onProgressChange: (
                        progress
                    ) => {
                        console.log(
                            `Upload progress: ${progress}%`
                        )
                    },
                })

            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url,
            })

            onClose()
        } catch (error) {
            console.error(
                "Error uploading cover image:",
                error
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            open={coverImage.isOpen}
            onOpenChange={coverImage.onClose}
        >
            <DialogContent
                className="
                    border
                    border-violet-500/20
                    bg-black/95
                    text-white
                    backdrop-blur-2xl
                    shadow-[0_0_60px_rgba(139,92,246,0.2)]
                    sm:max-w-xl
                "
            >
                <DialogHeader className="space-y-4">
                    <div
                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-violet-500/10
                        "
                    >
                        <ImageIcon className="h-7 w-7 text-violet-400" />
                    </div>

                    <DialogTitle
                        className="
                            text-center
                            text-2xl
                            font-bold
                            text-white
                        "
                    >
                        Cover Image
                    </DialogTitle>

                    <p
                        className="
                            text-center
                            text-sm
                            text-white/50
                        "
                    >
                        Upload a beautiful cover image
                        for your document.
                    </p>
                </DialogHeader>

                <div
                    className="
                        rounded-2xl
                        border
                        border-violet-500/10
                        bg-white/[0.02]
                        p-3
                    "
                >
                    <SingleImageDropzone
                        className="
                            w-full
                            rounded-xl
                            border-none
                            bg-transparent
                            outline-none
                        "
                        disabled={isSubmitting}
                        onChange={onChange}
                        width={400}
                        height={220}
                        dropzoneOptions={{
                            maxSize:
                                5 * 1024 * 1024,
                        }}
                    />
                </div>

                {isSubmitting && (
                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            rounded-xl
                            border
                            border-violet-500/10
                            bg-violet-500/5
                            py-3
                        "
                    >
                        <Loader2 className="h-4 w-4 animate-spin text-violet-400" />

                        <p className="text-sm text-violet-200">
                            Uploading cover image...
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}