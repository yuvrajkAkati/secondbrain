"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import Title from "./title"
import { useQuery } from "convex/react"
import { MenuIcon } from "lucide-react"
import { useParams } from "next/navigation"
import Banner from "./banner"
import Menu from "./menu"
import Publish from "./publish"

interface NavbarProps {
    isCollapsed: boolean
    onResetWidth: () => void
}

const Navbar = ({
    isCollapsed,
    onResetWidth,
}: NavbarProps) => {
    const params = useParams()

    const document = useQuery(api.document.getById, {
        documentId: params.documentId as Id<"documents">,
    })

    if (document === undefined) {
        return (
            <div className="flex w-full items-center justify-between border-b border-violet-500/10 bg-black/40 px-6 py-5 backdrop-blur-xl">
                <Title.Skeleton />
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton />
                </div>
            </div>
        )
    }

    if (document === null) {
        return null
    }

    return (
        <>
            <nav
                className="
                    sticky
                    top-0
                    z-40
                    flex
                    w-full
                    items-center
                    gap-x-4
                    border-b
                    border-violet-500/10
                    bg-black/60
                    px-6
                    py-4
                    backdrop-blur-2xl
                "
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_60%)]" />

                {isCollapsed && (
                    <div
                        role="button"
                        onClick={onResetWidth}
                        className="
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-violet-500/10
                            bg-white/[0.03]
                            text-white/70
                            transition-all
                            duration-200
                            hover:border-violet-500/30
                            hover:bg-violet-500/10
                            hover:text-white
                            hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]
                        "
                    >
                        <MenuIcon className="h-5 w-5" />
                    </div>
                )}

                <div className="relative flex w-full items-center justify-between">
                    <Title initialData={document} />

                    <div className="flex items-center gap-x-2">
                        <Publish initialData={document} />
                        <Menu documentId={document._id} />
                    </div>
                </div>
            </nav>

            {document.isArchived && (
                <Banner documentId={document._id} />
            )}
        </>
    )
}

export default Navbar