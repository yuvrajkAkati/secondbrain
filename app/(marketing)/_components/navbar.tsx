"use client"

import useScroll from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { ModeToggle } from "../../../components/modeToggle"
import { useConvexAuth } from "convex/react"
import {
    SignInButton,
    UserButton,
} from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const Navbar = () => {
    const scroll = useScroll()

    const {
        isAuthenticated,
        isLoading,
    } = useConvexAuth()

    return (
        <header
            className={cn(
                `
                fixed
                top-0
                z-50
                w-full
                transition-all
                duration-300
                `,
                scroll
                    ? `
                    border-b
                    border-violet-500/10
                    bg-black/80
                    backdrop-blur-2xl
                    `
                    : `
                    bg-transparent
                    `
            )}
        >
            <div
                className="
                    mx-auto
                    flex
                    h-20
                    max-w-7xl
                    items-center
                    px-6
                "
            >
                <Link
                    href="/"
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
                            h-10
                            w-10
                            rounded-2xl
                            bg-gradient-to-br
                            from-violet-400
                            to-violet-700
                            shadow-[0_0_25px_rgba(139,92,246,0.35)]
                        "
                    />

                    <span
                        className="
                            hidden
                            bg-gradient-to-r
                            from-white
                            via-violet-200
                            to-violet-400
                            bg-clip-text
                            text-xl
                            font-bold
                            text-transparent
                            md:block
                        "
                    >
                        SecondBrain
                    </span>
                </Link>

                <div
                    className="
                        ml-auto
                        flex
                        items-center
                        gap-3
                    "
                >
                    {isLoading && (
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                            "
                        >
                            <Spinner />
                        </div>
                    )}

                    {!isAuthenticated &&
                        !isLoading && (
                            <SignInButton mode="modal">
                                <Button
                                    variant="ghost"
                                    className="
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
                                    "
                                >
                                    Login
                                </Button>
                            </SignInButton>
                        )}

                    {isAuthenticated &&
                        !isLoading && (
                            <>
                                <Button
                                    asChild
                                    className="
                                        rounded-xl
                                        bg-gradient-to-r
                                        from-violet-600
                                        to-violet-500
                                        text-white
                                        shadow-[0_0_25px_rgba(139,92,246,0.25)]
                                        transition-all
                                        duration-200
                                        hover:from-violet-500
                                        hover:to-violet-400
                                    "
                                >
                                    <Link href="/documents">
                                        Enter Workspace
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>

                                <div
                                    className="
                                        rounded-full
                                        border
                                        border-violet-500/20
                                        p-[2px]
                                    "
                                >
                                    <UserButton afterSwitchSessionUrl="/" />
                                </div>
                            </>
                        )}

                    <div
                        className="
                            rounded-xl
                            border
                            border-violet-500/10
                            bg-white/[0.03]
                            p-1
                            backdrop-blur-xl
                        "
                    >
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar