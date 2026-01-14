"use client"

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import { Cal_Sans } from "next/font/google";
import Link from "next/link";

const Heading = () => {
    const {isAuthenticated,isLoading} = useConvexAuth()
    return ( 
        <div className="max-w-3xl space-y-4 dark:bg-[#1F1F1F]"> 
            <h1 className="text-3xl sm:text-2xl md:text-6xl font-bold">
                ANOTHER BRAIN OF YOURS <span className="underline">SECONDBRAIN</span>
            </h1>
            <h3 className="sm:text-xl md:text-2xl font-medium">
                Now manage tasks faster and better
            </h3>
            {
                isLoading && (
                    <>
                        <div className="flex items-center justify-center">
                           <Spinner size="lg"/>
                        </div>
                    </>
                )
            }
            {isAuthenticated && !isLoading && (
                <Button className="font-light" asChild>
                    <Link href="/documents">
                        enter
                        <ArrowRight className=" h-4 w-4 ml-4"></ArrowRight>
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button >Get SecondBrain
                        <ArrowRight className="h-4 w-4 ml-2"></ArrowRight>
                    </Button>
                </SignInButton>
            )}
        </div>
     );
}
 
export default Heading;