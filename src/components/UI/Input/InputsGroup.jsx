import React, { useState } from 'react'
import SingleInput from './SingleInput'

export default function InputsGroup(props) {

    let [fullCode, setCode] = useState(['-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', 'G']);

    if (props.mode !== 0) return (<div></div>);

    const filter = [
        '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E',
        'F', 'X', 'G', 'R'
    ];

    if (props.substFlag) {
        fullCode = props.value.split(',');
    }

    const setZoneType = (zoneType) => {
        fullCode[8] = zoneType;
    }

    const setSymbol = (symbol, index) => {
        fullCode[index] = symbol.toUpperCase();
    }

    const setFocus = (e, index) => {
        let k = 0;
        if (e.target.value === ' ' || e.target.value === '') {
            if (index !== 0) k -= 1;
        } else if (index < 7) k += 1;

        let obj = document.getElementById('si-' + (index + k));
        obj.focus();
    }

    const changeEventFunction = (e, index) => {
        if (index <= 7) {
            setSymbol(e.target.value, index);
            setFocus(e, index);
        } else {
            setZoneType(e.target.value);
        }
        
        for (let i = 0; i < fullCode.length; i++) {
            if (!filter.includes(fullCode[i])) {
                return;
            }
        }
        setCode(fullCode);
        sendCode();
    }

    const sendCode = () => {
        props.getCode(fullCode.toString());
    }

    return (
        <form className='inputs-group'>
            <div className='inputs'>
                <SingleInput id='si-0' autoFocus={true} onChange={e => changeEventFunction(e, 0)} placeholder='A'/>
                <SingleInput id='si-1' onChange={e => changeEventFunction(e, 1)} placeholder='0'/>
                <SingleInput id='si-2' onChange={e => changeEventFunction(e, 2)} placeholder='0'/>
                <SingleInput id='si-3' onChange={e => changeEventFunction(e, 3)} placeholder='0'/>
                <SingleInput id='si-4' onChange={e => changeEventFunction(e, 4)} placeholder='0'/>
                <SingleInput id='si-5' onChange={e => changeEventFunction(e, 5)} placeholder='0'/>
                <SingleInput id='si-6' onChange={e => changeEventFunction(e, 6)} placeholder='0'/>
                <SingleInput id='si-7' onChange={e => changeEventFunction(e, 7)} placeholder='0'/>
            </div>
            <div className='zone-btns'>
                <div className='zone'>
                    <input id='green-zone' 
                        type='radio' 
                        name='zs' 
                        value='G'
                        onChange={e => changeEventFunction(e, 8)} 
                        defaultChecked={true}
                    />
                    <label htmlFor='green-zone'>Green zone (default)</label>
                </div>
                <div className='zone'>
                    <input id='amber-zone' 
                        type='radio' 
                        name='zs' 
                        value='A'
                        onChange={e => changeEventFunction(e, 8)}
                    />
                    <label htmlFor='amber-zone'>Amber zone</label>  
                </div>
                <div className='zone'>
                    <input id='red-zone' 
                        type='radio' 
                        name='zs' 
                        value='R'
                        onChange={e => changeEventFunction(e, 8)}
                    />
                    <label htmlFor='red-zone'>Red zone</label>  
                </div>   
            </div> 
        </form>
    )
}
