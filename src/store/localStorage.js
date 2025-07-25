// This file handles saving and loading Redux state to/from localStorage

const STORAGE_KEY = 'pokeLooker_cache'

// Save Redux state to localStorage
export const saveToLocalStorage = (state) => {
  try {
    // Only save the pokemon data, not loading/error states
    const dataToSave = {
      pokemon: {
        cachedPokemon: state.pokemon.cachedPokemon,
        pokemonList: state.pokemon.pokemonList,
        pokemonListMeta: state.pokemon.pokemonListMeta,
        // Don't save loading/error states - they should reset on refresh
      }
    }
    
    const serializedState = JSON.stringify(dataToSave)
    localStorage.setItem(STORAGE_KEY, serializedState)
    console.log('💾 Saved cache to localStorage!')
  } catch (error) {
    console.warn('Could not save state to localStorage:', error)
  }
}

// Load Redux state from localStorage
export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (serializedState === null) {
      console.log('📭 No cache found in localStorage')
      return undefined // Let Redux use initial state
    }
    
    const loadedState = JSON.parse(serializedState)
    console.log('📂 Loaded cache from localStorage!', {
      cachedPokemon: Object.keys(loadedState.pokemon?.cachedPokemon || {}).length,
      pokemonListLength: loadedState.pokemon?.pokemonList?.length || 0
    })
    
    return loadedState
  } catch (error) {
    console.warn('Could not load state from localStorage:', error)
    return undefined
  }
}

// Clear localStorage cache (useful for debugging)
export const clearCache = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log('🗑️ Cleared cache from localStorage')
}
