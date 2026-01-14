
"use client"

import {Avatar,AvatarImage} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SignOutButton, useUser } from "@clerk/clerk-react"
import { ChevronsLeftRight } from "lucide-react"

const UserItems = () => {
    const {user} = useUser()
    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center p-3 text-sm w-full hover:bg-purple-700/8">
                    <div className=" gap-x-2 max-w-[150px] flex items-center">
                        <Avatar className="">
                            <AvatarImage src={user?.imageUrl}></AvatarImage>
                        </Avatar>
                        <span className="text-start line-clamp-1 font-medium ">{user?.firstName}&apos;s workspace</span>
                        <ChevronsLeftRight className="rotate-90 "></ChevronsLeftRight>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-76" align="start" alignOffset={10} forceMount>
                <div className="flex flex-col space-y-5 p-2 text-muted-foreground leading-none ">
                    <p>
                        {user?.emailAddresses[0].emailAddress}
                    </p>
                    <div className="flex items-center gap-x-3">
                        <Avatar className="h-7 w-7">
                            <AvatarImage src={user?.imageUrl}></AvatarImage>
                        </Avatar>
                        <span> {user?.fullName}&apos;s SecondBrain</span>
                    </div> 
                </div>
                <DropdownMenuSeparator>  
                </DropdownMenuSeparator>
                <DropdownMenuItem asChild className=" w-full flex items-center justify-center">
                    <SignOutButton>
                            <Button variant={"destructive"} className="">Log out</Button>
                    </SignOutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     );
}
 
export default UserItems;