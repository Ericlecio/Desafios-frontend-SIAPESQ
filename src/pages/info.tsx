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

  const fetchSpeciesByTaxon = async (name?: string, reset = false) => {
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
    fetchSpeciesByTaxon(searchTerm, true);
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
    fetchSpeciesByTaxon(searchTerm, true);
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

  if (!user)
    return (
      <div className="text-center py-10 text-lg text-gray-600">
        Verificando autenticação...
      </div>
    );

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

        <button
          onClick={exportToCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow transition mb-6"
        >
          📥 Exportar CSV
        </button>

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white max-h-[90vh] w-full max-w-2xl rounded-2xl shadow-lg overflow-y-auto p-6 relative">
              <button
                onClick={() => setSelectedSpecie(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
              >
                ×
              </button>
              <img
                src={
                  selectedSpecie.media?.[0]?.identifier || "/placeholder.jpg"
                }
                alt={selectedSpecie.scientificName}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">
                {selectedSpecie.species || "Espécie Desconhecida"}
              </h2>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Nome Científico:</strong>{" "}
                  {selectedSpecie.scientificName}
                </p>
                <p>
                  <strong>País:</strong> {selectedSpecie.country}
                </p>
                <p>
                  <strong>Data:</strong> {selectedSpecie.eventDate}
                </p>
                <p>
                  <strong>Coletor:</strong> {selectedSpecie.recordedBy}
                </p>
                <p>
                  <strong>Instituição:</strong> {selectedSpecie.institutionCode}
                </p>
                <p>
                  <strong>Tipo de Registro:</strong>{" "}
                  {selectedSpecie.basisOfRecord}
                </p>
                <p>
                  <strong>Coordenadas:</strong> {selectedSpecie.decimalLatitude}
                  , {selectedSpecie.decimalLongitude}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
