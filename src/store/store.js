import { configureStore } from '@reduxjs/toolkit'
import pokemonSlice from './pokemonSlice'
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage'

// Load any existing cache from localStorage
const preloadedState = loadFromLocalStorage()

// This is your main storage box with persistent caching
export const store = configureStore({
  reducer: {
    pokemon: pokemonSlice, // The "pokemon drawer" in your storage box
  },
  preloadedState, // Start with cached data if available
})

// Save to localStorage whenever the store changes
store.subscribe(() => {
  saveToLocalStorage(store.getState())
})

export default store
