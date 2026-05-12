import instaSvg from "../../assets/instagram.svg"

export default function Footer() {
    return (
        <footer className="bg-[#071426] border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        CoastalAPI
                    </h2>
                    <p className="text-zinc-400 mt-2">
                        Explore as melhores praias do litoral.
                    </p>
                </div>
                <div className="flex gap-6 text-zinc-400">
                    <a href="#" className="hover:text-white transition">
                        Instagram
                    </a>
                    <a href="#" className="hover:text-white transition">
                        GitHub
                    </a>

                    {/* alterar svgs e tamanhos */}
                    <a href="#" className="hover:text-white transition">
                        <img src={instaSvg} alt="" />
                    </a>
                </div>
            </div>
        </footer>
    )
}