"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { ChildProcess } from "child_process";


interface ConfirmModalProps {
    children : React.ReactNode;
    onConfirm : () => void;
}

export const ConfirmModal = ({children,onConfirm} : ConfirmModalProps) => {
    const handleConfirm = (e : React.MouseEvent<HTMLButtonElement>)=>{
        e.stopPropagation();
        onConfirm();
    }
        return (
            <AlertDialog>
                <AlertDialogTrigger onClick={(e)=> e.stopPropagation()} asChild>
                    {children}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This note will be permanently deleted
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                            cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
}