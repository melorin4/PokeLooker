import React from 'react'
import logo from '../assets/logo.svg'
import '../css/Header.css';
import Button from './Button'

const Header = () => {
  return(
        <header>
            <nav>
                <img src={logo} alt="logo" />
                <span classname='logo-text'>PokeLooker</span>
                <div className="search-container">
                    <input type="text" placeholder="Search by name or id"/>
                    <Button Label={"Search"}/>
                </div>
            </nav>
        </header>
  )
}

export default Header