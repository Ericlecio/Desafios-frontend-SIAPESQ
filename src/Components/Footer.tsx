import React from "react";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-14 pb-6 mt-10 font-poppins">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid de seções */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* EcoPulse Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-emerald-400">
              EcoPulse
            </h3>
            <p className="text-sm text-gray-300">
              Monitorando o pulso da vida no planeta. Dados da biodiversidade,
              acessíveis e em tempo real.
            </p>
          </div>

          {/* Sobre */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">
              Sobre
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/sobre" className="hover:text-emerald-300 transition">
                  Nossa História
                </a>
              </li>
              <li>
                <a
                  href="/contato"
                  className="hover:text-emerald-300 transition"
                >
                  Contato
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-emerald-300 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/termos" className="hover:text-emerald-300 transition">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="/politica-privacidade"
                  className="hover:text-emerald-300 transition"
                >
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">
              Siga-nos
            </h4>
            <div className="flex space-x-5 text-xl text-gray-300">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-emerald-500 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} EcoPulse. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
