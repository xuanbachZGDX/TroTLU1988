const toFloat = (value) => {
  if (!value) return 0;
  const normalized = String(value).replace(",", ".").match(/[\d.]+/);
  return normalized ? Number.parseFloat(normalized[0]) || 0 : 0;
};

const includesAny = (value, patterns) =>
  patterns.some((pattern) => value.includes(pattern));

export const getNumberFromString = (input) => {
  const value = String(input || "").toLowerCase();
  const number = toFloat(value);

  if (includesAny(value, ["triệu/tháng", "trieu/thang", "triệu", "trieu"])) {
    return number;
  }

  if (
    includesAny(value, [
      "đồng/tháng",
      "dong/thang",
      "đồng",
      "dong",
      "nghìn/tháng",
      "nghin/thang",
      "nghìn",
      "nghin",
    ])
  ) {
    if (includesAny(value, ["nghìn", "nghin"])) return number / 1000;
    return number / 1000000;
  }

  if (value.includes("m2")) {
    return number;
  }

  return number;
};

export const getNumberFromStringV2 = (input) => +getNumberFromString(input);
