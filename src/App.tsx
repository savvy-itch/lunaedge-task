import { createContext, useState } from 'react';
import Form from './components/Form';
import { Match } from './types';

interface ContextType {
  selectedItemId: string,
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>,
  selectedPokemons: Match[],
  setSelectedPokemons: React.Dispatch<React.SetStateAction<Match[]>>,
}

export const SelectContext = createContext<ContextType | null>(null);

function App() {
  const [selectedItemId, setSelectedItemId] = useState<string>('1');
  const [selectedPokemons, setSelectedPokemons] = useState<Match[]>([]);

  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen bg-slate-400">
      <SelectContext.Provider value={{selectedItemId, setSelectedItemId, selectedPokemons, setSelectedPokemons}}>
        <h1 className="font-bold text-3xl">Build Your Pokemon Team!</h1>
          <Form />
      </SelectContext.Provider>
    </div>
  )
}

export default App