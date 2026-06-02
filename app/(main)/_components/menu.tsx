"use client"

import { Id } from "@/convex/_generated/dataModel"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuProps {
    documentId: Id<"documents">
}

const Menu = ({ documentId }: MenuProps) => {
    const router = useRouter()
    const { user } = useUser()
    const archive = useMutation(api.document.archive)

    const onArchive = () => {
        const promise = archive({
            documentId: documentId,
        })

        toast.promise(promise, {
            success: "Note deleted",
            loading: "Deleting note...",
            error: "Failed to delete note",
        })

        router.push("/documents")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="
                        mr-2
                        h-9
                        w-9
                        rounded-xl
                        border
                        border-transparent
                        bg-transparent
                        text-white/60
                        transition-all
                        duration-200
                        hover:border-violet-500/20
                        hover:bg-violet-500/10
                        hover:text-white
                        hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]
                    "
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="
                    w-64
                    border
                    border-violet-500/20
                    bg-black/90
                    text-white
                    backdrop-blur-2xl
                    shadow-[0_0_40px_rgba(139,92,246,0.15)]
                "
                align="end"
                alignOffset={8}
                forceMount
            >
                <DropdownMenuItem
                    onClick={onArchive}
                    className="
                        cursor-pointer
                        rounded-lg
                        transition-all
                        duration-200
                        hover:bg-red-500/10
                        hover:text-red-300
                    "
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-violet-500/10" />

                <div className="px-3 py-3 text-xs text-white/40">
                    Last edited by {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className="h-9 w-9 rounded-xl bg-violet-900/40" />
    )
}

export default Menu