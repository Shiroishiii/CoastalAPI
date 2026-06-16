import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PraiaCard from "../../components/PraiaCard";
import { fetchApi } from "../../utils/api";

function PraiasPage() {
    const [praias, setPraias] = useState([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        fetchApi("/praias")
            .then((data) => {
                setPraias(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error(err);
                setErro(err.message ?? "Não foi possível carregar as praias.");
            })
            .finally(() => setCarregando(false));
    }, []);

    const praiasFiltradas = praias.filter((praia) =>
        praia.nome?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020B18] text-white">
            <Header />

            <section className="pt-32 pb-16 text-center">
                <h1 className="text-5xl font-bold">
                    Explore as Praias de Florianópolis
                </h1>

                <p className="text-slate-400 mt-4">
                    Descubra as melhores praias da ilha.
                </p>
            </section>

            <div className="max-w-6xl mx-auto px-6 mb-10">
                <input
                    type="text"
                    placeholder="Buscar praia..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition"
                />
            </div>
            <div className="max-w-6xl mx-auto px-6 mb-10">
                <div className="bg-[#0b1525] rounded-2xl p-5 border border-white/5">
                    <h2 className="text-lg font-semibold mb-4">
                        Legenda de Segurança
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-300">
                                <strong className="text-green-400">Verde</strong> — Seguro
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm text-gray-300">
                                <strong className="text-yellow-400">Amarela</strong> — Atenção
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-gray-300">
                                <strong className="text-red-400">Vermelha</strong> — Perigo
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-sm text-gray-300">
                                <strong className="text-purple-400">Roxa</strong> — Extremo
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="max-w-6xl mx-auto px-6 pb-20">
                {carregando && (
                    <p className="text-center text-slate-400">
                        Carregando praias...
                    </p>
                )}

                {erro && (
                    <div className="bg-[#0b1525] border border-red-500/40 rounded-3xl p-8 text-center">
                        <p className="text-red-400">{erro}</p>
                        <p className="text-slate-400 mt-2 text-sm">
                            Verifique se o backend está rodando em localhost:3000
                        </p>
                    </div>
                )}

                {!carregando && !erro && praiasFiltradas.length === 0 && (
                    <p className="text-center text-slate-400">
                        Nenhuma praia encontrada.
                    </p>
                )}

                {!carregando && !erro && praiasFiltradas.length > 0 && (
                    <>
                        <p className="text-slate-400 mb-8">
                            {praiasFiltradas.length} praia
                            {praiasFiltradas.length !== 1 ? "s" : ""} encontrada
                            {praiasFiltradas.length !== 1 ? "s" : ""}
                        </p>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {praiasFiltradas.map((praia) => (
                                <PraiaCard key={praia.id} praia={praia} />
                            ))}
                        </div>
                    </>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default PraiasPage;
