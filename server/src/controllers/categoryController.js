import * as services from "../services/categoryService";

export const getAllCategories = async (req, res) => {
  try {
    const response = await services.getAllCategoryService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at category controller: " + error,
    });
  }
};
