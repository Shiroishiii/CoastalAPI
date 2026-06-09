import { Link } from "react-router-dom";

function PraiaCard({ praia }) {
    return (
        <Link
            to={`/praias/${praia.id}`}
            className="bg-[#03162F] rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300"
        >
            <img
                src={praia.imagem}
                alt={praia.nome}
                className="w-full h-56 object-cover"
            />

            <div className="p-5">
                <span className="text-orange-500 text-sm">
                    {praia.regiao}
                </span>

                <h2 className="text-2xl font-bold mt-2">
                    {praia.nome}
                </h2>

                <p className="text-slate-400 mt-3">
                    {praia.descricao}
                </p>

                <button className="mt-5 bg-orange-500 px-5 py-2 rounded-full hover:bg-orange-600">
                    Ver detalhes
                </button>
            </div>
        </Link>
    );
}

export default PraiaCard;