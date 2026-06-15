import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getUsuario } from "../../utils/auth";

function Favoritos() {
    const usuario = getUsuario();
    const [favoritos, setFavoritos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        if (!usuario?.id) {
            setCarregando(false);
            return;
        }

        fetch(`http://localhost:3000/favoritos/usuario/${usuario.id}`)
            .then((res) => res.json())
            .then((data) => setFavoritos(data))
            .catch(console.error)
            .finally(() => setCarregando(false));
    }, [usuario]);

    if (!usuario) {
        return (
            <DashboardLayout
                title="Favoritos"
                subtitle="Suas praias favoritas em um só lugar"
            >
                <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-8 max-w-lg">
                    <p className="text-gray-400">
                        Faça login para ver e gerenciar seus favoritos.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Fazer login
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Favoritos"
            subtitle="Suas praias favoritas em um só lugar"
        >
            {carregando ? (
                <p className="text-gray-400">Carregando favoritos...</p>
            ) : favoritos.length === 0 ? (
                <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-8 max-w-lg">
                    <p className="text-gray-400">
                        Você ainda não salvou nenhuma praia nos favoritos.
                    </p>
                    <Link
                        to="/praias"
                        className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Explorar praias
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {favoritos.map((praia) => (
                        <Link
                            key={praia.id}
                            to={`/praias/${praia.id}`}
                            className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-6 hover:border-orange-500/50 transition"
                        >
                            <span className="text-orange-500 text-sm">
                                {praia.regiao}
                            </span>
                            <h2 className="text-2xl font-bold mt-2">
                                {praia.nome}
                            </h2>
                            <p className="text-gray-400 mt-3">
                                Nível de perigo: {praia.nivel_perigo}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}

export default Favoritos;
