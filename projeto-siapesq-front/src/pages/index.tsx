import { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "../components/CardComponent";
import SearchBar from "../components/SearchBar";

const IndexPage = () => {
  const [speciesData, setSpeciesData] = useState<any[]>([]); // Aqui vamos armazenar os dados das espécies
  const [filteredData, setFilteredData] = useState<any[]>([]); // Dados filtrados conforme a pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  const [bbox, setBbox] = useState([-180, 180, -90, 90]); // Definir os limites geográficos para o GBIF
  const [limit, setLimit] = useState(100); // Número de resultados

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        // Substitua 'Thunnus Obesus' com o nome da espécie desejada
        const specieName = "Thunnus Obesus";

        // Obtém o taxonKey da espécie (caso queira, pode adicionar essa funcionalidade também)
        const taxonKeyResponse = await axios.get(
          `https://api.gbif.org/v1/species/match?name=${specieName}`
        );
        const taxonKey = taxonKeyResponse.data.usageKey;

        // Chama a API para buscar as ocorrências com base nos parâmetros
        const response = await axios.get(
          `https://api.gbif.org/v1/occurrence/search?taxonKey=${taxonKey}&decimalLongitude=${bbox[0]},${bbox[1]}&decimalLatitude=${bbox[2]},${bbox[3]}&limit=${limit}`
        );

        setSpeciesData(response.data.results);
        setFilteredData(response.data.results); // Inicialmente, todos os dados são mostrados
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchSpecies();
  }, [bbox, limit]);

  useEffect(() => {
    const filtered = speciesData.filter(
      (species) =>
        species.species &&
        species.species.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, speciesData]);

  return (
    <div className="container mx-auto p-4">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((species, index) => (
            <CardComponent
              key={index}
              name={species.species}
              description={species.description || "Descrição não disponível"}
              imageUrl={species.imageUrl || "URL_DA_IMAGEM_PADRAO"}
            />
          ))
        ) : (
          <div>Sem resultados para sua pesquisa</div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
