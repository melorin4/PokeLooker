import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from './ErrorScreen';
import Button from '../components/Button';
import Stats from '../components/Stats';
import { Link } from 'react-router-dom';
import "../css/SearchedPokemon.css"

const SearchedPokemon = () => {
  const { pokemon } = useParams();
  
  const [pokemonData, setPokemonData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //claude did this part, need to review
  // Helper functions to get species data
  const getGenus = () => {
    if (!speciesData?.genera) return 'Pokemon';
    const englishGenus = speciesData.genera.find(g => g.language.name === 'en');
    return englishGenus?.genus || 'Pokemon';
  };

  const getDescription = () => {
    if (!speciesData?.flavor_text_entries) return 'No description available.';
    const englishText = speciesData.flavor_text_entries.find(f => f.language.name === 'en');
    if (!englishText?.flavor_text) return 'No description available.';
    return englishText.flavor_text.replace(/\f/g, ' ');
  };
 //https://pokeapi.co/docs/v2#evolution-section
  // Helper function to process evolution chain
  const getEvolutionChain = () => {
    if (!evolutionChain?.chain) return [];
    
    const evolutions = [];
    let currentEvolution = evolutionChain.chain;
    
    // Process the evolution chain recursively
    const processEvolution = (evolution) => {
      const pokemonId = evolution.species.url.split('/').slice(-2, -1)[0];
      evolutions.push({
        name: evolution.species.name,
        id: pokemonId,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`
      });
      
      // Process next evolutions
      evolution.evolves_to.forEach(nextEvolution => {
        processEvolution(nextEvolution);
      });
    };
    
    processEvolution(currentEvolution);
    return evolutions;
  };

  const [activeTab, setActiveTab] = useState('overview');
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
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching ${pokemon} from API...`);
        
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const data = response.data;
        
        setPokemonData(data);
        setStats({
          height: (data.height / 3.048).toFixed(1),
          weight: (data.weight / 10).toFixed(1),
          exp: data.base_experience,
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defence: data.stats[2].base_stat,
          splAttack: data.stats[3].base_stat,
          splDefence: data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
        });

        const speciesResponse = await axios.get(data.species.url);
        const speciesData = speciesResponse.data;
        setSpeciesData(speciesData);

        const evolutionChainResponse = await axios.get(speciesData.evolution_chain.url);
        const evolutionChainData = evolutionChainResponse.data;
        setEvolutionChain(evolutionChainData);
      } catch (err) {
        console.error('Error fetching Pokemon:', err);
        setError('Failed to fetch Pokemon data');
      } finally {
        setLoading(false);
      }
    };

    if (pokemon) {
      fetchPokemonData();
    }
  }, [pokemon]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!pokemonData) return <LoadingScreen />; 

  const renderTabContent = () => {
    switch(activeTab){
      case 'overview':
        // Get species data using helper functions
        const genus = getGenus();
        const description = getDescription();
        
        return (
          <div className="overview-content">
            <div className="pokemon-description">
              <h3>{genus}</h3>
              <p>{description}</p>
            </div>
            <div className="pokemon-measurements">
              <div className="measurement-item">
                <span className="measurement-label">Weight</span>
                <span className="measurement-value">{stats.weight} kg</span>
              </div>
              <div className="measurement-item">
                <span className="measurement-label">Height</span>
                <span className="measurement-value">{stats.height} m</span>
              </div>
            </div>
          </div>
        )
        case 'stats':
          return <Stats stats={stats}/>;
        case 'evolution':
          const evolutions = getEvolutionChain();
          return (
            <div className="evolution-content">
              {evolutions.map((evolution, index) => (
                <div key={index} className="evolution-item">
                  <img src={evolution.image} alt={evolution.name} />
                  <span>{evolution.name}</span>
                </div>
              ))}
            </div>
          )

        
        default:
          return null;
    }
  }

  return (
    <div className="searched-pokemon maxWidth">
      <div className="searched-pokemon-header">
        <Link to={"/"}>
          <Button label="Back" />
        </Link>
      </div>

      <div className="pokemon-details">
        <div className="searched-pokemon-info">
          <h4>{pokemonData.name}</h4>
          <div className="type">
            {pokemonData.types.map((type, index) => (
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

          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={()=> setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-button ${activeTab === 'stats'? 'active': ''}`}
              onClick={()=> setActiveTab('stats')}
            >
              Stats
            </button>

            <button
              className={`tab-button ${activeTab === 'evolution'? 'active': ''}`}
              onClick={()=> setActiveTab('evolution')}
            >
              evolution
            </button>
            
          </div>
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>

        <div className="previewImage">
          <img
            src={pokemonData.sprites.other.home.front_default}
            alt={pokemonData.name}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchedPokemon;
