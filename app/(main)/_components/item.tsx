"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import {
    ChevronDown,
    ChevronRight,
    LucideIcon,
    MoreHorizontal,
    Plus,
    Trash,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ItemProps {
    id?: Id<"documents">
    documentIcon?: string
    active?: boolean
    expanded?: boolean
    isSearch?: boolean
    level?: number
    onExpand?: () => void
    label: string
    onClick: () => void
    icon: LucideIcon
}

const Item = ({
    id,
    label,
    onClick,
    icon: Icon,
    documentIcon,
    active,
    expanded,
    isSearch,
    level,
    onExpand,
}: ItemProps) => {
    const { user } = useUser()
    const mutation = useMutation(api.document.create)
    const archive = useMutation(api.document.archive)
    const router = useRouter()

    const onArchive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()

        if (!id) return

        const promise = archive({
            documentId: id,
        })

        toast.promise(promise, {
            success: "Note deleted!",
            loading: "Deleting...",
            error: "Failed to delete note",
        })
    }

    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()
        onExpand?.()
    }

    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()

        if (!id) return

        const promise = mutation({
            title: "untitled",
            parentDocument: id,
        }).then(() => {
            if (!expanded) {
                onExpand?.()
            }
        })

        toast.promise(promise, {
            loading: "Creating...",
            success: "New note created",
            error: "Failed to create!",
        })
    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight

    return (
        <div
            onClick={onClick}
            role="button"
            style={{
                paddingLeft: level
                    ? `${level * 14 + 14}px`
                    : "14px",
            }}
            className={cn(
                "group relative flex w-full items-center gap-2 rounded-xl py-2 pr-2 text-sm text-white/65 transition-all duration-200",
                "hover:bg-violet-500/10 hover:text-white",
                active &&
                    "border border-violet-500/20 bg-gradient-to-r from-violet-600/20 to-violet-500/5 text-white shadow-[0_0_25px_rgba(139,92,246,0.15)]"
            )}
        >
            {!!id && (
                <div
                    role="button"
                    onClick={handleExpand}
                    className="flex h-5 w-5 items-center justify-center rounded-md text-white/40 transition-all duration-200 hover:bg-violet-500/10 hover:text-violet-300"
                >
                    <ChevronIcon className="h-4 w-4" />
                </div>
            )}

            {documentIcon ? (
                <div className="flex items-center justify-center text-lg">
                    {documentIcon}
                </div>
            ) : (
                <Icon className="h-4 w-4 shrink-0 text-violet-300/80" />
            )}

            <span className="truncate font-medium tracking-tight">
                {label}
            </span>

            {isSearch && (
                <kbd className="ml-auto rounded-md border border-violet-500/20 bg-black/40 px-2 py-0.5 text-[10px] text-white/50 backdrop-blur-md">
                    CTRL + K
                </kbd>
            )}

            {!!id && (
                <div className="ml-auto flex items-center gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            asChild
                        >
                            <div
                                className="
                                    flex h-7 w-7 items-center justify-center
                                    rounded-lg
                                    opacity-0
                                    transition-all
                                    duration-200
                                    group-hover:opacity-100
                                    hover:bg-violet-500/15
                                    data-[state=open]:opacity-100
                                "
                            >
                                <MoreHorizontal className="h-4 w-4 text-white/60" />
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="
                                w-60
                                border
                                border-violet-500/20
                                bg-black/90
                                text-white
                                backdrop-blur-2xl
                                shadow-[0_0_40px_rgba(139,92,246,0.15)]
                            "
                            align="start"
                            side="right"
                            sideOffset={10}
                            forceMount
                        >
                            <DropdownMenuItem
                                onClick={onArchive}
                                className="
                                    cursor-pointer
                                    rounded-md
                                    transition-colors
                                    hover:bg-red-500/10
                                    hover:text-red-300
                                "
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-violet-500/10" />

                            <div className="px-2 py-2 text-xs text-white/40">
                                Last edited by {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div
                        className="
                            flex h-7 w-7 items-center justify-center
                            rounded-lg
                            opacity-0
                            transition-all
                            duration-200
                            group-hover:opacity-100
                            hover:bg-violet-500/15
                            hover:text-violet-300
                        "
                        role="button"
                        onClick={onCreate}
                    >
                        <Plus className="h-4 w-4" />
                    </div>
                </div>
            )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({
    level,
}: {
    level?: number
}) {
    return (
        <div
            style={{
                paddingLeft: level
                    ? `${level * 12 + 25}px`
                    : "12px",
            }}
            className="flex gap-x-3 py-2"
        >
            <Skeleton className="h-4 w-4 rounded-md bg-violet-900/60" />
            <Skeleton className="h-4 w-[70%] rounded-md bg-violet-800/40" />
        </div>
    )
}

export default Item