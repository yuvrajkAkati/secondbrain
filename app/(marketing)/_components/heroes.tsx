"use client"

const Heroes = () => {
    return (
        <div className="relative flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

            <div className="relative flex items-center justify-center">
                <div
                    className="
                        relative
                        h-[320px]
                        w-[320px]
                        sm:h-[380px]
                        sm:w-[380px]
                        md:h-[520px]
                        md:w-[520px]
                    "
                >
                    <div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            h-[380px]
                            w-[280px]
                            -translate-x-1/2
                            -translate-y-1/2
                            rotate-[-10deg]
                            rounded-[32px]
                            border
                            border-violet-500/20
                            bg-black/60
                            backdrop-blur-2xl
                        "
                    />

                    <div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            h-[400px]
                            w-[300px]
                            -translate-x-1/2
                            -translate-y-1/2
                            rotate-[10deg]
                            rounded-[32px]
                            border
                            border-violet-500/20
                            bg-black/60
                            backdrop-blur-2xl
                        "
                    />

                    <div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            flex
                            h-[420px]
                            w-[320px]
                            -translate-x-1/2
                            -translate-y-1/2
                            flex-col
                            justify-between
                            rounded-[32px]
                            border
                            border-violet-500/20
                            bg-black/80
                            p-6
                            backdrop-blur-2xl
                            shadow-[0_0_60px_rgba(139,92,246,0.2)]
                        "
                    >
                        <div className="space-y-4">
                            <div className="h-4 w-24 rounded-full bg-violet-500/40" />

                            <div className="h-8 w-full rounded-xl bg-violet-500/15" />

                            <div className="h-8 w-[70%] rounded-xl bg-violet-500/10" />
                        </div>

                        <div className="space-y-3">
                            <div className="h-16 rounded-2xl bg-violet-500/10" />

                            <div className="h-16 rounded-2xl bg-violet-500/10" />

                            <div className="h-16 rounded-2xl bg-violet-500/10" />
                        </div>

                        <div className="flex gap-3">
                            <div className="h-10 flex-1 rounded-xl bg-violet-600/30" />

                            <div className="h-10 w-10 rounded-xl bg-violet-500/20" />
                        </div>
                    </div>

                    <div
                        className="
                            absolute
                            right-0
                            top-10
                            h-20
                            w-20
                            rounded-full
                            bg-violet-500/20
                            blur-2xl
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-10
                            left-0
                            h-24
                            w-24
                            rounded-full
                            bg-violet-400/20
                            blur-3xl
                        "
                    />
                </div>
            </div>
        </div>
    )
}

export default Heroes