import { Button } from "@/components/ui/button"

const Footer = () => {
    return (
        <footer
            className="
                relative
                z-50
                flex
                w-full
                items-center
                justify-between
                border-t
                border-violet-500/10
                bg-black/80
                px-8
                py-6
                backdrop-blur-2xl
            "
        >
            <div className="flex items-center gap-3">
                <div
                    className="
                        h-8
                        w-8
                        rounded-xl
                        bg-gradient-to-br
                        from-violet-400
                        to-violet-700
                        shadow-[0_0_20px_rgba(139,92,246,0.3)]
                    "
                />

                <span
                    className="
                        bg-gradient-to-r
                        from-white
                        via-violet-200
                        to-violet-400
                        bg-clip-text
                        text-lg
                        font-bold
                        text-transparent
                    "
                >
                    SecondBrain
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="
                        rounded-xl
                        text-white/50
                        transition-all
                        duration-200
                        hover:bg-violet-500/10
                        hover:text-violet-300
                    "
                >
                    Privacy Policy
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="
                        rounded-xl
                        text-white/50
                        transition-all
                        duration-200
                        hover:bg-violet-500/10
                        hover:text-violet-300
                    "
                >
                    Terms & Conditions
                </Button>
            </div>
        </footer>
    )
}

export default Footer