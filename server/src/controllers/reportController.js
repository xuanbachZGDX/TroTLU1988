import * as reportService from "../services/reportService";

export const createReport = async (req, res) => {
  const { postId, reason, content } = req.body;
  const { id: userId } = req.user;
  try {
    if (!postId || !reason) {
      return res.status(400).json({
        err: 1,
        msg: "Thiếu mã bài đăng hoặc lý do báo cáo",
      });
    }
    const response = await reportService.createReportService(userId, {
      postId,
      reason,
      content,
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at report controller: " + (error.message || error),
    });
  }
};

export const getReports = async (req, res) => {
  const { page, limit, status } = req.query;
  const { role } = req.user;
  try {
    if (role !== "admin") {
      return res.status(403).json({
        err: 1,
        msg: "Bạn không có quyền truy cập chức năng này",
      });
    }
    const response = await reportService.getReportsService(page, limit, status);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at report controller: " + (error.message || error),
    });
  }
};

export const handleReport = async (req, res) => {
  const { reportId, action, note } = req.body;
  const { role } = req.user;
  try {
    if (role !== "admin") {
      return res.status(403).json({
        err: 1,
        msg: "Bạn không có quyền thực hiện hành động này",
      });
    }
    if (!reportId || !action) {
      return res.status(400).json({
        err: 1,
        msg: "Thiếu thông tin báo cáo hoặc hành động xử lý",
      });
    }
    const response = await reportService.handleReportService(
      reportId,
      action,
      note,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at report controller: " + (error.message || error),
    });
  }
};
