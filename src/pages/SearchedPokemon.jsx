import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { fetchPokemon, selectPokemonByName, selectLoading, selectError } from '../store/pokemonSlice'; 
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from './ErrorScreen';
import Button from '../components/Button';
import Stats from '../components/Stats';
import { Link } from 'react-router-dom';
import "../css/SearchedPokemon.css"

const SearchedPokemon = () => {
  const { pokemon } = useParams();
  const dispatch = useDispatch(); 
  
  const selectedPokemon = useSelector(state => selectPokemonByName(state, pokemon));
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  
  const [stats, setStats] = useState({
    height: 0,
    weight: 0,
    exp: 0,
    hp: 0,
    attack: 0,
    defence: 0,
    splAttack: 0,
    splDefence: 0,
    speed: 0,
  });

  console.log("useParams pokemon:", pokemon);

  //colours
  const colours = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  }

  useEffect(() => {
    if (selectedPokemon) {
      console.log(` Found ${pokemon} in cache! No API call needed.`);
      setStats({
        height: (selectedPokemon.height / 3.048).toFixed(1),
        weight: (selectedPokemon.weight / 10).toFixed(1),
        exp: selectedPokemon.base_experience,
        hp: selectedPokemon.stats[0].base_stat,
        attack: selectedPokemon.stats[1].base_stat,
        defence: selectedPokemon.stats[2].base_stat,
        splAttack: selectedPokemon.stats[3].base_stat,
        splDefence: selectedPokemon.stats[4].base_stat,
        speed: selectedPokemon.stats[5].base_stat,
      });
    } else {
      console.log(` ${pokemon} not in cache, fetching from API...`);
      dispatch(fetchPokemon(pokemon));
    }
  }, [pokemon, selectedPokemon, dispatch]);

  useEffect(() => {
    if (selectedPokemon) {
      setStats({
        height: (selectedPokemon.height / 3.048).toFixed(1),
        weight: (selectedPokemon.weight / 10).toFixed(1),
        exp: selectedPokemon.base_experience,
        hp: selectedPokemon.stats[0].base_stat,
        attack: selectedPokemon.stats[1].base_stat,
        defence: selectedPokemon.stats[2].base_stat,
        splAttack: selectedPokemon.stats[3].base_stat,
        splDefence: selectedPokemon.stats[4].base_stat,
        speed: selectedPokemon.stats[5].base_stat,
      });
    }
  }, [selectedPokemon]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!selectedPokemon) return <LoadingScreen />; 

  return (
    <div className="searched-pokemon maxWidth">
      <div className="searched-pokemon-header">
        <Link to={"/"}>
          <Button label="Back" />
        </Link>
      </div>

      <div className="pokemon-details">
        <div className="searched-pokemon-info">
          <h4>{selectedPokemon.name}</h4>
          <div className="type">
            {selectedPokemon.types.map((type, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: colours[type.type.name],
                  padding: "0.3rem 0.8rem",
                  color: "white",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  minWidth: "60px",
                  textAlign: "center",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                  userSelect: "none",
                  cursor: "default",
                  transition: "background-color 0.3s ease",
                }}
              >
                {type.type.name}
              </span>
            ))}
          </div>
          <Stats stats={stats} />
        </div>

        <div className="previewImage">
          <img
            src={selectedPokemon.sprites.other.home.front_default}
            alt={selectedPokemon.name}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchedPokemon;
