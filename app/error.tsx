"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const Error = () => {
    return ( 
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div>page does not exist</div>
            <div>Something went wrong!</div>
            <Button asChild>
                <Link href={"/documents"}>
                    Go Back
                </Link>
            </Button>
        </div>
     );
}
 
export default Error;