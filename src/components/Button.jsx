import React from 'react'

const Button = ({Label, onclick}) => {
  return(
    <button onClick={onclick} className="btn">
        {Label}
    </button>
  )
}

export default Button