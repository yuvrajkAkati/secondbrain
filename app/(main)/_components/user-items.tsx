"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton, useUser } from "@clerk/clerk-react"
import { ChevronsLeftRight } from "lucide-react"

const UserItems = () => {
    const { user } = useUser()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    className="
                        group
                        m-2
                        flex
                        cursor-pointer
                        items-center
                        rounded-2xl
                        border
                        border-violet-500/10
                        bg-white/[0.03]
                        p-3
                        text-sm
                        backdrop-blur-xl
                        transition-all
                        duration-200
                        hover:border-violet-500/20
                        hover:bg-violet-500/10
                        hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]
                    "
                >
                    <div className="flex w-full items-center gap-x-3">
                        <Avatar className="h-10 w-10 border border-violet-500/20">
                            <AvatarImage src={user?.imageUrl} />
                        </Avatar>

                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-semibold text-white">
                                {user?.firstName}&apos;s Workspace
                            </span>

                            <span className="truncate text-xs text-white/40">
                                Personal knowledge hub
                            </span>
                        </div>

                        <ChevronsLeftRight
                            className="
                                h-4
                                w-4
                                rotate-90
                                text-white/40
                                transition-all
                                duration-200
                                group-hover:text-violet-300
                            "
                        />
                    </div>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="
                    w-80
                    border
                    border-violet-500/20
                    bg-black/95
                    p-2
                    text-white
                    backdrop-blur-2xl
                    shadow-[0_0_50px_rgba(139,92,246,0.2)]
                "
                align="start"
                alignOffset={10}
                forceMount
            >
                <div
                    className="
                        rounded-xl
                        border
                        border-violet-500/10
                        bg-white/[0.02]
                        p-4
                    "
                >
                    <div className="mb-4 flex items-center gap-3">
                        <Avatar className="h-12 w-12 border border-violet-500/20">
                            <AvatarImage src={user?.imageUrl} />
                        </Avatar>

                        <div className="min-w-0">
                            <p className="truncate font-semibold text-white">
                                {user?.fullName}
                            </p>

                            <p className="truncate text-xs text-white/40">
                                {user?.emailAddresses[0].emailAddress}
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                            rounded-lg
                            border
                            border-violet-500/10
                            bg-violet-500/5
                            p-3
                        "
                    >
                        <p className="text-xs text-white/40">
                            Workspace
                        </p>

                        <p className="mt-1 text-sm font-medium text-violet-200">
                            {user?.fullName}&apos;s SecondBrain
                        </p>
                    </div>
                </div>

                <DropdownMenuSeparator className="my-2 bg-violet-500/10" />

                <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-transparent"
                >
                    <SignOutButton>
                        <Button
                            variant="ghost"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-red-500/20
                                bg-red-500/10
                                text-red-300
                                transition-all
                                duration-200
                                hover:bg-red-500/20
                                hover:text-red-200
                            "
                        >
                            Log Out
                        </Button>
                    </SignOutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserItems