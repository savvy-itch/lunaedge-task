import React, { useContext } from 'react'
import { SelectContext } from '../App';
import { FormData } from '../types';
import { ModalContext } from './Form';

interface ModalProps {
  formData: FormData,
}

export default function Modal({ formData }: ModalProps) {
  const { selectedPokemons } = useContext(SelectContext)!;
  const { showModal, setShowModal } = useContext(ModalContext)!;

  return (
    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2	 bg-pink-400 rounded-lg p-5 flex flex-col justify-center items-center gap-5">
      <h2>{formData.firstName} {formData.lastName}, your team has been created successfully!</h2>
      <h3>Your pokemons:</h3>
      <section className="flex justify-between">
        {selectedPokemons.map(pokemon => {
          return <div key={pokemon.name} className="border border-black rounded">
            <img src="" alt={pokemon.name} />
            <p>{pokemon.name}</p>
          </div>
        })}
        <button onClick={() => setShowModal(false)}>Close</button>
      </section>
    </div>
  )
}
