import React from 'react'
import './Goods.css'

export default function Goods(props) {

    if (props.mode !== 0) return (<div></div>);
    const availableGoods = props.goods;

    const getStringFromDMs = (DMobj) => {
        let result = '';
        for (let i in DMobj) {
            result += `${i}: ${DMobj[i]} `;
        }
        return result;
    }

    let additionalMod = '';
    const searchMod = (13 - parseInt(props.pcode[0], 16)) * 2;
    const popMod = parseInt(props.pcode[8], 16);

    if (searchMod <= 6 && searchMod >= 2) {
        additionalMod += `Additional modifiers: +${searchMod} to finding a supplier`;
        if (popMod >= 9) {
            additionalMod += `, +3 to the roll for quantity`;
        } else if (popMod <= 3) {
            additionalMod += `, -3 to the roll for quantity`;
        }
    }

    return (
        <div className='table-wrapper'>
            <div className='info-header'>
                <div className="flags">
                    <span>{`Planet's trade codes (Gz,Az,Rz - zones, all - default): ${props.codes}`}</span>
                    <p>{`${additionalMod}`}</p>
                </div>

                <div className="sort-btns">
                    <form>
                        <span>Sorting by: </span>
                        <input id='off-btn' 
                            type='radio' 
                            name='sb' 
                            value='off'
                            onChange={e => props.getSortType(e.target.value)} 
                            defaultChecked
                        />
                        <label htmlFor='off-btn'>off</label>


                        <input id='sale-btn' 
                            type='radio' 
                            name='sb' 
                            value='best-to-sell'
                            onChange={e => props.getSortType(e.target.value)}
                        />
                        <label htmlFor='sale-btn'>best-selling</label>  

                        <input id='buy-btn' 
                            type='radio' 
                            name='sb' 
                            value='best-to-buy'
                            onChange={e => props.getSortType(e.target.value)}
                        />
                        <label htmlFor='buy-btn'>most-bought</label>  
                    </form>
                </div>
            </div>
            <hr></hr>
            <table cellSpacing={'10px'} className='all-goods'>
                <thead>
                    <tr key={`tr-head`}>
                        <th key={'th-id'}>ID</th>
                        <th key={'th-type'}>Type</th>
                        <th key={'th-availability'}>Availability</th>
                        <th key={'th-tons'}>Tons</th>
                        <th key={'th-bp'}>Base Price</th>
                        <th key={'th-purchase'}>Purchase DM</th>
                        <th key={'th-sale'}>Sale DM</th>
                    </tr>
                </thead>
                <tbody>
                { availableGoods.map(
                    (item) => (<tr className='product' key={`tr-body-${item.id}`}>
                        <td className='id' key={`td-id-${item.id}`} >{item.id}</td>
                        <td className='type' key={`td-type-${item.id}`} >{item.type}</td>
                        <td className='availability' key={`td-availability-${item.id}`} >{item.availability}</td>
                        <td className='tons' key={`td-tons-${item.id}`} >{item.tons}</td>
                        <td className='bp' key={`td-bp-${item.id}`} >{item.bp}</td>
                        <td className='pdm' key={`td-pdm-${item.id}`} >{getStringFromDMs(item.pdm)}</td>
                        <td className='sdm' key={`td-sdm-${item.id}`} >{getStringFromDMs(item.sdm)}</td>
                    </tr>)
                ) }
                </tbody>
            </table>
        </div>
    )
}
