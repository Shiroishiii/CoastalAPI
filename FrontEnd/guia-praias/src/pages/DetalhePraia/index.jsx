import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { fetchApi } from "../../utils/api";
import HeartIcon from "../../assets/icons/heart.svg";
import HeartyEmptyIcon from "../../assets/icons/heart-empty.svg";


function DetalhePraiaPage() {
    const { id } = useParams();

    const [praia, setPraia] = useState(null);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [favoritado, setFavoritado] = useState(false);

    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState("");

    const usuarioId = localStorage.getItem("usuarioId");

    useEffect(() => {
        carregarDados();
    }, [id]);

    async function carregarDados() {
        try {
            const praiaData = await fetchApi(`/praias/${id}`);
            setPraia(praiaData);

            const avaliacoesData = await fetchApi(
                `/avaliacoes/praia/${id}`
            );

            setAvaliacoes(avaliacoesData);

            if (usuarioId) {
                const favoritoData = await fetchApi(
                    `/favoritos/verificar/${usuarioId}/${id}`
                );

                setFavoritado(
                    favoritoData.favoritado
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function toggleFavorito() {
        if (!usuarioId) {
            alert("Faça login para favoritar.");
            return;
        }

        try {
            if (favoritado) {
                await fetch("/api/favoritos", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        usuario_id: Number(usuarioId),
                        praia_id: Number(id),
                    }),
                });
            } else {
                await fetch("/api/favoritos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        usuario_id: Number(usuarioId),
                        praia_id: Number(id),
                    }),
                });
            }

            setFavoritado(!favoritado);
        } catch (error) {
            console.error(error);
        }
    }

    async function enviarAvaliacao() {
        if (!usuarioId) {
            alert("Faça login para avaliar.");
            return;
        }

        try {
            await fetch("/api/avaliacoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nota,
                    comentario,
                    usuario_id: Number(usuarioId),
                    praia_id: Number(id),
                }),
            });

            setComentario("");
            setNota(5);

            const novasAvaliacoes = await fetchApi(
                `/avaliacoes/praia/${id}`
            );

            setAvaliacoes(novasAvaliacoes);
        } catch (error) {
            console.error(error);
        }
    }

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
                {praia.imagem ? (
                    <img
                        src={praia.imagem}
                        alt={praia.nome}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#0b3d5c] to-[#020b18]" />
                )}

                <div className="absolute inset-0 bg-black/50" />

                <div className="absolute bottom-10 left-10">
                    <h1 className="text-6xl font-bold">
                        {praia.nome}
                    </h1>

                    <p className="text-xl text-gray-300 mt-2">
                        {praia.regiao}
                    </p>

                    <button
                        onClick={toggleFavorito}
                        className="mt-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                            fill={favoritado ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
                        </svg>

                        {favoritado ? "Favoritada" : "Favoritar"}
                    </button>
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
                            Nível de perigo
                        </h3>

                        <p>{praia.nivel_perigo}</p>
                    </div>

                    <div className="bg-[#0b1525] rounded-3xl p-6">
                        <h3 className="font-bold text-orange-500">
                            Surf
                        </h3>

                        <p>{praia.surf ? "Sim" : "Não"}</p>
                    </div>
                </div>

                <div className="bg-[#0b1525] rounded-3xl p-8 mt-10">
                    <h2 className="text-3xl font-bold mb-6">
                        Avaliar Praia
                    </h2>

                    <div className="flex gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((estrela) => (
                            <button
                                key={estrela}
                                type="button"
                                onClick={() => setNota(estrela)}
                                className={`text-4xl transition hover:scale-110 ${estrela <= nota
                                        ? "text-yellow-400"
                                        : "text-gray-600"
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <p className="text-gray-400 mb-4">
                        Nota: {nota}/5
                    </p>

                    <textarea
                        value={comentario}
                        onChange={(e) =>
                            setComentario(e.target.value)
                        }
                        placeholder="Compartilhe sua experiência..."
                        className="w-full bg-[#020b18] p-4 rounded-xl min-h-30 border border-transparent focus:border-orange-500 outline-none"
                    />

                    <button
                        onClick={enviarAvaliacao}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl transition"
                    >
                        Enviar Avaliação
                    </button>
                </div>

                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6">
                        Avaliações
                    </h2>

                    {avaliacoes.length === 0 ? (
                        <div className="bg-[#0b1525] rounded-2xl p-6">
                            Nenhuma avaliação ainda.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {avaliacoes.map((avaliacao) => (
                                <div
                                    key={avaliacao.id}
                                    className="bg-[#0b1525] p-6 rounded-2xl"
                                >
                                    <p className="font-bold text-orange-500">
                                        {avaliacao.usuario}
                                    </p>

                                    <p className="mt-2">
                                        {"⭐".repeat(
                                            Number(avaliacao.nota)
                                        )}
                                    </p>

                                    <p className="text-gray-300 mt-3">
                                        {avaliacao.comentario}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default DetalhePraiaPage;