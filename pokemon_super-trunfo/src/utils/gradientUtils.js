// Mapeamento de cores por tipo
const tipoGradienteMap = {
  default: ['#473e3e', '#2a2a2a'],
  water: ['#3f2b96', '#a8c0ff'],
  grass: ['#11998e', '#38ef7d'],
  poison: ['#e100ff', '#1d8348'],
  fire: ['#ff0000', '#f5af19'],
  electric: ['#ff8c00', '#ffa500'],
  bug: ['#8bc34a', '#cddc39'],
  rock: ['#313131', '#8B8B8B'],
  ground: ['#BA8B02', '#5D3A03'],
  fighting: ['#C31432', '#313131'],
  ghost: ['#e100ff', '#3A007F'],
  normal: ['#c8be82', '#696969'],
  flying: ['#11d3f3', '#96b9cd'],
  ice: ['#0083B0', '#00B4DB'],
  psychic: ['#5c03bc', '#e536ab'],
  dragon: ['#43cea2', '#C31432'],
  fairy: ['#f756aa', '#f75672'],
  steel: ['#696969', '#a9a9a9'],
  dark: ['#4b6cb7', '#182848'],
};

export function getCardGradient(tipo) {
  const tipos = tipo.split(',').map((t) => t.trim().toLowerCase());
  const cores1 = tipoGradienteMap[tipos[0]] || tipoGradienteMap.default;
  const cores2 = tipos[1]
    ? tipoGradienteMap[tipos[1]] || tipoGradienteMap.default
    : cores1;

  return tipos.length > 1
    ? `linear-gradient(135deg, ${cores1[0]}, ${cores2[1]})`
    : `linear-gradient(135deg, ${cores1[0]}, ${cores1[1]})`;
}
