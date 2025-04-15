import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

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
    setUserName(null);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-[#0F172A] text-white shadow-md fixed top-0 z-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation("/")}
                className="hidden md:inline-block hover:text-emerald-400 transition"
              >
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
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold tracking-wide">
                  EcoPulse
                </span>
              </div>

              <button
                onClick={() => handleNavigation("/info")}
                className="hidden md:inline-block hover:text-emerald-400 transition"
              >
                Espécies
              </button>
            </div>
          </div>

          {/* Login or username */}
          <div className="hidden md:block">
            {userName ? (
              <div className="flex items-center space-x-3">
                <span className="text-emerald-300 font-semibold">
                  {userName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/Login")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold transition"
              >
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
            className="hover:text-emerald-300 transition text-lg"
          >
            Início
          </button>
          <button
            onClick={() => handleNavigation("/info")}
            className="hover:text-emerald-300 transition text-lg"
          >
            Espécies
          </button>
          {userName ? (
            <>
              <span className="text-emerald-300 font-semibold">{userName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigation("/login")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
