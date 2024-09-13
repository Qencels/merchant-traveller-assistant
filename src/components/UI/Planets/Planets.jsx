import styles from './Planets.module.css'
import { EXPLORED_PLANETS, PLANETS_ATMOSPHERE, PLANETS_GOVERNMENT, PLANETS_HYDROGRAPHICS, PLANETS_LAW, PLANETS_POPULATION, PLANETS_SIZE } from '../../../Constants';
import rp1 from '../../../assets/random-planet-1.png'
import rp2 from '../../../assets/random-planet-2.png'
import rp3 from '../../../assets/random-planet-3.png'
import rp4 from '../../../assets/random-planet-4.png'
import rp5 from '../../../assets/random-planet-5.png'
import rp6 from '../../../assets/random-planet-6.png'
import astrs from '../../../assets/asteroids.png'
import toGoods from '../../../assets/to-goods-btn-ico.png'
import addNode from '../../../assets/add-route-node-btn-ico.png'
import search from '../../../assets/search-ico.png'
import React, { useState } from 'react'
import { debounce } from 'lodash'
import classNames from 'classnames';

const planetsImg = [rp1, rp2, rp3, rp4, rp5, rp6, astrs];
const CARDS_ON_PAGE = 6;

export default function Planets(props) {

  const [page, setPage] = useState(0);
  let planets = EXPLORED_PLANETS.slice((page * CARDS_ON_PAGE), (page * CARDS_ON_PAGE + CARDS_ON_PAGE));

  const findPlanet = (planetName) => {
    const findedPlanet = EXPLORED_PLANETS.find(item => item.name.toUpperCase().includes(planetName.trim().toUpperCase()));
    if (!findedPlanet) return;

    const fpID = findedPlanet.id;
    const itemsPage = Math.floor(fpID / CARDS_ON_PAGE);
    pageChange(itemsPage, setPage);
  }

  const debouncedSearch = debounce(findPlanet, 300);

  if (props.mode !== 1) return (<div></div>);

  return (
    <div className={styles.planetsWrapper}>

      <div className={styles.planetsSearchBarWrapper}>
        <div className={styles.planetsSearchBarLogo}>
          <img src={search} alt="search"/>
        </div>

        <div className={styles.planetsSearchBarInput}>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type='search' placeholder='Planet name...' autoFocus={true}
              onChange={(e) => debouncedSearch(e.target.value)}></input>
          </form>
        </div>
      </div>
      
      <div className={styles.planetsCardWrapper}>
        { planets.map((item) => (

          <div className={styles.planetCard} key={`pc-${item.id}`}>
            <div className={styles.planetCardTitle} key={`${item.id}-name`}>{item.name} ({item.planetCode.split(',').slice(0,8)})</div>

            <div className={styles.planetCardInfo} key={`pi-${item.id}`}>

              <div className={styles.planetInfoLogo} key={`pi-${item.id}-logo`}>

                <div className={styles.addRouteNodeBtn} key={`${item.id}-add-route-node-btn`}>
                  <img src={addNode} alt='addNode' key={`${item.id}-add-route-node-btn-ico`} 
                      title='Add a path node' onClick={(e) => {

                          props.changeNode(item.id);
                          if (e.target['isSelectedForRoute'] !== true) {
                            e.target.style['box-shadow'] = '3px 3px 9px rgb(162, 130, 91)';
                            e.target['isSelectedForRoute'] = true;
                          } else {
                            e.target.style['box-shadow'] = '1px 1px 3px rgb(0, 0, 0)';
                            e.target['isSelectedForRoute'] = false;
                          }
                          
                        }} />
                </div>

                {/* The ingenious formula below gives a picture of an asteroid only when the planet size is 0. It's funny, don't be so critical */}
                <img src={planetsImg.at((parseInt(item.planetCode[2], 16) - 1) % (planetsImg.length - 1))} alt='planet' key={`${item.id}-logo`} />

                <div className={styles.toGoodsBtn} key={`${item.id}-to-goods-btn`}>
                  <img src={toGoods} alt='toGoods' key={`${item.id}-to-goods-btn-ico`} 
                    title='To goods' onClick={() => props.setCurrentPlanet(item.planetCode, item.flags)} />
                </div>

              </div>

              <div className={styles.planetInfoText} key={`pi-${item.id}-text`}>
                <ul>
                  <li key={`${item.id}-sectorId`}>Sector ID: {item.sectorID}</li>

                  <li key={`${item.id}-spaceport`}>Spaceport: {item.planetCode[0]}</li>

                  <li key={`${item.id}-size`}>{PLANETS_SIZE.at(parseInt(item.planetCode[2], 16))}</li>

                  <li key={`${item.id}-atmosphere`}>{PLANETS_ATMOSPHERE.at(parseInt(item.planetCode[4], 16))}</li>

                  <li key={`${item.id}-water`}>{PLANETS_HYDROGRAPHICS.at(parseInt(item.planetCode[6], 16))}</li>

                  <li key={`${item.id}-population`}>{PLANETS_POPULATION.at(parseInt(item.planetCode[8], 16))}</li>

                  <li key={`${item.id}-government`}>{PLANETS_GOVERNMENT.at(parseInt(item.planetCode[10], 16))}</li>

                  <li key={`${item.id}-law`}>{`${PLANETS_LAW.at(parseInt(item.planetCode[12], 16))} 
                    (Law level: ${parseInt(item.planetCode[12], 16)})`}</li>

                  <li key={`${item.id}-tech`}>Tech Level: {parseInt(item.planetCode[14], 16)}</li>

                  <li key={`${item.id}-trade`}>Trade Codes: {item.flags}</li>
                </ul>
              </div>

            </div>

          </div>

        )) }
      </div>

      <div className={styles.pageBtns}>
        <button className={classNames(styles.prevBtn, styles.pageBtn)} onClick={() => pageChange(page - 1, setPage)}>{'<'}</button>
        <div className={styles.pageStatus}>
          <p>{page + 1}</p>
        </div>
        <button className={classNames(styles.nextBtn, styles.pageBtn)} onClick={() => pageChange(page + 1, setPage)}>{'>'}</button>
      </div>

    </div>
  )
}

function pageChange(newPage, pageChangeFn) {
  if (newPage < 0 || newPage * CARDS_ON_PAGE >= EXPLORED_PLANETS.length) return;
  pageChangeFn(newPage);
}