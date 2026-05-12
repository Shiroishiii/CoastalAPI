export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-[#020b18]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">
                    CoastalAPI
                </h1>
                <nav className="flex items-center gap-8 text-zinc-300">
                    <a href="#" className="hover:text-white transition">
                        Início
                    </a>
                    <a href="#" className="hover:text-white transition">
                        Praias
                    </a>
                    <a href="#" className="hover:text-white transition">
                        Sobre
                    </a>
                    <button className="bg-orange-500 hover:bg-orange-600 transition px-5 py-2 rounded-full text-white font-medium">
                        Explorar
                    </button>
                </nav>
            </div>
        </header>
    )
}