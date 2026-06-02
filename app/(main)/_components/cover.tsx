"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useCoverImage } from "@/hooks/use-cover-image"
import { useEdgeStore } from "@/lib/edgestore"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

interface CoverProps {
    url?: string
    preview?: boolean
}

const Cover = ({ url, preview }: CoverProps) => {
    const { edgestore } = useEdgeStore()
    const params = useParams()
    const coverImage = useCoverImage()
    const removeCoverImage = useMutation(api.document.removeCoverImage)

    const onRemove = async () => {
        if (url) {
            await edgestore.publicFiles.delete({
                url: url
            })
        }

        removeCoverImage({
            id: params.documentId as Id<"documents">
        })
    }

    return (
        <div
            className={cn(
                "group relative w-full overflow-hidden",
                !url && "h-[12vh]",
                url && "h-[35vh] bg-black"
            )}
        >
            {!!url && (
                <>
                    <Image
                        src={url}
                        fill
                        alt="Cover"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),transparent_60%)]" />
                </>
            )}

            {!preview && url && (
                <div className="absolute bottom-6 right-6 flex items-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Button
                        onClick={() => coverImage.onReplace(url)}
                        size="sm"
                        className="h-9 rounded-full border border-violet-500/20 bg-black/50 px-4 text-xs text-white backdrop-blur-xl transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-600 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                    >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Change Cover
                    </Button>

                    <Button
                        onClick={onRemove}
                        size="sm"
                        className="h-9 rounded-full border border-white/10 bg-black/50 px-4 text-xs text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                    </Button>
                </div>
            )}

            {!url && (
                <div className="flex h-full w-full items-center justify-center border-b border-violet-500/10 bg-gradient-to-r from-black via-violet-950/80 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_70%)]" />
                </div>
            )}
        </div>
    )
}

Cover.Skeleton = function CoverSkeleton() {
    return (
        <Skeleton className="h-[12vh] w-full rounded-none bg-gradient-to-r from-black via-violet-950/50 to-black" />
    )
}

export default Cover