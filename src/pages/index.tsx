import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const index: React.FC = () => {
  const router = useRouter();

  const speciesImages = [
    "/tartarugajpg.jpg",
    "/tatu.jpg",
    "/sei.jpg",
    "/tigre.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % speciesImages.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 flex-grow relative">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={speciesImages[currentImage]}
            alt={`Espécie ${currentImage}`}
            className="w-full h-full object-cover opacity-60 brightness-75"
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg z-10 relative">
          EcoPulse - Monitorando o pulso da vida no planeta
        </h1>

        <p className="text-lg text-white max-w-2xl mb-8 mt-4 z-10 relative drop-shadow-md">
          O <strong>EcoPulse</strong> conecta você aos dados da biodiversidade
          global. Descubra espécies, explore classificações e aprofunde-se no
          conhecimento da vida na Terra com dados reais da API GBIF.
        </p>

        <button
          onClick={() => router.push("/informacoes")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition z-10 relative shadow-lg"
        >
          Explorar Espécies
        </button>
      </section>

      <section className="bg-white py-12 px-6 md:px-16 lg:px-24">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-10">
          Espécies em Destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">
                  Imagem do animal {idx + 1}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#1E3A8A]">
                  Nome Científico
                </h3>
                <p className="text-sm text-gray-700 mt-1">
                  Descrição breve da espécie ou informação relevante.
                </p>
                <button className="mt-4 text-emerald-600 hover:text-emerald-800 font-medium">
                  Ver mais
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default index;
