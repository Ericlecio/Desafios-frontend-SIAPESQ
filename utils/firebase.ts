import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database"; // Para o Realtime Database

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdN9IyIJa7PQMStArmcstJ1RiZzU2KyLE",
  authDomain: "biodata-8489b.firebaseapp.com",
  projectId: "biodata-8489b",
  storageBucket: "biodata-8489b.firebasestorage.app",
  messagingSenderId: "475735825795",
  appId: "1:475735825795:web:b095db9dcf7c40a9386ab6"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando o Firebase Auth
const auth = getAuth();

// Inicializando o Realtime Database
const db = getDatabase();

// Função para registrar um novo usuário
export const registerWithEmail = async (email: string, password: string, name: string) => {
  try {
    // Registra o usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salva os dados do usuário no Realtime Database
    const userRef = ref(db, 'users/' + user.uid); // Usando o UID como chave para o usuário
    await set(userRef, {
      name: name,
      email: email,
      uid: user.uid,
      createdAt: new Date().toISOString(), // Adiciona data de criação
    });

    console.log("Usuário registrado e dados salvos no Realtime Database!");
  } catch (error) {
    console.error("Erro no cadastro:", error);
  }
};

// Função para login com e-mail e senha
export const loginWithEmail = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Erro no login:", error);
  }
};

// Função para logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

// Função para monitorar a autenticação do usuário
export const onAuthStateChangedListener = (callback: (user: any) => void) => {
  onAuthStateChanged(auth, callback);
};

export { auth };
