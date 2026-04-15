import { getNumberPrice, getNumberArea } from "./getNumber";

const MAX_RANGE = 99999999;

const normalizeRange = (value, getNumbers) => {
  const numbers = getNumbers(value);
  const normalizedValue = value.toLowerCase();

  if (normalizedValue.includes("dưới") || normalizedValue.includes("duoi")) {
    return { min: 0, max: numbers[0] };
  }

  if (normalizedValue.includes("trên") || normalizedValue.includes("tren")) {
    return { min: numbers[0], max: MAX_RANGE };
  }

  return {
    min: numbers[0],
    max: numbers[1],
  };
};

export const getCodePrice = (total) => {
  return total.map((item) => ({
    ...item,
    ...normalizeRange(item.value, getNumberPrice),
  }));
};

export const getCodeArea = (total) => {
  return total.map((item) => ({
    ...item,
    ...normalizeRange(item.value, getNumberArea),
  }));
};

export const getCodes = (arrMinMax, prices) => {
  const pricesWithMinMax = getCodePrice(prices);
  return pricesWithMinMax.filter(
    (item) =>
      (item.min === arrMinMax[0] && item.max === arrMinMax[1]) ||
      Math.max(item.min, arrMinMax[0]) < Math.min(item.max, arrMinMax[1])
  );
};

export const getCodesArea = (arrMinMax, areas) => {
  const areasWithMinMax = getCodeArea(areas);
  return areasWithMinMax.filter(
    (item) =>
      (item.min === arrMinMax[0] && item.max === arrMinMax[1]) ||
      Math.max(item.min, arrMinMax[0]) < Math.min(item.max, arrMinMax[1])
  );
};
