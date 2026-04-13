import { getNumberPrice, getNumberArea } from "./getNumber";

export const getCodePrice = (total) => {
  let arr = [];
  return total.map((item) => {
    let arrMaxMin = getNumberPrice(item.value);

    if (arrMaxMin.length === 1) arr.push(arrMaxMin[0]);

    let sortedArr = arr.sort();

    return {
      ...item,
      min: sortedArr.indexOf(arrMaxMin[0]) === 0 ? 0 : arrMaxMin[0],
      max:
        sortedArr.indexOf(arrMaxMin[0]) === 0
          ? arrMaxMin[0]
          : sortedArr.indexOf(arrMaxMin[0]) === 1
            ? 99999999
            : arrMaxMin[1],
    };
  });
};

export const getCodeArea = (total) => {
  let arr = [];
  return total.map((item) => {
    let arrMaxMin = getNumberArea(item.value);

    if (arrMaxMin.length === 1) arr.push(arrMaxMin[0]);

    let sortedArr = arr.sort();

    return {
      ...item,
      min: sortedArr.indexOf(arrMaxMin[0]) === 0 ? 0 : arrMaxMin[0],
      max:
        sortedArr.indexOf(arrMaxMin[0]) === 0
          ? arrMaxMin[0]
          : sortedArr.indexOf(arrMaxMin[0]) === 1
            ? 99999999
            : arrMaxMin[1],
    };
  });
};

export const getCodes = (arrMinMax, prices) => {
  const pricesWithMinMax = getCodePrice(prices);
  return pricesWithMinMax.filter(
    (item) =>
      (item.min >= arrMinMax[0] && item.min <= arrMinMax[1]) ||
      (item.max <= arrMinMax[1] && item.max >= arrMinMax[0]),
  );
};

export const getCodesArea = (arrMinMax, areas) => {
  const areasWithMinMax = getCodeArea(areas);
  return areasWithMinMax.filter(
    (item) =>
      (item.min >= arrMinMax[0] && item.min <= arrMinMax[1]) ||
      (item.max <= arrMinMax[1] && item.max >= arrMinMax[0]),
  );
};
