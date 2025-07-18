import React from 'react';

const Card=({data})=> {
    console.log(data)
    //for imgs

    //16.58
    return (

            <div classname="card">
                <img src="https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/1.png?raw=true" alt="Bulbasaur" />
                <div className="text">
                    <h4 className="name">
                        <span className="pokeId">#01 </span>
                        Bulbasaur
                    </h4>
                </div>
            </div>

    );
}

export default Card;