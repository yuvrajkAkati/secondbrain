"use client"

import EmojiPicker, { Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"

interface IconPickerProps {
    onChange: (icon: string) => void
    children: React.ReactNode
    asChild?: boolean
}

export const IconPicker = ({
    onChange,
    children,
    asChild,
}: IconPickerProps) => {
    const { resolvedTheme } = useTheme()

    const themeMap = {
        dark: Theme.DARK,
        light: Theme.LIGHT,
    }

    const currentTheme =
        (resolvedTheme || "dark") as keyof typeof themeMap

    const theme = themeMap[currentTheme]

    return (
        <Popover>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>

            <PopoverContent
                sideOffset={10}
                className="
                    w-fit
                    overflow-hidden
                    rounded-2xl
                    border
                    border-violet-500/20
                    bg-black/90
                    p-0
                    shadow-[0_0_50px_rgba(139,92,246,0.25)]
                    backdrop-blur-2xl
                "
            >
                <div className="bg-gradient-to-b from-violet-950/40 to-black">
                    <EmojiPicker
                        height={380}
                        theme={theme}
                        onEmojiClick={(data) => onChange(data.emoji)}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}