import React, { useState } from "react";
import { useRouter } from "next/router";
import { loginWithEmail } from "../firebase";
import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Eye, EyeOff, Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E0F7FA] to-[#F1F8F9]">
        <Navbar />

        <main className="flex-grow flex items-center justify-center px-6 py-20 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center bg-white rounded-3xl shadow-xl p-10 w-full max-w-6xl gap-12"
          >
            {/* Imagem */}
            <div className="hidden lg:flex justify-center items-center flex-1">
              <img
                src="/Logo_EcoPulse.png"
                alt="EcoPulse"
                className="w-full max-w-xs object-contain drop-shadow-md"
              />
            </div>

            {/* Formulário */}
            <div className="flex-1 w-full">
              <h2 className="text-4xl font-bold text-center text-[#0F172A] mb-8">
                Acesse sua conta
              </h2>

              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg flex justify-center items-center gap-2 transition font-semibold text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} /> Entrando...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              {error && (
                <p className="mt-4 text-center text-sm text-red-500">{error}</p>
              )}

              <p className="mt-6 text-center text-sm text-gray-600">
                Não tem uma conta?{" "}
                <button
                  onClick={() => router.push("/registro")}
                  className="text-emerald-600 hover:underline"
                >
                  Cadastre-se
                </button>
              </p>

              <p className="mt-2 text-center text-sm text-gray-600">
                Esqueceu sua senha?{" "}
                <button
                  onClick={() => router.push("/esqueceuSenha")}
                  className="text-emerald-600 hover:underline"
                >
                  Recuperar acesso
                </button>
              </p>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}
