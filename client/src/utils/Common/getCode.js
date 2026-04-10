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
