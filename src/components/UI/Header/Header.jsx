import React from 'react'
import styles from './Header.module.css'

//<span onClick={() => props.getMode(3)} className='item' style={{textDecoration: 'line-through'}}>Add a new entry</span>

export default function Header(props) {
  return (

    <header>

      <div className={styles.content}>

        <div className={styles.nav}>
          <span onClick={() => props.getMode(0)} className={styles.item}>Goods</span>
          <span onClick={() => props.getMode(1)} className={styles.item}>Planets</span>
          <span onClick={() => props.getMode(2)} className={styles.item}>Routes</span>
        </div>

      </div>

    </header>

  )
}


