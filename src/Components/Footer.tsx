// =======================
// Components/Footer.tsx
// =======================

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-12 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="font-semibold text-xl mb-4">Sobre</h3>
            <ul className="space-y-2">
              <li>
                <a href="/sobre" className="hover:text-emerald-400 transition">
                  Nossa História
                </a>
              </li>
              <li>
                <a
                  href="/contato"
                  className="hover:text-emerald-400 transition"
                >
                  Contato
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-emerald-400 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/comprar"
                  className="hover:text-emerald-400 transition"
                >
                  Comprar
                </a>
              </li>
              <li>
                <a href="/vender" className="hover:text-emerald-400 transition">
                  Vender
                </a>
              </li>
              <li>
                <a
                  href="/meus-anuncios"
                  className="hover:text-emerald-400 transition"
                >
                  Meus Anúncios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/termos" className="hover:text-emerald-400 transition">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="/politica-privacidade"
                  className="hover:text-emerald-400 transition"
                >
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                className="hover:text-emerald-400 transition"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook text-2xl"></i>
              </a>
              <a
                href="https://twitter.com"
                className="hover:text-emerald-400 transition"
                aria-label="Twitter"
              >
                <i className="bi bi-twitter text-2xl"></i>
              </a>
              <a
                href="https://www.instagram.com"
                className="hover:text-emerald-400 transition"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram text-2xl"></i>
              </a>
              <a
                href="https://www.linkedin.com"
                className="hover:text-emerald-400 transition"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin text-2xl"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-500 pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} EcoPulse. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
