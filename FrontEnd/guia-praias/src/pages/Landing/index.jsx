import { Link, Navigate, useNavigate } from "react-router-dom";
import praiaImg from "../../assets/praia.jpg";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LandCard from "../../components/LandCard";
import IconSurf from "../../assets/icons/person-surfing.svg";
import WaveIcon from "../../assets/icons/water-wave.svg";
import StarIcon from "../../assets/icons/star-32.svg";
import PinIcon from "../../assets/icons/pin.svg";


function LandingPage() {
    const navigate = useNavigate()
    return (
        <div className="bg-[#020b18] text-white overflow-x-hidden">
            <header>
                <Header />
            </header>

            <section className="relative h-screen flex items-center justify-center rounded-b-[40px] overflow-hidden">
                <img
                    src={praiaImg}
                    alt="Praia"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 text-center">
                    <h1 className="text-7xl font-bold drop-shadow-lg">
                        CoastalAPI
                    </h1>
                    <section className="min-h-screen flex items-center justify-center px-6 py-20 text-white">
                        <div className="max-w-4xl text-center">
                            <span className="inline-block px-4 py-2 rounded-full text-orange-400 text-sm font-bold mb-6 ">
                                🌊 Explore Florianópolis
                            </span>

                            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                                O litoral de
                                <span className="text-orange-500"> Florianópolis </span>
                                na palma da sua mão
                            </h1>

                            <p className="mt-8 text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                                Conheça as melhores praias da ilha, acompanhe níveis de
                                segurança, descubra locais ideais para surf e encontre o
                                destino perfeito para seu próximo dia de praia.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                                <button 
                                onClick={() => navigate("/praias")}
                                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full font-semibold transition-all duration-300">
                                    Explorar Praias
                                </button>

                                <button 
                                onClick={() => navigate("/cadastro")}
                                className="px-8 py-4 border bg-[#36363683] border-slate-600 hover:border-slate-400 rounded-full font-semibold transition-all duration-300">
                                    Criar Conta
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                                <div className="bg-[#0000009c] rounded-2xl p-5 flex flex-col items-center">
                                    <img
                                        src={WaveIcon}
                                        alt="Praias"
                                        className="w-10 h-10"
                                    />
                                    <p className="mt-2 text-sm text-slate-300 text-center">
                                        Praias Catalogadas
                                    </p>
                                </div>

                                <div className="bg-[#0000009c] rounded-2xl p-5 flex flex-col items-center">
                                    <img
                                        src={IconSurf}
                                        alt="Surf"
                                        className="w-10 h-10"
                                    />
                                    <p className="mt-2 text-sm text-slate-300 text-center">
                                        Locais para Surf
                                    </p>
                                </div>

                                <div className="bg-[#0000009c] rounded-2xl p-5 flex flex-col items-center">
                                    <img
                                        src={StarIcon}
                                        alt="Avaliações"
                                        className="w-10 h-10"
                                    />
                                    <p className="mt-2 text-sm text-slate-300 text-center">
                                        Avaliações
                                    </p>
                                </div>

                                <div className="bg-[#0000009c] rounded-2xl p-5 flex flex-col items-center">
                                    <img
                                        src={PinIcon}
                                        alt="Regiões"
                                        className="w-10 h-10"
                                    />
                                    <p className="mt-2 text-sm text-slate-300 text-center">
                                        Regiões da Ilha
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>

            <section className="flex gap-8 justify-center -mt-8 relative z-20 px-10">
                <LandCard
                    numero="1"
                    titulo="Açores"
                    imagem={"../imagens/praias/acores.jpg"}
                />
                <LandCard
                    numero="2"
                    titulo="Joaquina"
                    imagem={"../imagens/praias/joaquina.jpg"}
                />
                <LandCard
                    numero="3"
                    titulo="Cacupé"
                    imagem={"../imagens/praias/cacupe.jpg"}
                />
            </section>
            <footer>
                <Footer />
            </footer>

        </div>
    );
}

export default LandingPage;