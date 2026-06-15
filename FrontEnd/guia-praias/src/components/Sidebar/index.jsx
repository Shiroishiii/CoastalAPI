import { NavLink, useNavigate } from "react-router-dom";
import { getUsuario, logout } from "../../utils/auth";

const links = [
    { to: "/home", label: "Início" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/praias", label: "Praias" },
    { to: "/favoritos", label: "Favoritos" },
    { to: "/configuracoes", label: "Configurações" },
];

export default function Sidebar() {
    const usuario = getUsuario();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#071426] border-r border-white/10 flex flex-col z-40">
            <div className="p-6">
                <img
                    src="/logo3.png"
                    alt="CoastalAPI"
                    className="h-16 w-auto"
                />
            </div>

            {usuario && (
                <div className="px-6 pb-6 border-b border-white/10">
                    <p className="text-sm text-gray-400">Bem-vindo,</p>
                    <p className="font-semibold truncate">{usuario.nome}</p>
                </div>
            )}

            <nav className="flex-1 p-4 flex flex-col gap-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `px-4 py-3 rounded-xl transition font-medium ${
                                isActive
                                    ? "bg-orange-500 text-white"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition text-left font-medium"
                >
                    Sair
                </button>
            </div>
        </aside>
    );
}
