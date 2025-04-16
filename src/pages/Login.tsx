import React, { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Eye, EyeOff, Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      localStorage.setItem("userName", user.displayName || "Usuário");
      localStorage.setItem("userEmail", user.email || email);
      localStorage.setItem("isLoggedIn", "true");

      router.push("/info");
    } catch (err: any) {
      console.error(err);
      setError("Falha ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      alert(
        "Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha."
      );
      setResetPasswordMode(false);
    } catch (err: any) {
      console.error(err);
      setError("Falha ao enviar o e-mail. Verifique o endereço de e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {resetPasswordMode
            ? "Recuperar Senha | EcoPulse"
            : "Login | EcoPulse"}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E0F7FA] to-[#F1F8F9]">
        <Navbar />

        <main className="flex-grow flex items-center justify-center px-6 py-30">
          <form
            onSubmit={resetPasswordMode ? handlePasswordReset : handleLogin}
            className="space-y-8 bg-white p-10 rounded-xl shadow-xl w-full max-w-md transition-transform duration-300 transform hover:scale-105"
          >
            <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-6">
              {resetPasswordMode ? "Esqueceu a Senha?" : "Acesse sua conta"}
            </h2>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {resetPasswordMode && (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg flex justify-center items-center gap-2 transition font-semibold text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {loading ? (
                    <span className="animate-spin">🔄</span>
                  ) : (
                    "Enviar Link de Recuperação"
                  )}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Lembrou da sua senha?{" "}
                  <button
                    onClick={() => setResetPasswordMode(false)}
                    className="text-emerald-600 hover:underline"
                  >
                    Faça login
                  </button>
                </p>
              </>
            )}

            {!resetPasswordMode && (
              <>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
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
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    "Login"
                  )}
                </button>
              </>
            )}

            {error && (
              <p className="mt-4 text-center text-sm text-red-500">{error}</p>
            )}

            {!resetPasswordMode && (
              <p className="text-center text-sm text-gray-600 mt-4">
                Não tem uma conta?{" "}
                <button
                  onClick={() => router.push("/registro")}
                  className="text-emerald-600 hover:underline"
                >
                  Cadastre-se
                </button>
              </p>
            )}

            {!resetPasswordMode && (
              <p className="text-center text-sm text-gray-600 mt-4">
                Esqueceu sua senha?{" "}
                <button
                  onClick={() => setResetPasswordMode(true)}
                  className="text-emerald-600 hover:underline"
                >
                  Clique aqui
                </button>
              </p>
            )}
          </form>
        </main>

        <Footer />
      </div>
    </>
  );
}
