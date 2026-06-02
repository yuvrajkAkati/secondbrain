import Heading from "./_components/heading"
import Heroes from "./_components/heroes"
import Footer from "./_components/footer"

function HomePage() {
    return (
        <div
            className="
                relative
                flex
                min-h-screen
                flex-col
                overflow-hidden
                bg-black
            "
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_55%)]" />

            <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />

            <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

            <main
                className="
                    relative
                    flex
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    px-6
                    pt-32
                    pb-16
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        w-full
                        max-w-7xl
                        flex-col
                        items-center
                        gap-20
                    "
                >
                    <Heading />

                    <Heroes />
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default HomePage