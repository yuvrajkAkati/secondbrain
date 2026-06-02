"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SignInButton } from "@clerk/clerk-react"
import { useConvexAuth } from "convex/react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth()

    return (
        <div className="relative max-w-5xl space-y-8 text-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_70%)]" />

            <div className="space-y-6">
                <div
                    className="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        border-violet-500/20
                        bg-violet-500/10
                        px-4
                        py-2
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.2em]
                        text-violet-300
                    "
                >
                    AI Powered Knowledge Workspace
                </div>

                <h1
                    className="
                        bg-gradient-to-r
                        from-white
                        via-violet-200
                        to-violet-500
                        bg-clip-text
                        text-5xl
                        font-extrabold
                        tracking-tight
                        text-transparent
                        sm:text-6xl
                        md:text-8xl
                    "
                >
                    YOUR SECOND
                    <br />
                    BRAIN
                </h1>

                <p
                    className="
                        mx-auto
                        max-w-2xl
                        text-lg
                        text-white/60
                        sm:text-xl
                    "
                >
                    Capture ideas, organize knowledge,
                    search with AI, and build a personal
                    workspace that remembers everything.
                </p>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center pt-4">
                    <Spinner size="lg" />
                </div>
            )}

            {isAuthenticated && !isLoading && (
                <Button
                    asChild
                    size="lg"
                    className="
                        rounded-2xl
                        bg-gradient-to-r
                        from-violet-600
                        to-violet-500
                        px-8
                        text-white
                        shadow-[0_0_35px_rgba(139,92,246,0.35)]
                        transition-all
                        duration-200
                        hover:scale-[1.02]
                        hover:from-violet-500
                        hover:to-violet-400
                    "
                >
                    <Link href="/documents">
                        Enter Workspace
                        <ArrowRight className="ml-3 h-4 w-4" />
                    </Link>
                </Button>
            )}

            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button
                        size="lg"
                        className="
                            rounded-2xl
                            bg-gradient-to-r
                            from-violet-600
                            to-violet-500
                            px-8
                            text-white
                            shadow-[0_0_35px_rgba(139,92,246,0.35)]
                            transition-all
                            duration-200
                            hover:scale-[1.02]
                            hover:from-violet-500
                            hover:to-violet-400
                        "
                    >
                        Get SecondBrain
                        <ArrowRight className="ml-3 h-4 w-4" />
                    </Button>
                </SignInButton>
            )}
        </div>
    )
}

export default Heading