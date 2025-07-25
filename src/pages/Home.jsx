import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'; 
import { 
  fetchPokemonList, 
  selectPokemonList, 
  selectPokemonListMeta,
  selectListLoading, 
  selectError,
  selectIsPokemonListFresh 
} from '../store/pokemonSlice'; 
import Header from "../components/Header";
import Feed from "../components/Feed";
import LoadingScreen from "../components/LoadingScreen";

const Home = () => {
  const dispatch = useDispatch(); 
  
  const allPokemons = useSelector(selectPokemonList);
  const pokemonListMeta = useSelector(selectPokemonListMeta);
  const listLoading = useSelector(selectListLoading);
  const error = useSelector(selectError);
  const isListFresh = useSelector(selectIsPokemonListFresh);
  
  const [paginatedPokemons, setPaginatedPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [offSet, setOffSet] = useState(() => {
    const storedOffSet = sessionStorage.getItem("offset");
    return storedOffSet ? parseInt(storedOffSet, 10) : 0;
  });
  const [query, setQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (allPokemons.length > 0 && isListFresh) {
      console.log(`✅ Found ${allPokemons.length} Pokemon in cache! No API call needed.`);
      return; 
    }
    
    if (allPokemons.length === 0) {
      console.log('🌐 No Pokemon list in cache, fetching from API...');
    } else {
      console.log('🔄 Pokemon list cache is old (>1 hour), refreshing...');
    }
    
    dispatch(fetchPokemonList({ limit: 1000, offset: 0 }));
  }, [dispatch, allPokemons.length, isListFresh]);

  useEffect(() => {
    if (query.trim() === "" && allPokemons.length > 0) {
      const startIndex = offSet;
      const endIndex = offSet + 48;
      const paginated = allPokemons.slice(startIndex, endIndex);
      setPaginatedPokemons(paginated);
      console.log(`📄 Showing Pokemon ${startIndex + 1}-${Math.min(endIndex, allPokemons.length)} from cache`);
    }
  }, [offSet, query, allPokemons]);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredPokemons([]);
      setNoResults(false);
      return;
    }

    if (allPokemons.length === 0) {
      return;
    }

    const filtered = allPokemons.filter((poke) =>
      poke.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredPokemons(filtered);
    setNoResults(filtered.length === 0);
    console.log(`🔍 Filtered to ${filtered.length} Pokemon matching "${query}"`);
  }, [query, allPokemons]);

  const displayPokemons = query.trim() === "" ? paginatedPokemons : filteredPokemons;
  
  const isLoading = listLoading && allPokemons.length === 0;

  return (
    <div className="Home maxWidth">
      <Header query={query} setQuery={setQuery} />
      
      {allPokemons.length > 0 && (
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#666', 
          textAlign: 'center', 
          marginBottom: '1rem' 
        }}>
        </div>
      )}
      
      {isLoading && <LoadingScreen />}
      
      {!isLoading && noResults && <p>No Pokémon found for "{query}"</p>}
      {!isLoading && !noResults && displayPokemons.length > 0 && (
        <>
          <Feed pokemons={displayPokemons} />
          {query.trim() === "" && (
            <div className="pagination">
              <button 
                className="btn" 
                onClick={() => {
                  const newOffSet = offSet <= 50 ? 0 : offSet - 50;
                  setOffSet(newOffSet);
                  sessionStorage.setItem("offset", newOffSet.toString());
                }}
                disabled={offSet === 0}
              >
                Prev
              </button>
              <span style={{ margin: '0 1rem', fontSize: '0.9rem' }}>
                Page {Math.floor(offSet / 48) + 1}
              </span>
              <button 
                className="btn" 
                onClick={() => {
                  const newOffSet = offSet + 48;
                  setOffSet(newOffSet);
                  sessionStorage.setItem("offset", newOffSet.toString());
                }}
                disabled={offSet + 48 >= allPokemons.length}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
