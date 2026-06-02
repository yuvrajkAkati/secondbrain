"use client"

import { Doc } from "@/convex/_generated/dataModel"
import { IconPicker } from "./icon-picker"
import { Button } from "@/components/ui/button"
import { ImageIcon, Smile, X } from "lucide-react"
import { useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import TextareaAutosize from "react-textarea-autosize"
import { useCoverImage } from "@/hooks/use-cover-image"

interface ToolBarProps {
    initialData: Doc<"documents">
    preview?: boolean
}

const ToolBar = ({
    initialData,
    preview,
}: ToolBarProps) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const removeIcon = useMutation(api.document.removeIcon)
    const update = useMutation(api.document.update)

    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialData.title)

    const coverImage = useCoverImage()

    const enableInput = () => {
        if (preview) return

        setIsEditing(true)

        setTimeout(() => {
            setValue(initialData.title)
            inputRef.current?.focus()
        }, 0)
    }

    const disableInput = () => {
        setIsEditing(false)
    }

    const onInput = (value: string) => {
        setValue(value)

        update({
            id: initialData._id,
            title: value || "Untitled",
        })
    }

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault()
            disableInput()
        }
    }

    const onIconSelect = (icon: string) => {
        update({
            id: initialData._id,
            icon,
        })
    }

    const onRemoveIcon = () => {
        removeIcon({
            id: initialData._id,
        })
    }

    return (
        <div className="group relative pl-[54px]">
            {!!initialData.icon && !preview && (
                <div className="group/icon flex items-center gap-x-3 pt-8">
                    <IconPicker onChange={onIconSelect}>
                        <div
                            className="
                                flex
                                h-24
                                w-24
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-3xl
                                bg-violet-500/10
                                text-7xl
                                shadow-[0_0_40px_rgba(139,92,246,0.15)]
                                transition-all
                                duration-300
                                hover:scale-105
                                hover:bg-violet-500/15
                            "
                        >
                            {initialData.icon}
                        </div>
                    </IconPicker>

                    <Button
                        onClick={onRemoveIcon}
                        variant="ghost"
                        size="icon"
                        className="
                            rounded-xl
                            border
                            border-violet-500/20
                            bg-black/40
                            text-white/50
                            opacity-0
                            backdrop-blur-xl
                            transition-all
                            duration-200
                            group-hover/icon:opacity-100
                            hover:border-red-500/30
                            hover:bg-red-500/10
                            hover:text-red-300
                        "
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {!!initialData.icon && preview && (
                <div
                    className="
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-3xl
                        bg-violet-500/10
                        pt-0
                        text-7xl
                        shadow-[0_0_40px_rgba(139,92,246,0.15)]
                    "
                >
                    {initialData.icon}
                </div>
            )}

            {!preview && (
                <div
                    className="
                        flex
                        items-center
                        gap-x-2
                        py-5
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                    "
                >
                    {!initialData.icon && (
                        <IconPicker asChild onChange={onIconSelect}>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="
                                    rounded-xl
                                    border
                                    border-violet-500/20
                                    bg-white/[0.03]
                                    text-white/70
                                    backdrop-blur-xl
                                    transition-all
                                    duration-200
                                    hover:border-violet-400/30
                                    hover:bg-violet-500/10
                                    hover:text-white
                                "
                            >
                                <Smile className="mr-2 h-4 w-4 text-violet-400" />
                                Add Icon
                            </Button>
                        </IconPicker>
                    )}

                    {!initialData.coverImage && (
                        <Button
                            onClick={coverImage.onOpen}
                            size="sm"
                            variant="ghost"
                            className="
                                rounded-xl
                                border
                                border-violet-500/20
                                bg-white/[0.03]
                                text-white/70
                                backdrop-blur-xl
                                transition-all
                                duration-200
                                hover:border-violet-400/30
                                hover:bg-violet-500/10
                                hover:text-white
                            "
                        >
                            <ImageIcon className="mr-2 h-4 w-4 text-violet-400" />
                            Add Cover
                        </Button>
                    )}
                </div>
            )}

            {isEditing && !preview ? (
                <TextareaAutosize
                    ref={inputRef}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className="
                        w-full
                        resize-none
                        bg-transparent
                        text-6xl
                        font-extrabold
                        tracking-tight
                        text-white
                        outline-none
                    "
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="
                        cursor-text
                        pb-3
                        bg-gradient-to-r
                        from-white
                        via-violet-100
                        to-violet-300
                        bg-clip-text
                        text-6xl
                        font-extrabold
                        tracking-tight
                        text-transparent
                    "
                >
                    {initialData.title}
                </div>
            )}
        </div>
    )
}

export default ToolBar