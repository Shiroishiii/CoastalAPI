import { Link } from "react-router-dom";
import praiaImg from "../../assets/praia.jpg";
import praiaImg1 from "../../assets/praia1.jpg";
import praiaImg2 from "../../assets/praia2.jpg";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LandCard from "../../components/LandCard";

function LandingPage() {
    return (
        <div className="bg-[#020b18] text-white overflow-x-hidden">
            <header>
                <Header/>
            </header>

            <section className="relative h-screen flex items-center justify-center rounded-b-[40px] overflow-hidden">
                <img
                    src={praiaImg}
                    alt="Praia"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 text-center">
                    <h1 className="text-7xl font-bold drop-shadow-lg">
                        CoastalAPI
                    </h1>

                    <Link
                        to="/praias"
                        className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 transition px-10 py-4 rounded-full text-xl font-semibold shadow-lg"
                    >
                        Ver detalhes
                    </Link>
                </div>
            </section>

            <section className="flex gap-8 justify-center -mt-8 relative z-20 px-10">
                <LandCard
                numero="1"
                titulo="Praia dos Anjos"
                imagem={praiaImg}
                />
                <LandCard
                numero="2"
                titulo="Praia do Horizonte"
                imagem={praiaImg1}
                />
                <LandCard
                numero="3"
                titulo="Praia das Conchas"
                imagem={praiaImg2}
                />
            </section>
            <footer>
                <Footer/>
            </footer>

        </div>
    );
}

export default LandingPage;