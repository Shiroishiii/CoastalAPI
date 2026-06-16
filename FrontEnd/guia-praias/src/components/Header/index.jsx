import { Link } from "react-router-dom";

export default function Header() {

    const usuarioId = localStorage.getItem("usuarioId");

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-[#020b18]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                <Link to="/">
                    <img
                        src="/logo3.png"
                        alt="CoastalAPI"
                        className="h-24 w-auto"
                    />
                </Link>

                <nav className="flex items-center gap-8 text-zinc-300">
                    <Link
                        to="/"
                        className="hover:text-white transition"
                    >
                        Início
                    </Link>

                    <Link
                        to="/praias"
                        className="hover:text-white transition"
                    >
                        Praias
                    </Link>

                    <Link
                        to="/sobre"
                        className="hover:text-white transition"
                    >
                        Sobre
                    </Link>

                    {usuarioId ? (
                        <Link
                            to="/dashboard"
                            className="bg-orange-500 hover:bg-orange-600 transition px-5 py-2 rounded-full text-white font-medium"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-orange-500 hover:bg-orange-600 transition px-5 py-2 rounded-full text-white font-medium"
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}