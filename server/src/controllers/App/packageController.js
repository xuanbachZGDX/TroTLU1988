import * as services from "../../services/App/packageService";

export const getAllPackages = async (req, res) => {
  try {
    const response = await services.getAllPackagesService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at package controller: " + error,
    });
  }
};
