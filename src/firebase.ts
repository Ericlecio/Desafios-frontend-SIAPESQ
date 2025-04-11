import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 IMPORTANTE

const firebaseConfig = {
  apiKey: "AIzaSyCyMwDumkPOi5v_TRsK1nRsjQ7WmHpW7Uk",
  authDomain: "ecopulse-80e88.firebaseapp.com",
  projectId: "ecopulse-80e88",
  storageBucket: "ecopulse-80e88.appspot.com",
  messagingSenderId: "677239737024",
  appId: "1:677239737024:web:893a0c6b941c268f047b25",
  measurementId: "G-498TWDSDN1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 👈 INICIALIZANDO FIRESTORE

export { auth, db }; // 👈 EXPORTANDO DB TAMBÉM

export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
