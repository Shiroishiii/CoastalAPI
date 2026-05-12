export default function LandCard({ titulo, imagem, numero }) {
    return (
        <div className="relative bg-[#071426] w-92.5 h-57.5 rounded-[40px] p-8 shadow-2xl overflow-hidden">

            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 text-sm mb-5">
                {numero}
            </div>

            <h2 className="text-4xl font-bold leading-tight max-w-42.5 z-10 relative">
                {titulo}
            </h2>
            <img
                src={imagem}
                alt={titulo}
                className="absolute right-4 bottom-4 w-32 h-32 object-cover rounded-3xl"
            />

            <div className="absolute bottom-4 left-8 w-37.5 border-t border-white/10" />
        </div>
    )
}