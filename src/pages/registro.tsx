import React, { useState } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: data.name,
        email: data.email,
        createdAt: serverTimestamp(),
      });

      toast.success(`Usuário ${data.name} registrado com sucesso! 🎉`);

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao registrar: " + error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Registrar | EcoPulse</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E0F7FA] to-[#F1F8F9]">
        <Navbar />

        <main className="flex flex-col items-center justify-center flex-grow px-6 py-20 mt-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 transition-all duration-300 transform hover:scale-105"
          >
            <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-6">
              Criar Conta
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  {...register("name")}
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  placeholder="Seu nome"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300"
            >
              Criar Conta
            </button>

            <p className="text-sm text-center mt-4">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Entrar
              </button>
            </p>
          </form>
        </main>

        <Footer />
      </div>
    </>
  );
}
