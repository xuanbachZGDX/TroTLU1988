import { getNumberPrice, getNumberArea } from "./getNumber";

const MAX_RANGE = 99999999;

// Chuẩn hóa min/max cho từng item (dùng chung cho price/area)
const getMinMax = (value, getNumbers) => {
  const numbers = getNumbers(value);
  const val = value.toLowerCase();

  if (val.includes("dưới") || val.includes("duoi")) {
    return { min: 0, max: numbers[0] };
  }
  if (val.includes("trên") || val.includes("tren")) {
    return { min: numbers[0], max: MAX_RANGE };
  }
  // Trường hợp khoảng giữa (ví dụ: 5-10 triệu, 20-30 m2)
  return { min: numbers[0], max: numbers[1] || numbers[0] };
};

export const getCodePrice = (prices) =>
  prices?.map((item) => ({
    ...item,
    ...getMinMax(item.value, getNumberPrice),
  }));

export const getCodeArea = (areas) =>
  areas?.map((item) => ({
    ...item,
    ...getMinMax(item.value, getNumberArea),
  }));

export const filterCodesByRange = (range, list, getNumbers) => {
  const withMinMax = list?.map((item) => ({
    ...item,
    ...getMinMax(item.value, getNumbers),
  }));
  return withMinMax.filter(
    (item) =>
      (item.min === range[0] && item.max === range[1]) ||
      Math.max(item.min, range[0]) < Math.min(item.max, range[1])
  );
};

export const getCodesPrice = (range, prices) =>
  filterCodesByRange(range, prices, getNumberPrice);

// Lọc code diện tích
export const getCodesArea = (range, areas) =>
  filterCodesByRange(range, areas, getNumberArea);