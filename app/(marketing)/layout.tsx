import Navbar from "./_components/navbar"

const MarketingLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-black
            "
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_55%)]" />

            <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px]" />

            <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]" />

            <Navbar />

            <main
                className="
                    relative
                    z-10
                    min-h-screen
                    pt-24
                "
            >
                {children}
            </main>
        </div>
    )
}

export default MarketingLayout