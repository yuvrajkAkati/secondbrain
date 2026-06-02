"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import React, { useRef, useState } from "react"

interface TitleProps {
    initialData: Doc<"documents">
}

const Title = ({ initialData }: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const update = useMutation(api.document.update)

    const [title, setTitle] = useState(
        initialData?.title || "Untitled"
    )

    const [isEditing, setIsEditing] = useState(false)

    const enableInput = () => {
        setTitle(initialData.title)
        setIsEditing(true)

        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(
                0,
                inputRef.current.value.length
            )
        }, 0)
    }

    const disableInput = () => {
        setIsEditing(false)
    }

    const onChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTitle(event.target.value)

        update({
            id: initialData._id,
            title: event.target.value || "Untitled",
        })
    }

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            disableInput()
        }
    }

    return (
        <div className="flex items-center gap-x-3">
            {!!initialData?.icon && (
                <div
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-500/10
                        text-xl
                        shadow-[0_0_20px_rgba(139,92,246,0.15)]
                    "
                >
                    {initialData.icon}
                </div>
            )}

            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="
                        h-10
                        min-w-[220px]
                        rounded-xl
                        border
                        border-violet-500/20
                        bg-black/50
                        px-3
                        text-base
                        font-semibold
                        text-white
                        backdrop-blur-xl
                        transition-all
                        duration-200
                        focus-visible:border-violet-400/40
                        focus-visible:ring-0
                        focus-visible:shadow-[0_0_25px_rgba(139,92,246,0.2)]
                    "
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="
                        h-auto
                        rounded-xl
                        px-3
                        py-2
                        text-left
                        transition-all
                        duration-200
                        hover:bg-violet-500/10
                    "
                >
                    <span
                        className="
                            max-w-[400px]
                            truncate
                            bg-gradient-to-r
                            from-white
                            via-violet-100
                            to-violet-300
                            bg-clip-text
                            text-lg
                            font-semibold
                            text-transparent
                        "
                    >
                        {initialData.title}
                    </span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl bg-violet-900/40" />
            <Skeleton className="h-9 w-40 rounded-xl bg-violet-800/30" />
        </div>
    )
}

export default Title