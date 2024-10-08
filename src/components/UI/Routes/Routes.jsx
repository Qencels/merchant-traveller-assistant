import React, { useState, useRef } from 'react'
import styles from './Routes.module.css'
import rp1 from '../../../assets/random-planet-1.png'
import rp2 from '../../../assets/random-planet-2.png'
import rp3 from '../../../assets/random-planet-3.png'
import rp4 from '../../../assets/random-planet-4.png'
import rp5 from '../../../assets/random-planet-5.png'
import rp6 from '../../../assets/random-planet-6.png'
import astrs from '../../../assets/asteroids.png'
import arrow from '../../../assets/arrow-ico.png'
import clean from '../../../assets/clean-ico.png'
import { EXPLORED_PLANETS } from '../../../Constants'
import classNames from 'classnames';

const planetsImg = [rp1, rp2, rp3, rp4, rp5, rp6, astrs];

export default function Routes(props) {

    const settingsState = useRef({
        'itemsToVisualize': 6,
        'isIllegal': false,
        'isRebuildNeeded': false,
        'engineTier': 2,
    });

    const [updateStatus, update] = useState(1);

    if (props.mode !== 2) return (<div></div>);

    const routeNodes = Array.from(props.routeSheet.route);

    if (routeNodes.length < 2) return (<div className={styles.errorMsg}>{`Choose at least two planets`}</div>);

    const goods = [];
    const subrouteNames = [];
    for (let item in props.routeSheet) {
        if (item === 'route') continue;
        goods.push(props.routeSheet[item]);
        
        const numberName = item.split('-');
        const subrouteName = `${EXPLORED_PLANETS.at(numberName[0]).name} - ${EXPLORED_PLANETS.at(numberName[1]).name}`;
        subrouteNames.push(subrouteName);
    }

    const getTotalDM = (DMobj, fieldName, subrouteIndex) => {
        let totalDM = 0;
        let index = (fieldName === 'pdm') ? subrouteIndex : subrouteIndex + 1;

        for (let i in DMobj) { if (EXPLORED_PLANETS[routeNodes[index]].flags.split(' ').includes(i)) totalDM += DMobj[i];}

        return totalDM;
    }

    return (
        <div className={styles.routeWrapper}>
            <div className={styles.routeRender}>

                { routeNodes.map((item) => (
                    <div className={styles.routeNode} key={`${item}-node`}>

                        <div className={styles.arrowWrapper} key={`${item}-arrow-wrapper`}>
                            <img className={styles.arrowIco} src={arrow} key={`${item}-arrow`} alt='arrow' />
                        </div>


                        <div className={styles.logoWrapper} key={`${item}-logo-wrapper`}>
                            <img src={planetsImg.at((parseInt(EXPLORED_PLANETS[item].planetCode[2], 16) - 1) % (planetsImg.length - 1))} 
                                alt='planet' key={`${item}-ico`} onClick={() => { props.deleteNode(item); update(updateStatus * -1); }}
                                title='Delete' />

                            <span>{EXPLORED_PLANETS[item].name}</span>
                        </div>

                    </div>
                )) }

                <div className={styles.clearWrapper}>
                    <img className={styles.clearIco} src={clean} alt='clear' title='Clear' 
                        onClick={() => { props.clearRoute(); update(updateStatus * -1); }} />
                </div>

            </div>

            <div className={styles.tablesSettings}>
                <form>
                    <span name='number-label'>Items: </span>
                    <input className={classNames(styles.elem, styles.textbox)} name='number-input' defaultValue={6} type='number' 
                        onChange={(e) => settingsState.current.itemsToVisualize = +e.target.value } 
                            max={10} min={1} maxLength={2} placeholder='1-10' />

                    <span name='illegal-label'>Without illegal </span>
                    <input className={classNames(styles.elem)} type='checkbox' name='illegal-cb'
                        onChange={(e) => settingsState.current.isIllegal = !e.target.checked} />

                    <span style={{textDecoration: 'line-through'}} name='rebuild-label'>Complete the path </span>
                    <input className={classNames(styles.elem)} type='checkbox' name='rebuild-cb'
                        onChange={(e) => settingsState.current.isRebuildNeeded = e.target.checked} />

                    <span style={{textDecoration: 'line-through'}} name='engine-label'>Engine Tier: </span>
                    <input className={classNames(styles.elem, styles.textbox)} name='engine-input' defaultValue={2} type='number' 
                        max={10} min={1} maxLength={1} placeholder='1-10'
                            onChange={(e) => settingsState.current.engineTier = +e.target.value} />

                    <span className={styles.pseudoConfirmBtn} name='pseudo-confirm-btn' 
                        onClick={() => {
                            props.getSettings(settingsState.current); 
                            update(updateStatus * -1); 
                    }}>Confirm</span>
                </form>
            </div>

            <div className={styles.tablesWrapper}>

                { goods.map((item, index) => (
                    <table className={styles.pathSegmentWrapper} key={`${index}-path-segment-wrapper`} cellSpacing={'10px'}>
                        <caption key={`${index}-table-caption`}>{subrouteNames[index]}</caption>
                        <thead key={`${index}-table-thead`}>
                            <tr>
                                <th key={`${index}-th-id`}>ID</th>
                                <th key={`${index}-th-type`}>Type</th>
                                <th key={`${index}-th-tons`}>Tons</th>
                                <th key={`${index}-th-bp`}>Base Price</th>
                                <th key={`${index}-th-pdm`}>Purchase DM</th>
                                <th key={`${index}-th-sdm`}>Sale DM</th>
                            </tr>
                        </thead>
                        <tbody>
                            { item.map(
                                (elem) => (<tr className={styles.product} key={`tr-body-${elem.id}`}>
                                    <td className={styles.id} key={`td-id-${elem.id}`}>{elem.id}</td>
                                    <td className={styles.type} key={`td-type-${elem.id}`}>{elem.type}</td>
                                    <td className={styles.tons} key={`td-tons-${elem.id}`}>{elem.tons}</td>
                                    <td className={styles.bp} key={`td-bp-${elem.id}`}>{elem.bp}</td>
                                    <td className={styles.pdm} key={`td-pdm-${elem.id}`}>{getTotalDM(elem.pdm, 'pdm', index)}</td>
                                    <td className={styles.sdm} key={`td-sdm-${elem.id}`}>{getTotalDM(elem.sdm, 'sdm', index)}</td>
                                </tr>)
                            ) }
                        </tbody>                        
                    </table>
                )) }
            </div>
        </div>
    )
}
