import React from 'react'
import './Input.css'

export default function SingleInput(props) {
    return (
        <input 
            type='text' 
            maxLength='1' 
            {...props} 
        />
    )
}
