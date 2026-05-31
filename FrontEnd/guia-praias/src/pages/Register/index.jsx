import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:3000/usuarios",
                {
                    method: "POST",
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
                throw new Error(data.message);
            }

            alert("Usuário cadastrado com sucesso!");

            setNome("");
            setEmail("");
            setSenha("");

        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar usuário.");
        }
    }

    return (
        <div className="bg-[#020b18] text-white">
            <Header />

            <main className="flex justify-center px-4 py-30">
                <form
                    onSubmit={handleRegister}
                    className="w-full max-w-md bg-[#0b1525] p-8 rounded-3xl shadow-xl border border-[#1c2a40]"
                >
                    <h1 className="text-4xl font-bold text-center mb-2">
                        Cadastro
                    </h1>

                    <p className="text-center text-gray-400 mb-8">
                        Crie sua conta na CoastalAPI
                    </p>

                    <div className="mb-5">
                        <label className="block mb-2 font-medium">
                            Nome
                        </label>

                        <input
                            type="text"
                            placeholder="Digite seu nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full bg-[#162235] p-4 rounded-xl outline-none border border-transparent focus:border-orange-500 transition"
                        />
                    </div>

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
                        Cadastrar
                    </button>

                    <p className="text-center mt-6 text-gray-400">
                        Já possui conta?
                        <span className="text-orange-500 hover:underline cursor-pointer ml-1">
                            Entrar
                        </span>
                    </p>
                </form>
            </main>

            <Footer />
        </div>
    );
}

export default Register;