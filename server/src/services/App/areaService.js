import { dataArea } from "../../utils/data";

// GET ALL AREA (Tối ưu hóa: Trả về dữ liệu tĩnh không qua Database)
export const getAreasService = () =>
  new Promise((resolve) => {
    const response = dataArea.map((item, index) => ({
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
