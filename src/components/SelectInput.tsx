import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SelectContext } from '../App';
import { Match } from '../types';
import axios from 'axios';
import { scrollDown, scrollToTop, scrollUp } from '../helpers';
import { baseUrl, maxPokemonAmount } from '../globals';

// add modal
  // display error message if not enough pokemons were selected
// Storybook implementation

const limit = 20;

export default function SelectInput() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const selectRef = useRef<HTMLInputElement>();
  const dropdownContainerRef = useRef<HTMLDivElement>();
  const [inputValue, setInputValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Match[]>([]);
  const [fetchedList, setFetchedList] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isResults, setIsResults] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPokemonRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      // if it's the last visible item, load more results
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    })
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);
  const {
    selectedItemId, 
    setSelectedItemId, 
    selectedPokemons, 
    setSelectedPokemons,
  } = useContext(SelectContext)!;

  function findMatches(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    loadMoreResults(e.target.value);
  }

  function updateSelectedItem(e: React.KeyboardEvent) {
    const currIdx = searchResults.findIndex(item => item.name === selectedItemId);
    const containerRect = dropdownContainerRef.current?.getBoundingClientRect();
    if (e.key === 'ArrowDown' && showDropdown) {
      // if it's the last item on the list, select the first one
      if (currIdx + 1 > searchResults.length - 1) {
        // move to the top of the scroll field
        scrollToTop(dropdownContainerRef, containerRect);
        setSelectedItemId(searchResults[0].name);
      } else {
        const updatedIdx = currIdx + 1;
        // if the bottom item is beyond the view field, scroll down
        scrollDown(dropdownContainerRef, containerRect, updatedIdx);
        setSelectedItemId(searchResults[updatedIdx].name);
      }
    } else if (e.key === 'ArrowUp' && showDropdown) {
      if (currIdx - 1 >= 0) {
        const updatedIdx = currIdx - 1;
        // if the top item is beyond the view field, scroll up
        scrollUp(dropdownContainerRef, containerRect, updatedIdx);
        setSelectedItemId(searchResults[updatedIdx].name);
      }
    } else if (e.key === 'Enter') {
      // add a pokemon
      e.preventDefault();
      addPokemon(searchResults[currIdx]);
      setInputValue(searchResults[currIdx].name);
    }
  }

  function addPokemon(newPokemon: Match) {
    const isDuplicate = selectedPokemons.some(item => item.name === newPokemon.name);
    // if selected pokemon hasn't been submitted yet
    if (!isDuplicate) {
      // if amount of selected pokemons doesn't exceed the limit
      if (selectedPokemons.length < maxPokemonAmount) {
        setSelectedPokemons([...selectedPokemons, newPokemon]);
      } else {
        // replace the last pokemon
        const updatedPokemons = [...selectedPokemons];
        updatedPokemons.splice(selectedPokemons.length - 1, 1, newPokemon);
        setSelectedPokemons(updatedPokemons);
      }
      setShowDropdown(false);
    }
  }

  function hideDropdown() {
    // delay is needed because otherwise onBlur won't register a submission w/ click event and close the dropdown
    setTimeout(() => {
      setShowDropdown(false);
    }, 100)
  }

  // fetch all the available pokemons
  function fetchItems(reqLength: string) {
    return axios.get(`${baseUrl}?limit=${reqLength}`)
      .then(res => setFetchedList(res.data.results))
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function paginateItems(items: Match[]) {
    const paginatedItems = page === 1 
      ? items.slice(0, limit)
      : items.slice(0, limit * page);
    setHasMore(paginatedItems.length === searchResults.length);
    return paginatedItems;
  }

  function loadMoreResults(input: string) {
    setIsLoading(true);
    if (input !== '') {
      let updatedResults = fetchedList.filter(elem => elem.name.includes(input));
      updatedResults = paginateItems(updatedResults);
      setSearchResults(updatedResults);
    } else {
      setSearchResults(paginateItems(fetchedList));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadMoreResults(inputValue);
  }, [page]);

  // reset selected item on dropdown collapse
  useEffect(() => {
    if (!showDropdown && !isLoading) {
      setSelectedItemId(searchResults[0]?.name);
    }
  }, [showDropdown]);

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();

    // fetch the total number of pokemons
    axios.get(`${baseUrl}?limit=1`, {
      signal: controller.signal
    })
      .then(res => {return fetchItems(res.data.count)})
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setSearchResults(paginateItems(fetchedList));
  }, [fetchedList]);

  useEffect(() => {
    if (searchResults.length === 0) {
      setIsResults(false);
    } else {
      setIsResults(true);
    }
  }, [searchResults]);

  return (
    <div className='relative w-full'>
      <label htmlFor="pokemons">Choose 4 pokemons for your team:</label>
      <input 
        className="w-full border p-2 rounded"
        ref={selectRef as React.RefObject<HTMLInputElement>} 
        onFocus={() => setShowDropdown(true)} 
        onBlur={hideDropdown}
        type='text' 
        placeholder='Select your pokemon...' 
        value={inputValue}
        onChange={findMatches}
        onKeyDown={updateSelectedItem}
      />
      {showDropdown && 
        <div 
          ref={dropdownContainerRef as React.RefObject<HTMLDivElement>} 
          className="absolute top-full w-full max-h-[166px] border border-neutral-400 rounded overflow-y-scroll"
        >
          {isLoading && <p className="p-2 text-center">Loading...</p>}
          {!isResults && <p className="p-2 text-center">No matches found.</p>}
          {searchResults.map((option, index) => {
            return <div 
              className={`${selectedItemId === option.name && 'bg-slate-200'} bg-slate-100 hover:cursor-pointer hover:bg-slate-200`}
              onMouseOver={() => setSelectedItemId(option.name)}
              onClick={() => addPokemon(option)}
              ref={searchResults.length === index + 1 ? lastPokemonRef : null}
              key={option.name}
            >
              <div className="p-2">
                {option.name}
              </div>
              <div className='h-[1px] w-11/12 bg-neutral-400 mx-auto' />
            </div>
          })}
        </div>
      }
      {/* this input could be used to send selected pokemons to the server */}
      <input type="hidden" id='pokemons' name="pokemons" value={JSON.stringify(selectedPokemons)} />
    </div>
  )
}