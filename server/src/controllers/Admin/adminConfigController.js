import * as services from "../../services/Admin/adminConfigService";

// CATEGORIES CRUD CONTROLLERS
export const createCategory = async (req, res) => {
  try {
    const response = await services.createCategoryService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin config controller: " + error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await services.updateCategoryService(id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin config controller: " + error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await services.deleteCategoryService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin config controller: " + error.message,
    });
  }
};

// PACKAGES CRUD CONTROLLERS
export const getPackages = async (req, res) => {
  try {
    const response = await services.getAdminPackagesService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin config controller: " + error.message,
    });
  }
};

export const updatePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await services.updatePackageService(id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin config controller: " + error.message,
    });
  }
};
