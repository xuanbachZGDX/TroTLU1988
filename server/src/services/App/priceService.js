import { dataPrice } from "../../utils/data";

// GET ALL PRICE (Tối ưu hóa: Trả về dữ liệu tĩnh không qua Database)
export const getPricesService = () =>
  new Promise((resolve) => {
    const response = dataPrice.map((item, index) => ({
      code: item.code,
      value: item.value,
      order: index + 1,
    }));
    resolve({
      err: 0,
      msg: "OK",
      response,
    });
  });

