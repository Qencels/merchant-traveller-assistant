import { ALL_GOODS_WITHOUT_DM, EXPLORED_PLANETS, ILLEGAL_GOODS_ID, PDM, SDM } from "../../Constants";

export default function TradePathPlotter(props) {
    let pathArr = Array.from(props.route);
    let isRebuildNeeded = false;
    const newPath = new Set();
    
    /*for (let i = 0; i < pathArr.length - 1; i++) {
        if (calcJumpsCount(pathArr[i], pathArr[i+1], props.engineTier) > 1) {

            isRebuildNeeded = true;
            const nodes = getNewRouteNodes(pathArr[i], pathArr[i+1], props.engineTier);
            for (let elem in nodes) newPath.add(elem);
    
        }
    }*/

    const truePath = isRebuildNeeded ? newPath : props.route;
    pathArr = Array.from(truePath);
    const pathSheet = {};

    for (let i = 0; i < pathArr.length - 1; i++) {
        pathSheet[`${pathArr[i]}-${pathArr[i+1]}`] = getGoods(pathArr[i], pathArr[i+1], props.goodsToSearch, props.isIllegal);
    }

    pathSheet['route'] = truePath;

    return pathSheet;
}

/*
function calcJumpsCount(src, dest, engineTier) {
    return Math.round(calcPlanetDistance(src, dest) / engineTier);
}

function calcPlanetDistance(src, dest) {
    // XXXX - sectorID for planet, ex: '1934'
    const srcID = EXPLORED_PLANETS[src].sectorID;
    const destID = EXPLORED_PLANETS[dest].sectorID;

    return Math.max(Math.abs((+srcID.slice(0, 2)) - (+destID.slice(0, 2))),
        Math.abs((+srcID.slice(2)) - (+destID.slice(2))));
}

function getNewRouteNodes(src, dest, engineTier) {
    const newNodes = [src];

    for (let i = 0; i < calcJumpsCount(src, dest, engineTier) - 1; i++) {
        
    }

    newNodes.push(dest);
    return newNodes;
}
*/

function getGoods(src, dest, goodsCount, isIllegal) {
    const srcPlanetFlags = EXPLORED_PLANETS[src].flags.split(' ');
    let availableGoods = [];

    if (isIllegal) {
        availableGoods = ALL_GOODS_WITHOUT_DM.filter(
            item => item.availability.split(' ').some(elem => srcPlanetFlags.includes(elem))
        );
    } else {
        availableGoods = ALL_GOODS_WITHOUT_DM.filter(
            item => (item.availability.split(' ').some(elem => srcPlanetFlags.includes(elem))
            && !ILLEGAL_GOODS_ID.includes(item.id)) 
        );
    }

    for (let item of availableGoods) {
        const index = (item.id - 11) - 4*(Math.floor(item.id / 10) - 1);

        item.pdm = PDM[index];
        item.sdm = SDM[index];
    }

    return availableGoods.sort((first, second) => {
        return (getTotalDM(second, src, 'pdm') + getTotalDM(second, dest, 'sdm')) - 
            (getTotalDM(first, src, 'pdm') + getTotalDM(first, dest, 'sdm'))
    }).slice(0, goodsCount);
}

function getTotalDM(elem, planetID, fieldName) {
    const planetFlags = EXPLORED_PLANETS[planetID].flags.split(' ');
    let totalDM = 0;

    for (let i in elem[fieldName]) { if (planetFlags.includes(i)) totalDM += elem[fieldName][i]; }

    return totalDM;
}
