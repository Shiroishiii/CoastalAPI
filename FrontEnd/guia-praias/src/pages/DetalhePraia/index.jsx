import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function DetalhePraiaPage() {
    const { id } = useParams();

    const [praia, setPraia] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/praias/${id}`)
            .then(res => res.json())
            .then(data => setPraia(data))
            .catch(console.error);
    }, [id]);

    if (!praia) {
        return (
            <div className="bg-[#020b18] text-white min-h-screen flex items-center justify-center">
                Carregando...
            </div>
        );
    }

    return (
        <div className="bg-[#020b18] text-white min-h-screen">
            <Header />

            <section className="h-[60vh] relative">
                <img
                    src={praia.imagem}
                    alt={praia.nome}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50" />

                <div className="absolute bottom-10 left-10">
                    <h1 className="text-6xl font-bold">
                        {praia.nome}
                    </h1>

                    <p className="text-xl text-gray-300 mt-2">
                        {praia.regiao}
                    </p>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-[#0b1525] rounded-3xl p-8">
                    <h2 className="text-3xl font-bold mb-4">
                        Sobre a praia
                    </h2>

                    <p className="text-gray-300 leading-8">
                        {praia.descricao}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-[#0b1525] rounded-3xl p-6">
                        <h3 className="font-bold text-orange-500">
                            Região
                        </h3>

                        <p>{praia.regiao}</p>
                    </div>

                    <div className="bg-[#0b1525] rounded-3xl p-6">
                        <h3 className="font-bold text-orange-500">
                            Tipo do Mar
                        </h3>

                        <p>{praia.tipoMar}</p>
                    </div>

                    <div className="bg-[#0b1525] rounded-3xl p-6">
                        <h3 className="font-bold text-orange-500">
                            Estrutura
                        </h3>

                        <p>{praia.estrutura}</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default DetalhePraiaPage;