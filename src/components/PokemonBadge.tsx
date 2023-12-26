import React, { useContext } from 'react'
import { Match } from '../types'
import { SelectContext } from '../App'

export default function PokemonBadge({ pokemon }: { pokemon: Match }) {
  const { selectedPokemons, setSelectedPokemons } = useContext(SelectContext)!;

  function removePokemon() {
    const updatedPokemons = selectedPokemons.filter(item => item.name !== pokemon.name);
    setSelectedPokemons(updatedPokemons);
  }

  return (
    <button 
      className="min-w-[80px] px-4 py-1 rounded border border-neutral-400" 
      onClick={removePokemon}
    >
      {pokemon.name}
    </button>
  )
}
