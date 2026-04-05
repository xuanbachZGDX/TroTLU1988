import * as insertService from "../services/insertService";

export const insert = async (req, res) => {
  try {
    await insertService.insertService();
    await insertService.createPricesAndAreas();
    return res.status(200).json({ msg: "Insert data successfully" });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at insert controller: " + error,
    });
  }
};
