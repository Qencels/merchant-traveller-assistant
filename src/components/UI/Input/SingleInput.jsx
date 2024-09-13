import React from 'react'

export default function SingleInput(props) {
    return (
        <input 
            type='text' 
            maxLength='1' 
            {...props} 
        />
    )
}
