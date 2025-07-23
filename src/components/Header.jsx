import React from "react";
import logo from "../assets/logo.svg";
import Button from "./Button";
import "../css/Header.css";
import { Link } from "react-router-dom";

const Header = ({ query, setQuery }) => {
  return (
    <header>
      <nav className="maxWidth">
        <img src={logo} alt="logo" />
        <span className="logo-text">PokeLooker</span>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or id"
            value={query}
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
          <Link to={`/${query}`}>
            <Button label={"Search"} />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
