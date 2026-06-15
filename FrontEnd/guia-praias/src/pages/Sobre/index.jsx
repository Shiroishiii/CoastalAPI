import Header from "../../components/Header";
import Footer from "../../components/Footer";

function Sobre() {
    return (
        <div className="min-h-screen bg-[#020b18] text-white">
            <Header />

            <section className="pt-32 pb-16 text-center px-6">
                <h1 className="text-5xl font-bold">Sobre a CoastalAPI</h1>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                    Plataforma para explorar, conhecer e avaliar as melhores
                    praias de Florianópolis.
                </p>
            </section>

            <main className="max-w-4xl mx-auto px-6 pb-20">
                <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-8 mb-8">
                    <h2 className="text-3xl font-bold mb-4">Nossa missão</h2>
                    <p className="text-gray-300 leading-8">
                        A CoastalAPI nasceu para facilitar a descoberta das
                        praias da ilha, reunindo informações sobre região, nível
                        de perigo, estrutura e avaliações de quem já visitou
                        cada local.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-6">
                        <h3 className="font-bold text-orange-500 text-lg">
                            Explorar
                        </h3>
                        <p className="text-gray-400 mt-3">
                            Navegue por dezenas de praias organizadas por
                            região.
                        </p>
                    </div>

                    <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-6">
                        <h3 className="font-bold text-orange-500 text-lg">
                            Favoritar
                        </h3>
                        <p className="text-gray-400 mt-3">
                            Salve suas praias preferidas para consultar depois.
                        </p>
                    </div>

                    <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-6">
                        <h3 className="font-bold text-orange-500 text-lg">
                            Avaliar
                        </h3>
                        <p className="text-gray-400 mt-3">
                            Compartilhe sua experiência e ajude outros
                            visitantes.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Sobre;
