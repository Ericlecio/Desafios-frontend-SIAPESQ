import React from "react";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <nav className="w-full bg-[#0F172A] text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer space-x-2"
          >
            <img
              src="Logo_EcoPulse.png"
              alt="Logo EcoPulse"
              className="w-10 h-10"
            />
            <span className="text-xl font-bold">EcoPulse</span>
          </div>

          {/* Links de navegação */}
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => router.push("/")}
              className="hover:text-emerald-400 transition"
            >
              Início
            </button>
            <button
              onClick={() => router.push("/info")}
              className="hover:text-emerald-400 transition"
            >
              Espécies
            </button>
          </div>

          {/* Login */}
          <div>
            <button
              onClick={() => router.push("/Login")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex justify-center space-x-6 p-2 bg-[#1E3A8A]">
        <button
          onClick={() => router.push("/")}
          className="hover:text-emerald-300 transition"
        >
          Início
        </button>
        <button
          onClick={() => router.push("/informacoes")}
          className="hover:text-emerald-300 transition"
        >
          Espécies
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
