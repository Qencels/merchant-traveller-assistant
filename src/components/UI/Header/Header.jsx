import React from 'react'
import './Header.css'

//<span onClick={() => props.getMode(3)} className='item' style={{textDecoration: 'line-through'}}>Add a new entry</span>

export default function Header(props) {
  return (

    <header>

      <div className='content'>

        <div className='nav'>
          <span onClick={() => props.getMode(0)} className='item'>Goods</span>
          <span onClick={() => props.getMode(1)} className='item'>Planets</span>
          <span onClick={() => props.getMode(2)} className='item'>Routes</span>
        </div>

      </div>

    </header>

  )
}


