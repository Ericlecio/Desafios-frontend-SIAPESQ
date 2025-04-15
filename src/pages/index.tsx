import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Index: React.FC = () => {
  const router = useRouter();

  const speciesImages = [
    "https://static.wixstatic.com/media/8438f6_449ebfdb0e8f4cdd968752e658250ff2~mv2.jpg",
    "https://cdn.pixabay.com/photo/2023/03/28/09/28/cat-7882701_1280.jpg",
    "https://www.infoescola.com/wp-content/uploads/2017/11/zebras_234779578.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [highlightSpecies, setHighlightSpecies] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % speciesImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await fetch(
          "https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&limit=4"
        );
        const data = await res.json();
        setHighlightSpecies(data.results);
      } catch (err) {
        console.error("Erro ao buscar espécies em destaque", err);
      }
    };
    fetchHighlights();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 flex-grow">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <img
            src={speciesImages[currentImage]}
            alt={`Espécie ${currentImage}`}
            className="w-full h-full object-cover brightness-50"
          />
        </div>

        <div className="z-10 relative text-white max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-md">
            EcoPulse - Monitorando o pulso da vida no planeta
          </h1>
          <p className="text-lg max-w-2xl mt-6 mx-auto drop-shadow-md">
            O <strong>EcoPulse</strong> conecta você aos dados da biodiversidade
            global. Descubra espécies, explore classificações e aprofunde-se no
            conhecimento da vida na Terra com dados reais da API GBIF.
          </p>

          <button
            onClick={() => router.push("/info")}
            className="mt-6 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-full font-semibold shadow transition"
          >
            Explorar Espécies
          </button>
        </div>
      </section>

      {/* Destaques */}
      <section className="bg-white py-16 px-6 md:px-16 lg:px-24">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-12">
          Espécies em Destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlightSpecies.map((specie, idx) => (
            <a
              key={specie.key || idx}
              href={`https://www.gbif.org/occurrence/${
                specie.key || specie.occurrenceID
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <img
                src={specie.media?.[0]?.identifier || "/placeholder.jpg"}
                alt={specie.species || "Espécie"}
                className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#1E3A8A] group-hover:underline">
                  {specie.species || "Espécie Desconhecida"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Local: {specie.country || "Não informado"}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Registro: {specie.basisOfRecord || "Não especificado"}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
