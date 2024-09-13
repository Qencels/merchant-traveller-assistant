import {useState, useRef} from 'react';
import './App.css';
import Header from './components/UI/Header/Header';
import InputsGroup from './components/UI/Input/InputsGroup';
import PlanetTypesSelector from './components/PlanetTypesSelector/PlanetTypesSelector';
import Goods from './components/UI/Goods/Goods';
import GoodsGetter from './components/GoodsGetter/GoodsGetter'
import Planets from './components/UI/Planets/Planets';
import Routes from './components/UI/Routes/Routes';
import TradePathPlotter from './components/TradePathPlotter/TradePathPlotter';

function App() {

  const vault = useRef({
    'currentPlanetCode': 'A,0,0,0,0,0,0,0,G',
    'planetFlags': ['all', 'Gz'],
    'goods': [],
    'sort': 'off',
    'selectedMode': 1,
    'defaultCodeSubstitution': false,
    'routeSheet': {'route': new Set(), },

    'engineTier': 2,
    'goodsToSearch': 6,
    'isIllegal': true,
    'isRebuildNeeded': false,
  });

  let [renderStatus, update] = useState(-1);

  function setPlanetFlags() {
    return PlanetTypesSelector({'code': vault.current.currentPlanetCode});
  }

  function setGoods() {
    return GoodsGetter({'planetFlags': vault.current.planetFlags, 'sort': vault.current.sort});
  }

  const getMode = (value) => {
    vault.current.selectedMode = value;
    vault.current.defaultCodeSubstitution = false;

    if (vault.current.selectedMode === 2) {
      vault.current.routeSheet = TradePathPlotter({'route': vault.current.routeSheet['route'], 
        'engineTier': vault.current.engineTier, 'goodsToSearch': vault.current.goodsToSearch,
        'isIllegal': vault.current.isIllegal, 'isRebuildNeeded': vault.current.isRebuildNeeded,});
    }

    update(renderStatus * -1);
  }

  const getSortType = (value) => {
    vault.current.sort = value;
    vault.current.goods = setGoods();
    vault.current.defaultCodeSubstitution = false;

    update(renderStatus * -1);
  }

  const getCode = (value) => {
    vault.current.currentPlanetCode = value;
    vault.current.planetFlags = setPlanetFlags();
    vault.current.goods = setGoods();
    vault.current.defaultCodeSubstitution = false;

    update(renderStatus * -1);
  }

  const setCurrentPlanet = (code, flags) => {
    vault.current.selectedMode = 0; // goods
    vault.current.currentPlanetCode = code;
    vault.current.planetFlags = flags.split(' ');
    vault.current.goods = setGoods();
    vault.current.defaultCodeSubstitution = true; 

    update(renderStatus * -1);
  }

  const changeNode = (planetID) => {
    if (!vault.current.routeSheet['route'].has(planetID)) { vault.current.routeSheet['route'].add(planetID); } 
    else { vault.current.routeSheet['route'].delete(planetID); }

    if (vault.current.selectedMode === 2) {
      vault.current.routeSheet = TradePathPlotter({'route': vault.current.routeSheet['route'], 
        'engineTier': vault.current.engineTier, 'goodsToSearch': vault.current.goodsToSearch,
        'isIllegal': vault.current.isIllegal, 'isRebuildNeeded': vault.current.isRebuildNeeded,});
      update(renderStatus * -1);
    }
  }

  const clearRoute = () => {
    vault.current.routeSheet['route'].clear();
  }

  const setSettings = (settingsObj) => {
    vault.current.engineTier = settingsObj.engineTier;
    vault.current.isIllegal = settingsObj.isIllegal
    vault.current.isRebuildNeeded = settingsObj.isRebuildNeeded
    vault.current.goodsToSearch = settingsObj.itemsToVisualize;

    if (vault.current.selectedMode === 2) {
      vault.current.routeSheet = TradePathPlotter({'route': vault.current.routeSheet['route'], 
        'engineTier': vault.current.engineTier, 'goodsToSearch': vault.current.goodsToSearch,
        'isIllegal': vault.current.isIllegal, 'isRebuildNeeded': vault.current.isRebuildNeeded,});
      update(renderStatus * -1);
    }
  }

  return (
    <div className='App'>

      <Header getMode={getMode} />
      <InputsGroup mode={vault.current.selectedMode} getCode={getCode} value={vault.current.currentPlanetCode} substFlag={vault.current.defaultCodeSubstitution} />
      <Goods mode={vault.current.selectedMode} goods={vault.current.goods} codes={vault.current.planetFlags} getSortType={getSortType} pcode={vault.current.currentPlanetCode}/>
      <Planets mode={vault.current.selectedMode} setCurrentPlanet={setCurrentPlanet} changeNode={changeNode} />
      <Routes mode={vault.current.selectedMode} deleteNode={changeNode} routeSheet={vault.current.routeSheet} clearRoute={clearRoute} getSettings={setSettings} />

    </div>
  );
}

export default App;

