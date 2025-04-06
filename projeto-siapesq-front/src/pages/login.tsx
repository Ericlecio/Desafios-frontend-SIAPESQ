import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    // Adicionar lógica de autenticação (API, etc.)

    setError(""); // Limpar erro caso os campos estejam corretos
    console.log("Email:", email, "Password:", password);
    // Enviar os dados para o backend ou API aqui
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
