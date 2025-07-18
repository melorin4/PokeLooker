import React, {useEffect, useState} from 'react'
import Header from '../components/header'
import Feed from '../components/Feed'
const Home = () => {
  const[pokemons, setPokemons] = useState([]);
  const[offSet, setOffSet] = useState(()=>{
    const storedOffSet = sessionStorage.getItem("offset");
    return storedOffSet ? parseInt(storedOffSet,10):0;
  });
  
  useEffect(()=>{
    async function fetchPokemon() {
      const apiUrl=`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offSet}`
      
      const res = await fetch(apiUrl);
      const data = await res.json();

      setPokemons(data.results);
    }
    fetchPokemon()
  }, [offSet]);
  
  
  return(
    <div className='Home maxWidth'>
        <Header />
        <Feed pokemons={pokemons}/>
        <div className="pagination">
          <button classname="btn">Prev</button>
          <button classname="btn">Next</button>
        </div>
    </div>
  )
}

export default Home