import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout";
import { getUsuario, setUsuario } from "../../utils/auth";

function Configuracoes() {
    const usuario = getUsuario();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (usuario) {
            setNome(usuario.nome ?? "");
            setEmail(usuario.email ?? "");
        }
    }, [usuario]);

    async function handleSalvar(e) {
        e.preventDefault();

        if (!usuario?.id) {
            toast.error("Faça login para atualizar suas configurações.");
            return;
        }

        setSalvando(true);

        try {
            const response = await fetch(
                `http://localhost:3000/usuarios/${usuario.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        senha,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro ?? "Erro ao salvar");
            }

            setUsuario(data);
            setSenha("");
            toast.success("Configurações atualizadas com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Não foi possível salvar as configurações.");
        } finally {
            setSalvando(false);
        }
    }

    if (!usuario) {
        return (
            <DashboardLayout
                title="Configurações"
                subtitle="Gerencie os dados da sua conta"
            >
                <div className="bg-[#0b1525] border border-[#1c2a40] rounded-3xl p-8 max-w-lg">
                    <p className="text-gray-400">
                        Você precisa estar logado para acessar as configurações.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Fazer login
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Configurações"
            subtitle="Gerencie os dados da sua conta"
        >
            <form
                onSubmit={handleSalvar}
                className="w-full max-w-lg bg-[#0b1525] p-8 rounded-3xl shadow-xl border border-[#1c2a40]"
            >
                <div className="mb-5">
                    <label htmlFor="nome" className="block mb-2 font-medium">Nome</label>
                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Digite seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full bg-[#162235] p-4 rounded-xl outline-none border border-transparent focus:border-orange-500 transition"
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#162235] p-4 rounded-xl outline-none border border-transparent focus:border-orange-500 transition"
                    />
                </div>

                <div className="mb-8">
                    <label htmlFor="password" className="block mb-2 font-medium">Senha</label>
                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        className="w-full bg-[#162235] p-4 rounded-xl outline-none border border-transparent focus:border-orange-500 transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={salvando}
                    className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-xl font-semibold transition disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
            </form>
        </DashboardLayout>
    );
}

export default Configuracoes;
