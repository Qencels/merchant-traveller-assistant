import {useState} from 'react';
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

  let [state,] = useState({
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
    return PlanetTypesSelector({'code': state.currentPlanetCode});
  }

  function setGoods() {
    return GoodsGetter({'planetFlags': state.planetFlags, 'sort': state.sort});
  }

  const getMode = (value) => {
    state.selectedMode = value;
    state.defaultCodeSubstitution = false;

    if (state.selectedMode === 2) {
      state.routeSheet = TradePathPlotter({'route': state.routeSheet['route'], 
        'engineTier': state.engineTier, 'goodsToSearch': state.goodsToSearch,
        'isIllegal': state.isIllegal, 'isRebuildNeeded': state.isRebuildNeeded,});
      update(renderStatus * -1);
    }

    update(renderStatus * -1);
  }

  const getSortType = (value) => {
    state.sort = value;
    state.goods = setGoods();
    state.defaultCodeSubstitution = false;

    update(renderStatus * -1);
  }

  const getCode = (value) => {
    state.currentPlanetCode = value;
    state.planetFlags = setPlanetFlags();
    state.goods = setGoods();
    state.defaultCodeSubstitution = false;

    update(renderStatus * -1);
  }

  const setCurrentPlanet = (code, flags) => {
    state.selectedMode = 0; // goods
    state.currentPlanetCode = code;
    state.planetFlags = flags.split(' ');
    state.goods = setGoods();
    state.defaultCodeSubstitution = true; 

    update(renderStatus * -1);
  }

  const changeNode = (planetID) => {
    if (!state.routeSheet['route'].has(planetID)) { state.routeSheet['route'].add(planetID); } 
    else { state.routeSheet['route'].delete(planetID); }

    if (state.selectedMode === 2) {
      state.routeSheet = TradePathPlotter({'route': state.routeSheet['route'], 
        'engineTier': state.engineTier, 'goodsToSearch': state.goodsToSearch,
        'isIllegal': state.isIllegal, 'isRebuildNeeded': state.isRebuildNeeded,});
      update(renderStatus * -1);
    }
  }

  const clearRoute = () => {
    state.routeSheet['route'].clear();
  }

  const setSettings = (settingsObj) => {
    state.engineTier = settingsObj.engineTier;
    state.isIllegal = settingsObj.isIllegal
    state.isRebuildNeeded = settingsObj.isRebuildNeeded
    state.goodsToSearch = settingsObj.itemsToVisualize;

    if (state.selectedMode === 2) {
      state.routeSheet = TradePathPlotter({'route': state.routeSheet['route'], 
        'engineTier': state.engineTier, 'goodsToSearch': state.goodsToSearch,
        'isIllegal': state.isIllegal, 'isRebuildNeeded': state.isRebuildNeeded,});
      update(renderStatus * -1);
    }
  }

  return (
    <div className='App'>

      <Header getMode={getMode} />
      <InputsGroup mode={state.selectedMode} getCode={getCode} value={state.currentPlanetCode} substFlag={state.defaultCodeSubstitution} />
      <Goods mode={state.selectedMode} goods={state.goods} codes={state.planetFlags} getSortType={getSortType} pcode={state.currentPlanetCode}/>
      <Planets mode={state.selectedMode} setCurrentPlanet={setCurrentPlanet} changeNode={changeNode} />
      <Routes mode={state.selectedMode} deleteNode={changeNode} routeSheet={state.routeSheet} clearRoute={clearRoute} getSettings={setSettings} />

    </div>
  );
}

export default App;

