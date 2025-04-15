import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Papa from "papaparse";
import FileSaver from "file-saver";

export default function Info() {
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [institution, setInstitution] = useState("");
  const [year, setYear] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSpecie, setSelectedSpecie] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setUser(user);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchSpeciesByTaxon = async (name?: string) => {
    setLoading(true);
    try {
      const offsetToUse = (currentPage - 1) * 24;
      let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&limit=24&offset=${offsetToUse}`;

      if (name) {
        const taxonRes = await fetch(
          `https://api.gbif.org/v1/species/match?name=${name}`
        );
        const taxonData = await taxonRes.json();
        if (taxonData.usageKey) {
          url = `https://api.gbif.org/v1/occurrence/search?taxonKey=${taxonData.usageKey}&mediaType=StillImage&limit=24&offset=${offsetToUse}`;
        }
      }

      if (countryFilter) url += `&country=${countryFilter}`;
      if (institution) url += `&institutionCode=${institution}`;
      if (year) url += `&year=${year}`;
      if (latitude && longitude)
        url += `&decimalLatitude=${latitude}&decimalLongitude=${longitude}`;
      if (orderBy) url += `&sort=${orderBy}`;

      const res = await fetch(url);
      const data = await res.json();
      setSpecies(data.results);
      setHasMore(data.results.length > 0);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeciesByTaxon(searchTerm);
  }, [
    currentPage,
    countryFilter,
    institution,
    year,
    latitude,
    longitude,
    orderBy,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSpeciesByTaxon(searchTerm);
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(
      species.map((s) => ({
        Nome: s.species,
        Científico: s.scientificName,
        País: s.country,
        Ano: s.year,
        Data: s.eventDate,
        Latitude: s.decimalLatitude,
        Longitude: s.decimalLongitude,
        Instituição: s.institutionCode,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    FileSaver.saveAs(blob, "registros_biodiversidade.csv");
  };

  if (!user) {
    return (
      <div className="text-center py-10 text-lg text-gray-600">
        Verificando autenticação...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E0F2F1] to-[#B2DFDB]">
      <Navbar />

      <main className="flex-grow px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-[#1E3A8A] mb-10">
          Espécies com Registros Visuais
        </h1>

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
        >
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Espécie"
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
          />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
          >
            <option value="">Todos os Países</option>
            <option value="BR">Brasil</option>
            <option value="US">Estados Unidos</option>
            <option value="CO">Colômbia</option>
            <option value="MX">México</option>
            <option value="AR">Argentina</option>
          </select>
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="Instituição (ex: INPA)"
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Ano (ex: 2020)"
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
          />
          <input
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Latitude"
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
          />
          <input
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Longitude"
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
          />
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
          >
            <option value="">Ordenar por...</option>
            <option value="year">Ano</option>
            <option value="eventDate">Data do Registro</option>
            <option value="country">País (A-Z)</option>
          </select>
          <button
            type="submit"
            className="col-span-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow transition"
          >
            Buscar
          </button>
        </form>

        {loading ? (
          <div className="text-center text-lg text-gray-700">
            Carregando dados...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {species.map((specie) => (
              <div
                key={specie.key || specie.occurrenceID}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={specie.media?.[0]?.identifier || "/placeholder.jpg"}
                  alt={specie.scientificName || "Espécie"}
                  className="h-52 w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="text-lg font-bold text-[#1E3A8A]">
                    {specie.species || "Desconhecida"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Local:</strong> {specie.country || "Desconhecido"}
                  </p>
                  <button
                    onClick={() => setSelectedSpecie(specie)}
                    className="mt-2 inline-block text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                  >
                    Ver Mais →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-gray-700 font-medium">
            Página {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!hasMore}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Próxima →
          </button>
        </div>

        {selectedSpecie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
              <button
                onClick={() => setSelectedSpecie(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>

              {selectedSpecie.media?.length > 0 && (
                <img
                  src={selectedSpecie.media[0].identifier}
                  alt={selectedSpecie.scientificName}
                  className="w-full h-80 object-cover rounded-xl mb-6 shadow"
                />
              )}

              {selectedSpecie.media?.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-600 mb-2">
                    Outras imagens:
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {selectedSpecie.media
                      .slice(1)
                      .map((img: any, index: number) => (
                        <img
                          key={index}
                          src={img.identifier}
                          alt={`${selectedSpecie.scientificName} ${index}`}
                          className="h-32 rounded-xl object-cover shadow min-w-[150px]"
                        />
                      ))}
                  </div>
                </div>
              )}

              <h2 className="text-3xl font-bold text-[#1E3A8A] mb-1">
                {selectedSpecie.species || "Espécie Desconhecida"}
              </h2>
              <p className="italic text-gray-600 mb-4">
                {selectedSpecie.scientificName}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-800">
                {selectedSpecie.country && (
                  <p>
                    <strong>País:</strong> {selectedSpecie.country}
                  </p>
                )}
                {selectedSpecie.eventDate && (
                  <p>
                    <strong>Data do Registro:</strong>{" "}
                    {selectedSpecie.eventDate}
                  </p>
                )}
                {selectedSpecie.recordedBy && (
                  <p>
                    <strong>Coletor:</strong> {selectedSpecie.recordedBy}
                  </p>
                )}
                {(selectedSpecie.decimalLatitude ||
                  selectedSpecie.decimalLongitude) && (
                  <p>
                    <strong>Coordenadas:</strong>{" "}
                    {selectedSpecie.decimalLatitude},{" "}
                    {selectedSpecie.decimalLongitude}
                  </p>
                )}
                {selectedSpecie.institutionCode && (
                  <p>
                    <strong>Instituição:</strong>{" "}
                    {selectedSpecie.institutionCode}
                  </p>
                )}
                {selectedSpecie.basisOfRecord && (
                  <p>
                    <strong>Tipo de Registro:</strong>{" "}
                    {selectedSpecie.basisOfRecord}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={`https://www.gbif.org/occurrence/${
                    selectedSpecie.key || selectedSpecie.occurrenceID
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow text-sm"
                >
                  🌐 Ver na GBIF
                </a>

                {selectedSpecie.media?.[0]?.identifier?.endsWith(".jpg") && (
                  <a
                    href={selectedSpecie.media[0].identifier.replace(
                      ".jpg",
                      ".svg"
                    )}
                    download={`${selectedSpecie.species || "especie"}.svg`}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow text-sm"
                  >
                    📥 Baixar SVG
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
