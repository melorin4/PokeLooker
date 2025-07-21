import React from 'react';
import  "../css/Feed.css"
const Card=({data})=> {
    console.log(data)
    //for imgs

    const urlParts = data.url.split("/");
    const pokeId = urlParts[urlParts.length -2]
    const frontImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`
    const backImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokeId}.png
`
    return (
    <div className="card">
      <div className="card-inner">
        <div className="card-front">
          <img src={frontImgUrl} alt={data.name} />
          <div className="text">
            <h4 className="name">
              <span className="pokeId">#{pokeId}</span> {data.name}
            </h4>
          </div>
        </div>
        <div className="card-back">
            <img src={backImgUrl} alt={data.name} />
            <div className="text">
            <p>Weight:</p>
            <p>Height:</p>
            <h4 className="name">
              <span className="pokeId">#{pokeId}</span> {data.name}
            </h4>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Card;