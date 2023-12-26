import React, { createContext, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SelectInput from './SelectInput';
import { SelectContext } from '../App';
import { FormData, Match } from '../types';
import PokemonBadge from './PokemonBadge';
import Modal from './Modal';
import { maxPokemonAmount } from '../globals';

interface ContextType {
  showModal: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalContext = createContext<ContextType | null>(null);

export default function Form() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { register, handleSubmit, formState: {errors} } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      selectedPokemons: []
    }
  });
  const {selectedPokemons} = useContext(SelectContext)!;

  function submitData(data: FormData) {
    setFormData(data);
  }

  useEffect(() => {
    if (formData && selectedPokemons.length === maxPokemonAmount) {
      setShowModal(true)
    } else {
      setShowModal(false);
    }
  }, [formData, selectedPokemons])

  return (
    <form 
      className="flex flex-col gap-3 bg-neutral-100 p-6 w-11/12 sm:2/3 md:w-1/2 lg:w-2/5 rounded-lg"
      onSubmit={handleSubmit(submitData)}
    >
      <h2 className="text-center font-bold text-2xl">Trainer info</h2>

      <label htmlFor="firstName">First Name</label>
      <input 
        className="border p-2 rounded"
        id='firstName' 
        {...register('firstName', {required: "Please enter a valid first name", minLength: {value: 1, message: "First name must be at least 1 character long"}})} 
        type="text" 
        placeholder='Enter your name...' 
      />
      <p className='h-[14px] text-sm text-red-600'>{errors.firstName?.message}</p>

      <label htmlFor="lastName">Last Name</label>
      <input 
        className="border p-2 rounded"
        id='lastName' 
        {...register('lastName', {required: "Please enter a valid last name", minLength: {value: 1, message: "First name must be at least 1 character long"}})} 
        type="text" 
        placeholder='Enter your last name...' 
      />
      <p className='h-[14px] text-sm text-red-600'>{errors.lastName?.message}</p>

      <SelectInput />
      <section className="flex flex-wrap gap-3">
        {selectedPokemons.map((item: Match) => {
          return <PokemonBadge key={item.name} pokemon={item} />
        })}
      </section>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 mt-7 rounded" type='submit'>Create Team</button>

      {showModal && (
        <ModalContext.Provider value={{showModal, setShowModal}}>
          <Modal formData={formData as FormData} />
        </ModalContext.Provider>
      )}
    </form>
  )
}