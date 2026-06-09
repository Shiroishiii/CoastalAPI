import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PraiaCard from "../../components/PraiaCard";

function PraiasPage() {
    const [praias, setPraias] = useState([]);
    const [busca, setBusca] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/praias")
            .then((res) => res.json())
            .then((data) => setPraias(data))
            .catch((err) => console.error(err));
    }, []);

    const praiasFiltradas = praias.filter((praia) =>
        praia.nome.toLowerCase().includes(busca.toLowerCase())
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                />
            </div>

            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {praiasFiltradas.map((praia) => (
                        <PraiaCard key={praia.id} praia={praia} />
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default PraiasPage;