import * as services from "../services/featureService";

export const getFeatures = async (req, res) => {
  try {
    const response = await services.getFeaturesService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ err: -1, msg: "Failed at feature controller: " + error });
  }
};
