import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { setUsuario } from "../../utils/auth";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/usuarios");
            const usuarios = await response.json();
            const usuario = usuarios.find((u) => u.email === email);

            if (!usuario) {
                toast.error("Usuário não encontrado.");
                return;
            }

            setUsuario(usuario);
            toast.success("Login realizado com sucesso!");
            navigate("/home");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao fazer login.");
        }
    }

    return (
        <div className="bg-[#020b18] text-white">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-30">
                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-md bg-[#0b1525] p-8 rounded-3xl shadow-xl border border-[#1c2a40]"
                >
                    <h1 className="text-4xl font-bold text-center mb-2">
                        Login
                    </h1>

                    <p className="text-center text-gray-400 mb-8">
                        Entre para acessar a CoastalAPI
                    </p>

                    <div className="mb-5">
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#162235] p-4 rounded-xl outline-none border border-transparent focus:border-orange-500 transition"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block mb-2 font-medium">
                            Senha
                        </label>

                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full bg-[#162235] p-4 rounded-xl outline-none border border-transparent focus:border-orange-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-xl font-semibold transition"
                    >
                        Entrar
                    </button>

                    <p className="text-center mt-6 text-gray-400">
                        Não possui conta?
                        <Link
                            to="/cadastro"
                            className="text-orange-500 hover:underline ml-1"
                        >
                            Cadastre-se
                        </Link>
                    </p>
                </form>
            </main>

            <Footer />
        </div>
    );
}

export default LoginPage;