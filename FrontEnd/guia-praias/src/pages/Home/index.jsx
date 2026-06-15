import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getUsuario } from "../../utils/auth";
import { fetchApi } from "../../utils/api";

const atalhos = [
    {
        titulo: "Explorar Praias",
        descricao: "Veja todas as praias de Florianópolis",
        rota: "/praias",
    },
    {
        titulo: "Meus Favoritos",
        descricao: "Acesse as praias que você salvou",
        rota: "/favoritos",
    },
    {
        titulo: "Dashboard",
        descricao: "Acompanhe estatísticas e dados gerais",
        rota: "/dashboard",
    },
    {
        titulo: "Configurações",
        descricao: "Atualize seus dados de perfil",
        rota: "/configuracoes",
    },
];

function Home() {
    const usuario = getUsuario();
    const [praias, setPraias] = useState([]);

    useEffect(() => {
        fetchApi("/praias")
            .then((data) => setPraias(Array.isArray(data) ? data.slice(0, 3) : []))
            .catch(console.error);
    }, []);

    return (
        <DashboardLayout
            title={`Olá, ${usuario?.nome ?? "visitante"}!`}
            subtitle="Bem-vindo ao Guia de Praias da CoastalAPI"
        >
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-12">
                {atalhos.map((atalho) => (
                    <Link
                        key={atalho.rota}
                        to={atalho.rota}
                        className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-6 hover:border-orange-500/50 transition"
                    >
                        <h2 className="text-xl font-bold">{atalho.titulo}</h2>
                        <p className="text-gray-400 mt-3">{atalho.descricao}</p>
                    </Link>
                ))}
            </section>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Praias em destaque</h2>
                    <Link
                        to="/praias"
                        className="text-orange-500 hover:underline"
                    >
                        Ver todas
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {praias.map((praia) => (
                        <Link
                            key={praia.id}
                            to={`/praias/${praia.id}`}
                            className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-6 hover:border-orange-500/50 transition"
                        >
                            <span className="text-orange-500 text-sm">
                                {praia.regiao}
                            </span>
                            <h3 className="text-xl font-bold mt-2">
                                {praia.nome}
                            </h3>
                            <p className="text-gray-400 mt-3 line-clamp-2">
                                {praia.descricao}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </DashboardLayout>
    );
}

export default Home;
