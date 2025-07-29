import React from 'react';
import "../css/Feed.css";

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
};

const Card = ({ data }) => {

  let pokeId;
  if (data.url) {
    const urlParts = data.url.split("/");
    pokeId = urlParts[urlParts.length - 2];
  } else if (data.id) {
    pokeId = data.id;
  } else {
    //nothing
    return <div>Loading...</div>;
  }

  const frontImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;
  const backImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokeId}.png`;

  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-front">
          <img src={frontImgUrl} alt={data.name} />
          <div className="text">
            <h4 className="name">
              <span className="pokeId">#{pokeId}</span> {data.name}
            </h4>
            <div className="type">
              {data.types?.map((typeObj, index) => (
                <span
                  key={index}
                  style={{ backgroundColor: colours[typeObj.type.name] }}
                  className="type-badge"
                >
                  {typeObj.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card-back">
          <img src={backImgUrl} alt={data.name} />
          <div className="text">
            <h4 className="name">
              <span className="pokeId">#{pokeId}</span> {data.name}
            </h4>
            <div className="type">
              {data.types?.map((typeObj, index) => (
                <span
                  key={index}
                  style={{ backgroundColor: colours[typeObj.type.name] }}
                  className="type-badge"
                >
                  {typeObj.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
