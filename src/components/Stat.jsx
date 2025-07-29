import React from 'react'

const Stat = ({parameter,value,units}) => {
    return (
        <div className='stat-item'>
            <span className="stat-label">{parameter}</span>
            <span className="stat-value">
                {value}
                {units && <span className="stat-unit"> {units}</span>}
            </span>
        </div>
    )
}

export default Stat