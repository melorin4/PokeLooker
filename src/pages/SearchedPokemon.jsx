import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from './ErrorScreen';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const SearchedPokemon = () => {
  const { pokemon } = useParams();
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  console.log("useParams pokemon:", pokemon);

  useEffect(() => {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    async function fetchPokemon() {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error occurred!");
        const data = await response.json();
        setSelectedPokemon(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    }

    fetchPokemon();
  }, [pokemon]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  return (
    <div className="searched-pokemon">
      <div className="searched-pokemon-header">
        <Link to={"/"}>

          <Button Label="Back" />
        </Link>
      </div>

      {selectedPokemon && (
        <div>
          <h1>{selectedPokemon.name}</h1>
          <img
            src={selectedPokemon.sprites.front_default}
            alt={selectedPokemon.name}
          />
          <p>Height: {selectedPokemon.height}</p>
          <p>Weight: {selectedPokemon.weight}</p>

        </div>
      )}
    </div>
  );
};

export default SearchedPokemon;
