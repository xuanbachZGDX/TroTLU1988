import * as services from "../../services/App/districtService";

export const getDistricts = async (req, res) => {
  try {
    const { provinceCode } = req.query;
    const response = await services.getDistrictsService(provinceCode);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at districts controller: " + error,
    });
  }
};
