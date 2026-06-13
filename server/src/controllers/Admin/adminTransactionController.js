import * as adminService from "../../services/Admin/adminService";

export const getTransactions = async (req, res) => {
  const { page, ...query } = req.query;
  try {
    const response = await adminService.getAdminTransactionsService(
      page,
      query,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error.message });
  }
};
