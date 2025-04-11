import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Info() {
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchSpeciesByTaxon = async (name?: string, reset = false) => {
    setLoading(true);
    try {
      let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&limit=24&offset=${
        reset ? 0 : offset
      }`;

      if (name) {
        const taxonRes = await fetch(
          `https://api.gbif.org/v1/species/match?name=${name}`
        );
        const taxonData = await taxonRes.json();
        if (taxonData.usageKey) {
          url = `https://api.gbif.org/v1/occurrence/search?taxonKey=${
            taxonData.usageKey
          }&mediaType=StillImage&limit=24&offset=${reset ? 0 : offset}`;
        }
      }

      const res = await fetch(url);
      const data = await res.json();
      setSpecies((prev) => (reset ? data.results : [...prev, ...data.results]));
      setHasMore(data.results.length > 0);
      if (!reset) setOffset((prev) => prev + 24);
      else setOffset(24);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeciesByTaxon();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchSpeciesByTaxon(searchTerm);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [observerRef.current, hasMore, loading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    fetchSpeciesByTaxon(searchTerm, true);
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
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome da espécie (ex: Panthera onca)"
            className="w-full sm:w-[30rem] px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow transition"
          >
            Buscar
          </button>
        </form>

        {loading && species.length === 0 ? (
          <div className="text-center text-lg text-gray-700">
            Carregando dados da biodiversidade...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {species.map((specie) => (
              <div
                key={specie.key || specie.occurrenceID}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={specie.media?.[0]?.identifier || "/placeholder.jpg"}
                  alt={specie.scientificName || "Espécie"}
                  className="h-52 w-full object-cover"
                />
                <div className="p-5 space-y-2">
                  <h2 className="text-lg font-bold text-[#1E3A8A]">
                    {specie.species || "Espécie Desconhecida"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Local:</strong> {specie.country || "Não informado"}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    <strong>Registro:</strong>{" "}
                    {specie.basisOfRecord || "Não especificado"}
                  </p>
                  <button
                    onClick={() =>
                      console.log(specie.key || specie.occurrenceID)
                    }
                    className="mt-3 inline-block text-emerald-600 hover:text-emerald-800 font-medium text-sm transition"
                  >
                    Ver Mais →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={observerRef} className="h-10 mt-8 text-center text-gray-600">
          {loading && species.length > 0 && "Carregando mais..."}
        </div>
      </main>

      <Footer />
    </div>
  );
}
