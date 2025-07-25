import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// This fetches individual Pokemon data
export const fetchPokemon = createAsyncThunk(
  'pokemon/fetchPokemon',
  async (pokemonName) => {
    // Check if we're fetching by name or URL
    const url = pokemonName.startsWith('http') 
      ? pokemonName 
      : `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
    
    const response = await axios.get(url)
    return response.data
  }
)

// This fetches the Pokemon list for your home page
export const fetchPokemonList = createAsyncThunk(
  'pokemon/fetchPokemonList',
  async ({ limit = 1000, offset = 0 } = {}) => {
    console.log(`🌐 Fetching Pokemon list (limit: ${limit}, offset: ${offset})...`)
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    return response.data
  }
)

// This is your "Pokemon drawer" - it stores all Pokemon data
const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState: {
    // This is like different compartments in your drawer
    cachedPokemon: {}, // Stores individual Pokemon data by name/id
    pokemonList: [], // Stores the list of all Pokemon
    pokemonListMeta: { // Metadata about the Pokemon list
      count: 0,
      next: null,
      previous: null,
      lastFetched: null, // When we last fetched the list
    },
    loading: false, // Shows if we're currently fetching individual Pokemon
    listLoading: false, // Shows if we're currently fetching the Pokemon list
    error: null, // Stores any errors that happen
  },
  reducers: {
    // These are actions you can call to update the data
    clearError: (state) => {
      state.error = null
    },
    clearCache: (state) => {
      // Clear all cached data (useful for debugging)
      state.cachedPokemon = {}
      state.pokemonList = []
      state.pokemonListMeta = {
        count: 0,
        next: null,
        previous: null,
        lastFetched: null,
      }
      console.log('🗑️ Cleared all Pokemon cache')
    },
  },
  extraReducers: (builder) => {
    // Handle individual Pokemon fetching
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.loading = false
        // Save the Pokemon data to cache using its name as the key
        const pokemon = action.payload
        state.cachedPokemon[pokemon.name] = pokemon
        console.log(`✅ Cached ${pokemon.name}!`)
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      
      // Handle Pokemon list fetching
      .addCase(fetchPokemonList.pending, (state) => {
        state.listLoading = true
        state.error = null
      })
      .addCase(fetchPokemonList.fulfilled, (state, action) => {
        state.listLoading = false
        const { results, count, next, previous } = action.payload
        
        // Save the Pokemon list and metadata
        state.pokemonList = results
        state.pokemonListMeta = {
          count,
          next,
          previous,
          lastFetched: new Date().toISOString(), // Remember when we fetched this
        }
        
        console.log(`✅ Cached Pokemon list with ${results.length} Pokemon!`)
      })
      .addCase(fetchPokemonList.rejected, (state, action) => {
        state.listLoading = false
        state.error = action.error.message
      })
  },
})

// Export actions so components can use them
export const { clearError, clearCache } = pokemonSlice.actions

// Export selectors - these help components get data from the store
export const selectPokemonByName = (state, name) => 
  state.pokemon.cachedPokemon[name?.toLowerCase()]

export const selectPokemonList = (state) => state.pokemon.pokemonList
export const selectPokemonListMeta = (state) => state.pokemon.pokemonListMeta
export const selectLoading = (state) => state.pokemon.loading
export const selectListLoading = (state) => state.pokemon.listLoading
export const selectError = (state) => state.pokemon.error

// Helper selector to check if Pokemon list is fresh (less than 1 hour old)
export const selectIsPokemonListFresh = (state) => {
  const pokemonListMeta = state.pokemon.pokemonListMeta
  if (!pokemonListMeta || !pokemonListMeta.lastFetched) return false
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  return new Date(pokemonListMeta.lastFetched) > oneHourAgo
}

export default pokemonSlice.reducer
