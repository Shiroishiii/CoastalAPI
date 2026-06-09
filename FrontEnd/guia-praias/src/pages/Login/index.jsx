import { useState } from "react";
import axios from "axios"
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    async function handleLogin(e) {
        e.preventDefault();

        try {
            const { data } = await axios.post(
                "http://localhost:3000/login",
                {
                    email,
                    senha
                }
            );

            console.log(data);
            // Exemplo:
            // localStorage.setItem("token", data.token);
            // navigate("/dashboard");

        } catch (error) {
            console.error(error);

            if (error.response) {
                console.log(error.response.data);
            }
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
                        <span className="text-orange-500 hover:underline cursor-pointer ml-1">
                            Cadastre-se
                        </span>
                    </p>
                </form>
            </main>

            <Footer />
        </div>
    );
}

export default LoginPage;