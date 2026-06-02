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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmModalProps {
    children: React.ReactNode
    onConfirm: () => void
}

export const ConfirmModal = ({
    children,
    onConfirm,
}: ConfirmModalProps) => {
    const handleConfirm = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation()
        onConfirm()
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                onClick={(e) => e.stopPropagation()}
                asChild
            >
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent
                className="
                    border
                    border-violet-500/20
                    bg-black/95
                    text-white
                    backdrop-blur-2xl
                    shadow-[0_0_60px_rgba(139,92,246,0.2)]
                "
            >
                <AlertDialogHeader>
                    <div
                        className="
                            mx-auto
                            mb-4
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-red-500/10
                        "
                    >
                        <div
                            className="
                                h-6
                                w-6
                                rounded-full
                                bg-red-500
                            "
                        />
                    </div>

                    <AlertDialogTitle
                        className="
                            text-center
                            text-2xl
                            font-bold
                            text-white
                        "
                    >
                        Delete Note?
                    </AlertDialogTitle>

                    <AlertDialogDescription
                        className="
                            text-center
                            text-white/50
                        "
                    >
                        This action cannot be undone.
                        The note and all associated
                        content will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        className="
                            border
                            border-violet-500/20
                            bg-white/[0.03]
                            text-white/70
                            backdrop-blur-xl
                            transition-all
                            duration-200
                            hover:bg-violet-500/10
                            hover:text-white
                        "
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="
                            bg-gradient-to-r
                            from-red-600
                            to-red-500
                            text-white
                            shadow-[0_0_25px_rgba(239,68,68,0.25)]
                            transition-all
                            duration-200
                            hover:from-red-500
                            hover:to-red-400
                        "
                    >
                        Delete Forever
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}