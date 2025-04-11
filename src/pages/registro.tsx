import React from "react";
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
import { toast } from "sonner"; // 👈 importa o toast

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
      }, 1500); // tempo para o toast aparecer
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

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E0F2F1] to-[#B2DFDB]">
        <Navbar />

        <main className="flex flex-col items-center justify-center flex-grow px-4 py-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-bold text-center text-[#1E3A8A]">
              Criar Conta
            </h2>

            <div>
              <label className="block text-sm font-medium">Nome</label>
              <input
                {...register("name")}
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Seu nome"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Senha</label>
              <input
                {...register("password")}
                type="password"
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Criar Conta
            </button>

            <p className="text-sm text-center">
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
