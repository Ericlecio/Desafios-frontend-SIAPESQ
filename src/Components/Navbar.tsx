import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu, X, User, LogOut, Home } from "lucide-react"; // Importando ícones
import { FaSignInAlt } from "react-icons/fa";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("isLoggedIn");
    setUserName(null);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-[#0F172A] text-white shadow-md fixed top-0 z-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Center logo and nav */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleNavigation("/")}
                className="hidden md:inline-block text-lg font-semibold hover:text-emerald-400 transition"
              >
                <Home size={20} className="inline mr-2" />
                Início
              </button>

              {/* Logo */}
              <div
                onClick={() => handleNavigation("/")}
                className="cursor-pointer flex items-center space-x-2"
              >
                <img
                  src="/Logo_EcoPulse.png"
                  alt="EcoPulse"
                  className="w-20 h-16"
                />
                <span className="text-xl font-bold tracking-wide text-white">
                  EcoPulse
                </span>
              </div>
            </div>
          </div>

          {/* Login or username */}
          <div className="hidden md:block relative">
            {userName ? (
              <div className="flex items-center space-x-3 cursor-pointer">
                <User size={24} className="text-emerald-300" />
                <span
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-emerald-300 font-semibold text-lg"
                >
                  {userName}
                </span>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute top-12 right-0 bg-white text-black shadow-xl rounded-lg py-3 w-48">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100 rounded-lg"
                    >
                      <LogOut size={18} className="inline mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold transition"
              >
                <FaSignInAlt size={18} className="inline mr-2" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu content */}
      {menuOpen && (
        <div className="md:hidden bg-[#1E3A8A] flex flex-col items-center space-y-4 py-4">
          <button
            onClick={() => handleNavigation("/")}
            className="hover:text-emerald-300 transition text-lg flex items-center gap-2"
          >
            <Home size={20} /> Início
          </button>
          {userName ? (
            <>
              <span className="text-emerald-300 font-semibold">{userName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <LogOut size={18} />
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigation("/login")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaSignInAlt size={18} />
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
