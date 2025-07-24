import React, { useEffect, useState } from 'react';
import "../css/Feed.css";
import Card from './Card';
import { Link } from "react-router-dom";

const Feed = ({ pokemons }) => {
  const [detailedPokemons, setDetailedPokemons] = useState([]);

  useEffect(() => {
    async function fetchDetails() {
      const details = await Promise.all(
        pokemons.map(async (poke) => {
          const res = await fetch(poke.url);
          return res.json();
        })
      );
      setDetailedPokemons(details);
    }
    fetchDetails();
  }, [pokemons]);

  if (detailedPokemons.length === 0) return <p>Loading Pokémon details...</p>;

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
