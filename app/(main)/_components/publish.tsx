"use client"

import { Button } from "@/components/ui/button"
import { Doc } from "@/convex/_generated/dataModel"

interface PublishProps {
    initialData: Doc<"documents">
}

import {
    PopoverTrigger,
    PopoverContent,
    Popover,
} from "@/components/ui/popover"
import { useOrigin } from "@/hooks/use-origin"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { toast } from "sonner"
import { Check, Copy, Globe } from "lucide-react"

const Publish = ({
    initialData,
}: PublishProps) => {
    const origin = useOrigin()
    const update = useMutation(api.document.update)

    const [copied, setCopied] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const url = `${origin}/preview/${initialData._id}`

    const onPublish = () => {
        setIsSubmitting(true)

        const promise = update({
            id: initialData._id,
            isPublished: true,
        }).finally(() => setIsSubmitting(false))

        toast.promise(promise, {
            success: "Document published!",
            error: "Failed to publish document.",
            loading: "Publishing document...",
        })
    }

    const unPublish = () => {
        setIsSubmitting(true)

        const promise = update({
            id: initialData._id,
            isPublished: false,
        }).finally(() => setIsSubmitting(false))

        toast.promise(promise, {
            success: "Document unpublished!",
            error: "Failed to unpublish document.",
            loading: "Unpublishing document...",
        })
    }

    const onCopy = () => {
        navigator.clipboard.writeText(url)

        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="
                        h-9
                        rounded-xl
                        border
                        border-violet-500/20
                        bg-white/[0.03]
                        text-white/80
                        backdrop-blur-xl
                        transition-all
                        duration-200
                        hover:border-violet-400/30
                        hover:bg-violet-500/10
                        hover:text-white
                        hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]
                    "
                >
                    Publish

                    {initialData.isPublished && (
                        <Globe className="ml-2 h-4 w-4 text-violet-400" />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="
                    w-80
                    border
                    border-violet-500/20
                    bg-black/95
                    p-5
                    text-white
                    backdrop-blur-2xl
                    shadow-[0_0_50px_rgba(139,92,246,0.15)]
                "
                align="end"
                alignOffset={8}
                forceMount
            >
                {initialData.isPublished ? (
                    <div className="space-y-5">
                        <div className="flex items-center gap-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15">
                                <Globe className="h-4 w-4 text-violet-400" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-violet-300">
                                    Published
                                </p>
                                <p className="text-xs text-white/40">
                                    This note is live and shareable.
                                </p>
                            </div>
                        </div>

                        <div className="flex overflow-hidden rounded-xl border border-violet-500/20 bg-white/[0.03]">
                            <input
                                type="text"
                                value={url}
                                disabled
                                className="
                                    h-10
                                    flex-1
                                    bg-transparent
                                    px-3
                                    text-xs
                                    text-white/70
                                    outline-none
                                "
                            />

                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="
                                    h-10
                                    rounded-none
                                    border-l
                                    border-violet-500/20
                                    bg-violet-600
                                    hover:bg-violet-500
                                "
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            disabled={isSubmitting}
                            onClick={unPublish}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-red-500/20
                                bg-red-500/10
                                text-red-300
                                transition-all
                                duration-200
                                hover:bg-red-500/20
                            "
                        >
                            Unpublish Note
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                            <Globe className="h-7 w-7 text-violet-400" />
                        </div>

                        <p className="mb-2 text-base font-semibold text-white">
                            Publish this note
                        </p>

                        <span className="mb-6 text-center text-sm text-white/50">
                            Share your work publicly with a unique link.
                        </span>

                        <Button
                            disabled={isSubmitting}
                            onClick={onPublish}
                            className="
                                w-full
                                rounded-xl
                                bg-gradient-to-r
                                from-violet-600
                                to-violet-500
                                text-white
                                shadow-[0_0_25px_rgba(139,92,246,0.35)]
                                transition-all
                                duration-200
                                hover:from-violet-500
                                hover:to-violet-400
                            "
                            size="sm"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

export default Publish