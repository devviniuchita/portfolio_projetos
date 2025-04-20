// src/utils/fetchPokemon.js
export async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao obter dados de ${url}`);
  }
  return await response.json();
}
