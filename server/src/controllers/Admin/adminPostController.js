import * as adminService from "../../services/Admin/adminService";

export const getPosts = async (req, res) => {
  const { page, ...query } = req.query;
  try {
    const response = await adminService.getAdminPostsService(page, query);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    if (!postId)
      return res.status(400).json({ err: 1, msg: "Missing post id" });
    const response = await adminService.deleteAdminPostService(postId);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error });
  }
};

export const approvePost = async (req, res) => {
  const { postId } = req.params;
  try {
    if (!postId)
      return res.status(400).json({ err: 1, msg: "Missing post id" });
    const response = await adminService.approveAdminPostService(postId);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error });
  }
};

export const rejectPost = async (req, res) => {
  const { postId } = req.params;
  const { reason } = req.body;
  try {
    if (!postId)
      return res.status(400).json({ err: 1, msg: "Missing post id" });
    const response = await adminService.rejectAdminPostService(postId, reason);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error });
  }
};

export const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status, reason } = req.body;
  try {
    if (!userId || !status)
      return res
        .status(400)
        .json({ err: 1, msg: "Missing required parameters" });
    const response = await adminService.updateUserStatusService(
      userId,
      status,
      reason,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at admin controller: " + error });
  }
};
