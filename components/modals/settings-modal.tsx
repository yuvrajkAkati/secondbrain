"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useSettings } from "@/hooks/use-settings"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/modeToggle"
import { Palette } from "lucide-react"

export const SettingsModal = () => {
    const settings = useSettings()

    return (
        <Dialog
            open={settings.isOpen}
            onOpenChange={settings.onClose}
        >
            <DialogContent
                className="
                    border
                    border-violet-500/20
                    bg-black/95
                    text-white
                    backdrop-blur-2xl
                    shadow-[0_0_60px_rgba(139,92,246,0.2)]
                    sm:max-w-lg
                "
            >
                <DialogHeader
                    className="
                        border-b
                        border-violet-500/10
                        pb-5
                    "
                >
                    <div
                        className="
                            mb-4
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-violet-500/10
                        "
                    >
                        <Palette className="h-7 w-7 text-violet-400" />
                    </div>

                    <DialogTitle
                        className="
                            text-2xl
                            font-bold
                            text-white
                        "
                    >
                        Settings
                    </DialogTitle>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-white/50
                        "
                    >
                        Personalize your SecondBrain
                        experience.
                    </p>
                </DialogHeader>

                <div
                    className="
                        rounded-2xl
                        border
                        border-violet-500/10
                        bg-white/[0.02]
                        p-5
                    "
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-1">
                            <Label
                                className="
                                    text-sm
                                    font-semibold
                                    text-white
                                "
                            >
                                Appearance
                            </Label>

                            <span
                                className="
                                    text-xs
                                    text-white/40
                                "
                            >
                                Choose your preferred
                                theme and visual style.
                            </span>
                        </div>

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
            </DialogContent>
        </Dialog>
    )
}