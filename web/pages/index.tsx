import React, { useState } from "react";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export async function getServerSideProps(context: { query: { offset: string } }) {
  const offset = parseInt(context.query.offset) || 0;
  const res = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=50&offset=${offset}`);
  const data = await res.json();

  const pokemonList = await Promise.all(
    data.results.map(async (p: { name: string; url: string }) => {
      const pokemonRes = await fetch(p.url);
      const details = await pokemonRes.json();
      return {
        name: p.name,
        image: details.sprites.front_default,
        url: p.url,
      };
    })
  );

  return {
    props: { pokemonList, offset },
  };
}

const Index = ({ pokemonList = [], offset = 0 }: { pokemonList: { name: string; image: string; url: string }[], offset: number }) => {
  const totalPages = 20;
  const currentPage = Math.max(1, Math.min(20, offset / 50 + 1));
  const [selectedPokemon, setSelectedPokemon] = useState<{ name: string; sprites: { front_default: string }; height: number; weight: number; types: { type: { name: string } }[]; moves: { move: { name: string } }[] } | null>(null);
  const [speciesData, setSpeciesData] = useState<{ evolutionChain: string[] } | null>(null);
  const [moveData, setMoveData] = useState<{ name: string; power: number; pp: number; type: { name: string } } | null>(null);

  const fetchPokemonDetails = (url: string) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSelectedPokemon(data);
        setMoveData(null);
        fetch(`${POKEAPI_BASE_URL}/pokemon-species/${data.name}`)
          .then((res) => res.json())
          .then((species) => {
            fetch(species.evolution_chain.url)
              .then((res) => res.json())
              .then((evolutionData) => {
                const evolutionChain = [];
                let current = evolutionData.chain;
                while (current) {
                  evolutionChain.push(current.species.name);
                  if (current.evolves_to.length > 0) {
                    current = current.evolves_to[0];
                  } else {
                    break;
                  }
                }
                setSpeciesData({ ...species, evolutionChain });
              });
          });
      });
  };

  const fetchMoveDetails = (move: string) => {
    fetch(`${POKEAPI_BASE_URL}/move/${move}`)
      .then((res) => res.json())
      .then((data) => {
        setMoveData(data);
      });
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Pokédex</h1>
      {selectedPokemon && (
        <div className="border p-4 rounded shadow-md w-80 text-center mb-4">
          <h2 className="text-xl font-bold capitalize">{selectedPokemon.name}</h2>
          <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} className="w-24 h-24 mx-auto" />
          <p>Height: {selectedPokemon.height}</p>
          <p>Weight: {selectedPokemon.weight}</p>
          <p>Type: {selectedPokemon.types.map(t => t.type.name).join(", ")}</p>
          {speciesData && <p>Evolution Chain: {(speciesData && speciesData.evolutionChain || []).join(' → ')}</p>}
          <h3 className="text-lg font-bold mt-4">Moves</h3>
          <div className="grid grid-cols-2 gap-2">
            {selectedPokemon.moves.slice(0, 6).map((move, index) => (
              <button key={index} className='bg-blue-500 text-white px-2 py-1 rounded' onClick={() => fetchMoveDetails(move.move.name)}>{move.move.name.replace(/-/g, ' ')}</button>
            ))}
          </div>
        </div>
      )}
      {moveData && (
        <div className="border p-4 rounded shadow-md w-80 text-center mb-4">
          <h2 className="text-xl font-bold">{moveData.name.replace(/-/g, ' ')}</h2>
          <p>Power: {moveData.power !== undefined && moveData.power || "N/A"}</p>
          <p>PP: {moveData.pp}</p>
          <p>Type: {moveData.type.name}</p>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Pokémon List</h2>
        <div className="grid grid-cols-5 gap-4">
          {pokemonList.map((p: { name: string; image: string; url: string }, index: number) => (
            <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => fetchPokemonDetails(p.url)}>
              <img src={p.image} loading="lazy" alt={p.name} className="w-20 h-20" />
              <p className="capitalize text-sm font-semibold">{p.name}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center space-x-2 mt-4">
          <a 
            className={`bg-blue-500 text-white px-4 py-2 rounded ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`} 
            href={`/?offset=${offset - 50}`}>
            Previous
          </a>
          <span className='text-lg font-bold'>Page {currentPage} of {totalPages}</span>
          <a 
            className={"bg-blue-500 text-white px-4 py-2 rounded" + (currentPage === totalPages && "opacity-50 cursor-not-allowed")} 
            href={`/?offset=${offset + 50}`}>
            Next
          </a>
        </div>
      </div>
    </div>
  );
};


export default Index;
