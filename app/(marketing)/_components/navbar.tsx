"use client"
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../../../components/modeToggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link  from "next/link";

const Navbar = () => {
    const scroll = useScroll()
    const {isAuthenticated,isLoading} = useConvexAuth()
    return ( 
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",scroll && "border-b shadow-sm"
    )}>
            <span className="hidden md:block">Logo</span>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {isLoading && (
                    <Spinner/>
                )}
                {!isAuthenticated && !isLoading && (
                    <div>
                        <SignInButton mode="modal">
                            <Button variant={"ghost"}>
                                Login
                            </Button>
                        </SignInButton>
                    </div>
                )}
                {isAuthenticated && !isLoading &&
                    (<>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">
                                Enter SecondBrain
                            </Link>
                        </Button>
                        <UserButton afterSwitchSessionUrl="/"/>
                    </>)
                }
                <ModeToggle/>
            </div>
        </div>
     );
}
 
export default Navbar;