import * as services from "../services/provinceService";

export const getProvinces = async (req, res) => {
  try {
    const response = await services.getProvinceService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at provinces controller: " + error,
    });
  }
};
