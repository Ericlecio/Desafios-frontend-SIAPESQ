import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaInfoCircle, FaShareAlt, FaRegThumbsUp } from "react-icons/fa";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LineElement
);

const Index: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [speciesData, setSpeciesData] = useState<any>(null);
  const [highlightSpecies, setHighlightSpecies] = useState<any[]>([]);
  const [speciesByCountry, setSpeciesByCountry] = useState<any[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleRedirectToInfo = () => {
    if (userName) {
      router.push("/info");
    } else {
      router.push("/login");
    }
  };

  const speciesImages = [
    "https://static.wixstatic.com/media/8438f6_449ebfdb0e8f4cdd968752e658250ff2~mv2.jpg",
    "https://cdn.pixabay.com/photo/2023/03/28/09/28/cat-7882701_1280.jpg",
    "https://www.infoescola.com/wp-content/uploads/2017/11/zebras_234779578.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % speciesImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        const speciesRes = await fetch(
          "https://api.gbif.org/v1/occurrence/search?limit=0"
        );
        const speciesData = await speciesRes.json();

        const endangeredSpeciesRes = await fetch(
          "https://api.gbif.org/v1/occurrence/search?limit=0&threatened=true"
        );
        const endangeredSpeciesData = await endangeredSpeciesRes.json();

        const speciesByCountryRes = await fetch(
          "https://api.gbif.org/v1/occurrence/search?limit=0&facet=country"
        );
        const speciesByCountryData = await speciesByCountryRes.json();

        setSpeciesData({
          totalSpecies: speciesData.count,
          endangeredSpecies: endangeredSpeciesData.count,
        });

        setSpeciesByCountry(speciesByCountryData.facetResults || []);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      }
    };

    fetchSpeciesData();
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

  const chartData = {
    labels: ["Espécies", "Espécies Ameaçadas", "Espécies Não Ameaçadas"],
    datasets: [
      {
        label: "Dados da Biodiversidade",
        data: [
          speciesData?.totalSpecies || 0,
          speciesData?.endangeredSpecies || 0,
          speciesData?.totalSpecies - speciesData?.endangeredSpecies || 0,
        ],
        backgroundColor: ["#34D399", "#F87171", "#93C5FD"],
        borderColor: ["#16A34A", "#F87171", "#1D4ED8"],
        borderWidth: 1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Crescimento das Espécies ao Longo do Tempo",
      },
    },
  };

  const barChartData =
    speciesByCountry && speciesByCountry.length
      ? {
          labels: speciesByCountry.map((item: any) => item.value),
          datasets: [
            {
              label: "Espécies por País",
              data: speciesByCountry.map((item: any) => item.count),
              backgroundColor: "#34D399",
              borderColor: "#16A34A",
              borderWidth: 1,
            },
          ],
        }
      : {};

  return (
    <div className="min-h-screen flex flex-col from-[#E0F7FA] to-[#F1F8F9]">
      <Navbar />

      <section className="relative flex flex-col items-center justify-center text-center px-6 py-50 flex-grow">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <img
            src={speciesImages[currentImage]}
            alt={`Espécie ${currentImage}`}
            className="w-full h-full object-cover brightness-50 transition-all duration-1000 ease-in-out transform hover:scale-110"
          />
        </div>

        <div className="z-10 relative text-white max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-md animate__animated animate__fadeInUp">
            EcoPulse - Monitorando o pulso da vida no planeta
          </h1>
          <p className="text-lg max-w-2xl mt-6 mx-auto drop-shadow-md animate__animated animate__fadeInUp animate__delay-1s">
            O <strong>EcoPulse</strong> conecta você aos dados da biodiversidade
            global. Descubra espécies, explore classificações e aprofunde-se no
            conhecimento da vida na Terra com dados reais da API GBIF.
          </p>

          <button
            onClick={handleRedirectToInfo}
            className="mt-10 bg-emerald-800 hover:bg-emerald-700 px-6 py-3 rounded-full font-semibold shadow transition transform hover:scale-105 hover:shadow-lg"
          >
            Explorar mais Espécies
          </button>
        </div>
      </section>

      {/* Dados e gráficos interativos */}
      <section className="bg-[#F1F8F9] py-16 px-6 md:px-16 lg:px-24">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-12">
          Dados da Biodiversidade - Estatísticas e Gráficos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Gráfico de Pizza */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-all">
            <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">
              Distribuição das Espécies
            </h3>
            <Pie data={chartData} />
          </div>

          {/* Gráfico de Linha */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-all">
            <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">
              Crescimento de Espécies ao Longo do Tempo
            </h3>
            <Line data={chartData} options={lineChartOptions} />
          </div>

          {/* Gráfico de Barras para espécies por país */}
          {speciesByCountry && speciesByCountry.length > 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-all">
              <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">
                Espécies por País
              </h3>
              {/* <Bar data={barChartData} /> */}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-all">
              <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">
                Não há dados disponíveis para espécies por país.
              </h3>
            </div>
          )}
        </div>
      </section>

      {/* Espécies em Destaque */}
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
              className="group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
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
                {/* Adicionando ícones de ação */}
                <div className="flex gap-4 mt-4">
                  <button className="text-emerald-500 hover:text-emerald-700">
                    <FaInfoCircle />
                  </button>
                  <button className="text-emerald-500 hover:text-emerald-700">
                    <FaShareAlt />
                  </button>
                  <button className="text-emerald-500 hover:text-emerald-700">
                    <FaRegThumbsUp />
                  </button>
                </div>
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
