import * as adminService from "../../services/Admin/adminService";

export const getKycPendingUsers = async (req, res) => {
  try {
    const response = await adminService.getKycPendingUsersService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + (error.message || error),
    });
  }
};

export const handleKyc = async (req, res) => {
  const { userId, action, note } = req.body;
  try {
    if (!userId || !action) {
      return res
        .status(400)
        .json({ err: 1, msg: "Missing required parameters" });
    }
    const response = await adminService.handleKycService(userId, action, note);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + (error.message || error),
    });
  }
};
