import { PDM, SDM, ALL_GOODS_WITHOUT_DM } from '../../Constants.js'

export default function GoodsGetter(props) {

  let availableGoods = getGoods(props.sort, props.planetFlags);
  bindDMStoGoods(availableGoods);

  if (props.sort === 'off') return availableGoods;
  if (props.sort === 'best-to-sell') {
    bindTotalBenefits(availableGoods, props.planetFlags, 'sdm');
    return availableGoods.sort(benefitSort);
  }

  bindTotalBenefits(availableGoods, props.planetFlags, 'pdm');
  return availableGoods.sort(benefitSort);

}

function getGoods(sortMode, planetFlags) {
  if (sortMode === 'best-to-sell') return [...ALL_GOODS_WITHOUT_DM];
  
  return ALL_GOODS_WITHOUT_DM.filter(
    item => item.availability.split(' ').some(elem => planetFlags.includes(elem))
    //You definitely need to come up with something faster
  );

}

function bindDMStoGoods(goodsArr) {

  for (let item of goodsArr) {
    const index = (item.id - 11) - 4*(Math.floor(item.id / 10) - 1);
    item['pdm'] = PDM[index];
    item['sdm'] = SDM[index];
  }

  return goodsArr;
}

function bindTotalBenefits(goodsArr, planetFlags, fieldName) {

  for (let item of goodsArr) {
    item['tmpBenefit'] = calcTotalBenefitRatio(item, planetFlags, fieldName)
  }

  return goodsArr;
}

function benefitSort(first, second) {
  return second.tmpBenefit - first.tmpBenefit;
}

function calcTotalBenefitRatio(item, planetFlags, fieldName) {
  let result = 0;

  for (let i in item[fieldName]) {
    if (planetFlags.includes(i)) {
      result += item[fieldName][i];
    }
  }

  return result;
}
