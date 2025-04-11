// pages/api/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyMwDumkPOi5v_TRsK1nRsjQ7WmHpW7Uk",
  authDomain: "ecopulse-80e88.firebaseapp.com",
  projectId: "ecopulse-80e88",
  storageBucket: "ecopulse-80e88.appspot.com",
  messagingSenderId: "677239737024",
  appId: "1:677239737024:web:893a0c6b941c268f047b25",
  measurementId: "G-498TWDSDN1",
};

// Inicializa o Firebase somente uma vez
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Método não permitido" });

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Salvar no Firestore
    await setDoc(doc(db, "usuarios", uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return res
      .status(200)
      .json({ message: `Usuário ${name} registrado com sucesso!` });
  } catch (error: any) {
    console.error("Erro ao registrar:", error.message);
    return res.status(500).json({ message: error.message });
  }
}
