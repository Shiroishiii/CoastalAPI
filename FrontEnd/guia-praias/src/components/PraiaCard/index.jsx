import { Link } from "react-router-dom";

function PraiaCard({ praia }) {
    return (
        <Link
            to={`/praias/${praia.id}`}
            className="bg-[#03162F] rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300 border border-[#1c2a40] hover:border-orange-500/50"
        >
            {praia.imagem ? (
                <img
                    src={praia.imagem}
                    alt={praia.nome}
                    className="w-full h-56 object-cover"
                />
            ) : (
                <div className="w-full h-56 bg-gradient-to-br from-[#0b3d5c] to-[#020b18] flex flex-col items-center justify-center p-6">
                    <span className="text-orange-500 text-sm font-medium">
                        {praia.regiao}
                    </span>
                    <span className="text-white/30 text-5xl font-bold mt-2">
                        {praia.nivel_perigo?.[0] ?? "P"}
                    </span>
                </div>
            )}

            <div className="p-5">
                <span className="text-orange-500 text-sm">
                    {praia.regiao}
                </span>

                <h2 className="text-2xl font-bold mt-2">
                    {praia.nome}
                </h2>

                <p className="text-slate-400 mt-3 line-clamp-2">
                    {praia.descricao}
                </p>

                <div className="flex gap-3 mt-4 text-sm text-slate-400">
                    <span>Nível: {praia.nivel_perigo}</span>
                    <span>{praia.surf ? "Surf" : "Sem surf"}</span>
                </div>

                <span className="inline-block mt-5 bg-orange-500 px-5 py-2 rounded-full hover:bg-orange-600">
                    Ver detalhes
                </span>
            </div>
        </Link>
    );
}

export default PraiaCard;
