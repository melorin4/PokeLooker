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
  const [pageInput, setPageInput] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const ITEMS_PER_PAGE = 50;

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
        const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offSet}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        setPaginatedPokemons(data.results);
        setTotalCount(data.count);
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

  // Pagination calculations
  const currentPage = Math.floor(offSet / ITEMS_PER_PAGE) + 1;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const isFirstPage = offSet === 0;
  const isLastPage = offSet + ITEMS_PER_PAGE >= totalCount;

  // Pagination handlers
  const goToPage = (pageNumber) => {
    const newOffSet = (pageNumber - 1) * ITEMS_PER_PAGE;
    setOffSet(newOffSet);
    sessionStorage.setItem("offset", newOffSet.toString());
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      goToPage(pageNumber);
      setPageInput("");
    } else {
      alert(`Please enter a page number between 1 and ${totalPages}`);
    }
  };

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
              <div className="pagination-controls">
                <button 
                  className="btn pagination-btn" 
                  onClick={goToFirstPage}
                  disabled={isFirstPage}
                  title="First Page"
                >
                  ⏮️
                </button>
                <button 
                  className="btn pagination-btn" 
                  onClick={goToPrevPage}
                  disabled={isFirstPage}
                  title="Previous Page"
                >
                  ⬅️
                </button>
                
                <div className="page-info">
                  <span>Page {currentPage} of {totalPages}</span>
                  <form onSubmit={handlePageInputSubmit} className="page-input-form">
                    <input
                      type="number"
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      placeholder="Go to page..."
                      min="1"
                      max={totalPages}
                      className="page-input"
                    />
                    <button type="submit" className="btn go-btn">Go</button>
                  </form>
                </div>

                <button 
                  className="btn pagination-btn" 
                  onClick={goToNextPage}
                  disabled={isLastPage}
                  title="Next Page"
                >
                  ➡️
                </button>
                <button 
                  className="btn pagination-btn" 
                  onClick={goToLastPage}
                  disabled={isLastPage}
                  title="Last Page"
                >
                  ⏭️
                </button>
              </div>
              
              <div className="pagination-info">
                <span>Showing {offSet + 1}-{Math.min(offSet + ITEMS_PER_PAGE, totalCount)} of {totalCount} Pokémon</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
