// pages/register.tsx
const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl mb-4">Registro</h2>
        <input
          type="text"
          placeholder="Nome"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-4 border rounded"
        />
        <button className="w-full p-2 bg-green-500 text-white rounded">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
