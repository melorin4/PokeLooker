import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Feed from "../components/Feed";
import LoadingScreen from "../components/LoadingScreen";

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
  const [noResults, setNoResults] = useState(false);

  // Fetch all pokemons on mount (just names + urls)
  useEffect(() => {
    async function fetchAllPokemons() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
        const data = await res.json();
        setAllPokemons(data.results);
      } catch (error) {
        console.error("Failed to fetch all pokemons", error);
      }
    }
    fetchAllPokemons();
  }, []);

  // Fetch paginated pokemons for normal display
  useEffect(() => {
    async function fetchPaginated() {
      setLoading(true);
      setNoResults(false);
      try {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=48&offset=${offSet}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        setPaginatedPokemons(data.results);
      } catch (error) {
        console.error("Failed to fetch paginated pokemons", error);
        setPaginatedPokemons([]);
      }
      setLoading(false);
    }

    if (query.trim() === "") {
      fetchPaginated();
    }
  }, [offSet, query]);

  // Filter locally for partial matches when query changes
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredPokemons([]);
      setNoResults(false);
      return;
    }

    const filtered = allPokemons.filter((poke) =>
      poke.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredPokemons(filtered);
    setNoResults(filtered.length === 0);
  }, [query, allPokemons]);

  // Decide which list to show
  const displayPokemons = query.trim() === "" ? paginatedPokemons : filteredPokemons;

  return (
    <div className="Home maxWidth">
      <Header query={query} setQuery={setQuery} />
      {loading && <LoadingScreen />}
      {!loading && noResults && <p>No Pokémon found for "{query}"</p>}
      {!loading && !noResults && (
        <>
          <Feed pokemons={displayPokemons} />
          {query.trim() === "" && (
            <div className="pagination">
              <button className="btn" onClick={() => {
                const newOffSet = offSet <= 50 ? 0 : offSet - 50;
                setOffSet(newOffSet);
                sessionStorage.setItem("offset", newOffSet.toString());
              }}>
                Prev
              </button>
              <button className="btn" onClick={() => {
                const newOffSet = offSet + 50;
                setOffSet(newOffSet);
                sessionStorage.setItem("offset", newOffSet.toString());
              }}>
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
