import React, { useState } from "react";
import { useRouter } from "next/router";
import { sendPasswordResetEmail } from "firebase/auth"; // Importar a função de reset de senha
import { auth } from "../../utils/firebase"; // A instância do Firebase Auth

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email); // Envia o link de recuperação de senha
      setSuccess(true); // Exibe mensagem de sucesso
    } catch (err) {
      setError("Erro ao enviar o link de redefinição de senha. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1E8376] to-[#1E3A8A] px-4 py-10">
      <div className="bg-[#0F172A] text-white p-8 rounded-2xl w-full max-w-sm shadow-lg transform transition duration-300 hover:scale-105">
        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-6">Esqueceu a Senha?</h2>

        <form className="space-y-5" onSubmit={handleResetPassword}>
          {/* Campo de E-mail */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm mb-1">E-mail</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-600 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Botão para Enviar Link de Recuperação */}
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-green-500 hover:bg-green-600 transition text-white font-semibold"
          >
            Enviar Link de Recuperação
          </button>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>} {/* Exibe o erro, se houver */}
        {success && <p className="mt-4 text-center text-sm text-green-500">Link enviado! Verifique seu e-mail.</p>} {/* Exibe o sucesso */}

        {/* Link para retornar ao Login */}
        <p className="mt-6 text-center text-sm text-gray-300">
          Lembrou da sua senha?{' '}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-400 hover:underline"
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
}
