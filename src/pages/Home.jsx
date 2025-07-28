import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import Feed from "../components/Feed";
import LoadingScreen from "../components/LoadingScreen";
import Pagination from "../components/Pagination";

const Home = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [paginatedPokemons, setPaginatedPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [offSet, setOffSet] = useState(() => {
    const storedOffSet = sessionStorage.getItem("offset");
    return storedOffSet ? parseInt(storedOffSet, 10) : 0;
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const ITEMS_PER_PAGE = 10;

  // Fetch all pokemons on mount (just names + urls)
  useEffect(() => {
    async function fetchAllPokemons() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await res.json();
        setAllPokemons(data.results);
      } catch (error) {
        console.error("Failed to fetch all pokemons", error);
      }
    }
    fetchAllPokemons();
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); 

    return () => clearTimeout(timer);
  }, [query]);

  
  useEffect(() => {
    if (debouncedQuery.trim() === "" && allPokemons.length > 0) {
      setLoading(true);
      setNoResults(false);
      
      
      const startIndex = offSet;
      const endIndex = offSet + ITEMS_PER_PAGE;
      const paginatedData = allPokemons.slice(startIndex, endIndex);
      
      setPaginatedPokemons(paginatedData);
      setTotalCount(1025); 
      setLoading(false);
    }
  }, [offSet, debouncedQuery, allPokemons]);


  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setFilteredPokemons([]);
      setNoResults(false);
      return;
    }

    const filtered = allPokemons.filter((poke) =>
      poke.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    setFilteredPokemons(filtered);
    setNoResults(filtered.length === 0);
  }, [debouncedQuery, allPokemons]);

  const displayPokemons = debouncedQuery.trim() === "" ? paginatedPokemons : filteredPokemons;


  const currentPage = Math.floor(offSet / ITEMS_PER_PAGE) + 1;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startItem = offSet + 1;
  const endItem = Math.min(offSet + ITEMS_PER_PAGE, totalCount);

  // Pagination handler
  const goToPage = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    const newOffSet = (newPage - 1) * ITEMS_PER_PAGE;
    setOffSet(newOffSet);
    sessionStorage.setItem("offset", newOffSet.toString());
  };

  return (
    <div className="Home maxWidth">
      <Header query={query} setQuery={setQuery} />
      {loading && <LoadingScreen />}
      {!loading && noResults && <p>No Pokémon found for "{debouncedQuery}"</p>}
      {!loading && !noResults && (
        <>
          <Feed pokemons={displayPokemons} />
          {debouncedQuery.trim() === "" && totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              itemsPerPage={ITEMS_PER_PAGE}
              startItem={startItem}
              endItem={endItem}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;
