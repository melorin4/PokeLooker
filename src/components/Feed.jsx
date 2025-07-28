import React, { useEffect, useState } from 'react';
import "../css/Feed.css";
import Card from './Card';
import { Link } from "react-router-dom";
// review this whooole page
// Cache for Pokemon details to avoid redundant API requests
const pokemonCache = new Map();

const Feed = ({ pokemons }) => {
  const [detailedPokemons, setDetailedPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      
      const details = await Promise.all(
        pokemons.map(async (poke) => {
          // Check if Pokemon details are already cached
          if (pokemonCache.has(poke.name)) {
            return pokemonCache.get(poke.name);
          }
          
          // Fetch from API if not cached
          try {
            const res = await fetch(poke.url);
            const data = await res.json();
            
            // Store in cache for future use
            pokemonCache.set(poke.name, data);
            return data;
          } catch (error) {
            console.error(`Failed to fetch details for ${poke.name}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any null results from failed requests
      const validDetails = details.filter(detail => detail !== null);
      setDetailedPokemons(validDetails);
      setLoading(false);
    }
    
    if (pokemons.length > 0) {
      fetchDetails();
    } else {
      setDetailedPokemons([]);
      setLoading(false);
    }
  }, [pokemons]);

  if (loading) return <p>Loading Pokémon details...</p>;
  if (detailedPokemons.length === 0) return <p>No Pokémon to display.</p>;

  return (
    <section className='pokemon-feed'>
      {detailedPokemons.map((pokemon) => (
        <Link to={`/${pokemon.name}`} key={pokemon.name}>
          <Card data={pokemon} />
        </Link>
      ))}
    </section>
  );
};

export default Feed;
