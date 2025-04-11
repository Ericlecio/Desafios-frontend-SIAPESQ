import React, { useState } from "react";
import { useRouter } from "next/router";
import { loginWithEmail } from "../firebase";
import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push("/info");
    } catch (err) {
      console.error(err);
      setError("Falha ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | EcoPulse</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E0F2F1] to-[#B2DFDB]">
        <Navbar />

        <main className="flex flex-col items-center justify-center flex-grow px-4 py-10">
          <div className="bg-[#0F172A] text-white p-8 rounded-2xl w-full max-w-sm shadow-lg transform transition duration-300 hover:scale-105">
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-600 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-600 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md transition text-white font-semibold ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {loading ? "Entrando..." : "Login"}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-center text-sm text-red-500">{error}</p>
            )}

            <p className="mt-4 text-center text-sm text-gray-300">
              Não tem uma conta?{" "}
              <button
                onClick={() => router.push("/registro")}
                className="text-blue-400 hover:underline"
              >
                Cadastre-se
              </button>
            </p>

            <p className="mt-2 text-center text-sm text-gray-300">
              Esqueceu sua senha?{" "}
              <button
                onClick={() => router.push("/esqueceuSenha")}
                className="text-blue-400 hover:underline"
              >
                Recuperar acesso
              </button>
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
