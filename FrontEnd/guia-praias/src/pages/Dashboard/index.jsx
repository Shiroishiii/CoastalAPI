import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchApi } from "../../utils/api";

function StatCard({ titulo, valor, descricao }) {
    return (
        <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-6">
            <p className="text-gray-400 text-sm">{titulo}</p>
            <p className="text-4xl font-bold mt-2 text-orange-500">{valor}</p>
            <p className="text-gray-400 mt-3">{descricao}</p>
        </div>
    );
}

function Dashboard() {
    const [praias, setPraias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchApi("/praias"),
            fetchApi("/usuarios"),
        ])
            .then(([praiasData, usuariosData]) => {
                setPraias(Array.isArray(praiasData) ? praiasData : []);
                setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
            })
            .catch(console.error)
            .finally(() => setCarregando(false));
    }, []);

    const regioes = praias.reduce((acc, praia) => {
        const regiao = praia.regiao ?? "Outras";
        acc[regiao] = (acc[regiao] || 0) + 1;
        return acc;
    }, {});

    if (carregando) {
        return (
            <DashboardLayout title="Dashboard">
                <p className="text-gray-400">Carregando dados...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Dashboard"
            subtitle="Visão geral do Guia de Praias"
        >
            <section className="grid gap-6 md:grid-cols-3 mb-12">
                <StatCard
                    titulo="Total de praias"
                    valor={praias.length}
                    descricao="Praias cadastradas em Florianópolis"
                />
                <StatCard
                    titulo="Usuários"
                    valor={usuarios.length}
                    descricao="Pessoas cadastradas na plataforma"
                />
                <StatCard
                    titulo="Regiões"
                    valor={Object.keys(regioes).length}
                    descricao="Áreas da ilha com praias mapeadas"
                />
            </section>

            <section className="grid gap-8 lg:grid-cols-2">
                <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Praias por região
                    </h2>

                    <div className="flex flex-col gap-4">
                        {Object.entries(regioes).map(([regiao, total]) => (
                            <div
                                key={regiao}
                                className="flex items-center justify-between bg-[#162235] rounded-xl px-4 py-3"
                            >
                                <span>{regiao}</span>
                                <span className="text-orange-500 font-semibold">
                                    {total}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Últimas praias cadastradas
                    </h2>

                    <div className="flex flex-col gap-4">
                        {praias.slice(0, 5).map((praia) => (
                            <Link
                                key={praia.id}
                                to={`/praias/${praia.id}`}
                                className="flex items-center justify-between bg-[#162235] rounded-xl px-4 py-3 hover:bg-[#1c2a40] transition"
                            >
                                <div>
                                    <p className="font-medium">{praia.nome}</p>
                                    <p className="text-sm text-gray-400">
                                        {praia.regiao}
                                    </p>
                                </div>
                                <span className="text-orange-500 text-sm">
                                    Ver
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}

export default Dashboard;
