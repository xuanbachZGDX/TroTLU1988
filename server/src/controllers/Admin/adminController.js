import * as adminService from "../../services/Admin/adminService";
import { getSystemSettings, updateSystemSettings } from "../../utils/systemSettings";

export const getDashboard = async (req, res) => {
  try {
    const response = await adminService.getDashboardService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const getPosts = async (req, res) => {
  const { page, ...query } = req.query;

  try {
    const response = await adminService.getAdminPostsService(page, query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const getUsers = async (req, res) => {
  const { page, ...query } = req.query;

  try {
    const response = await adminService.getAdminUsersService(page, query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    if (!postId) {
      return res.status(400).json({
        err: 1,
        msg: "Missing post id",
      });
    }

    const response = await adminService.deleteAdminPostService(postId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const approvePost = async (req, res) => {
  const { postId } = req.params;

  try {
    if (!postId) {
      return res.status(400).json({
        err: 1,
        msg: "Missing post id",
      });
    }

    const response = await adminService.approveAdminPostService(postId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status, reason } = req.body;

  try {
    if (!userId || !status) {
      return res.status(400).json({
        err: 1,
        msg: "Missing required parameters",
      });
    }

    const response = await adminService.updateUserStatusService(userId, status, reason);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const rejectPost = async (req, res) => {
  const { postId } = req.params;
  const { reason } = req.body;

  try {
    if (!postId) {
      return res.status(400).json({
        err: 1,
        msg: "Missing post id",
      });
    }

    const response = await adminService.rejectAdminPostService(postId, reason);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const response = await adminService.getAdminContactsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const response = await adminService.deleteAdminContactService(contactId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const replyContact = async (req, res) => {
  const { contactId } = req.params;
  const { responseText } = req.body;
  try {
    if (!contactId || !responseText) {
      return res.status(400).json({
        err: 1,
        msg: "Missing required parameters",
      });
    }
    const response = await adminService.replyAdminContactService(contactId, responseText);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const response = await adminService.getAdminNotificationsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const readNotification = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ err: 1, msg: "Missing notification id" });
    const response = await adminService.readAdminNotificationService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at admin controller: " + error,
    });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = getSystemSettings();
    return res.status(200).json({ err: 0, msg: "OK", data: settings });
  } catch (error) {
    return res.status(500).json({ err: -1, msg: "Failed: " + error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { autoApprove } = req.body;
    updateSystemSettings({ autoApprove: !!autoApprove });
    
    let sweepResult = null;
    if (!!autoApprove) {
      sweepResult = await adminService.sweepPendingPostsService();
    }

    return res.status(200).json({ 
      err: 0, 
      msg: sweepResult 
        ? `Kích hoạt thành công! Đã tự động duyệt ${sweepResult.approvedCount} tin đăng cũ đang chờ thỏa mãn điều kiện.`
        : "Đã chuyển về chế độ phê duyệt tin đăng thủ công." 
    });
  } catch (error) {
    return res.status(500).json({ err: -1, msg: "Failed: " + error.message });
  }
};
