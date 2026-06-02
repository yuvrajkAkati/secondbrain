"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"

const DocumentsPage = () => {
    const { user } = useUser()

    const create = useMutation(api.document.create)

    const onCreate = () => {
        const promise = create({
            title: "Untitled",
        })

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New Note Created!",
            error: "Failed to create a new note.",
        })
    }

    return (
        <div
            className="
                relative
                flex
                h-full
                min-h-screen
                w-full
                items-center
                justify-center
                overflow-hidden
                bg-gradient-to-br
                from-black
                via-black
                to-violet-950/20
            "
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_65%)]" />

            <div
                className="
                    relative
                    flex
                    max-w-2xl
                    flex-col
                    items-center
                    space-y-8
                    rounded-[32px]
                    border
                    border-violet-500/10
                    bg-black/40
                    px-10
                    py-14
                    text-center
                    backdrop-blur-2xl
                "
            >
                <div
                    className="
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-3xl
                        bg-violet-500/10
                        shadow-[0_0_50px_rgba(139,92,246,0.2)]
                    "
                >
                    <div
                        className="
                            h-12
                            w-12
                            rounded-2xl
                            bg-gradient-to-br
                            from-violet-400
                            to-violet-700
                        "
                    />
                </div>

                <div className="space-y-3">
                    <h1
                        className="
                            bg-gradient-to-r
                            from-white
                            via-violet-200
                            to-violet-400
                            bg-clip-text
                            text-5xl
                            font-extrabold
                            tracking-tight
                            text-transparent
                        "
                    >
                        Welcome to {user?.firstName}&apos;s
                        <br />
                        SecondBrain
                    </h1>

                    <p className="max-w-md text-sm text-white/50">
                        Capture ideas, organize knowledge,
                        and build your personal AI-powered
                        workspace.
                    </p>
                </div>

                <Button
                    onClick={onCreate}
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
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Your First Note
                </Button>
            </div>
        </div>
    )
}

export default DocumentsPage