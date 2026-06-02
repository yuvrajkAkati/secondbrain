"use client"

import Cover from "@/app/(main)/_components/cover"
import ToolBar from "@/app/(main)/_components/toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import dynamic from "next/dynamic"
import { generateEmbedding } from "@/app/lib/ai/embeddings"
import { extractText } from "@/app/lib/ai/extract-text"

interface DocumentIdPageProps {
    params: Promise<{
        documentId: Id<"documents">
    }>
}

const DocumentIdPage = ({}: DocumentIdPageProps) => {
    const Editor = useMemo(
        () =>
            dynamic(
                () => import("@/components/ui/editor"),
                { ssr: false }
            ),
        []
    )

    const params = useParams()

    const document = useQuery(
        api.document.getById,
        {
            documentId:
                params.documentId as Id<"documents">,
        }
    )

    const updateEmbedding = useMutation(
        api.document.updateEmbedding
    )

    const update = useMutation(
        api.document.update
    )

    const onChange = async (
        content: string
    ) => {
        try {
            const documentId =
                params.documentId as Id<"documents">

            update({
                id: documentId,
                content,
            })

            const plainText =
                extractText(content)

            const embedding =
                await generateEmbedding(
                    plainText
                )

            await updateEmbedding({
                documentId,
                embedding,
            })
        } catch (err) {
            console.error(err)
        }
    }

    if (document === undefined) {
        return (
            <div className="min-h-screen bg-black">
                <Cover.Skeleton />

                <div className="mx-auto mt-12 max-w-5xl px-6">
                    <div className="space-y-5">
                        <Skeleton className="h-16 w-[55%] rounded-2xl bg-violet-900/30" />
                        <Skeleton className="h-4 w-[90%] rounded-xl bg-violet-800/20" />
                        <Skeleton className="h-4 w-[75%] rounded-xl bg-violet-800/20" />
                        <Skeleton className="h-4 w-[60%] rounded-xl bg-violet-800/20" />
                    </div>
                </div>
            </div>
        )
    }

    if (document === null) {
        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-black
                "
            >
                <div
                    className="
                        rounded-3xl
                        border
                        border-violet-500/20
                        bg-black/60
                        px-8
                        py-6
                        text-white/60
                        backdrop-blur-xl
                    "
                >
                    Document not found
                </div>
            </div>
        )
    }

    return (
        <div
            className="
                min-h-screen
                w-full
                bg-gradient-to-br
                from-black
                via-black
                to-violet-950/20
                pb-40
            "
        >
            <div className="w-full">
                <Cover url={document.coverImage} />
            </div>

            <div
                className="
                    relative
                    mx-auto
                    -mt-6
                    flex
                    w-full
                    max-w-7xl
                    justify-center
                    px-4
                    md:px-8
                "
            >
                <div
                    className="
                        w-full
                        max-w-6xl
                        rounded-[32px]
                        border
                        border-violet-500/10
                        bg-black/40
                        p-6
                        backdrop-blur-2xl
                    "
                >
                    <ToolBar
                        initialData={document}
                    />

                    <div className="h-8" />

                    <div
                        className="
                            rounded-3xl
                            border
                            border-violet-500/10
                            bg-white/[0.02]
                            p-4
                            md:p-8
                        "
                    >
                        <Editor
                            onChange={onChange}
                            initialContent={
                                document.content
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocumentIdPage