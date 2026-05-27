import verifyToken from "./verifyToken";

const verifyAdmin = (req, res, next) =>
  verifyToken(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        err: 1,
        msg: "Bạn không có quyền truy cập chức năng này",
      });
    }

    return next();
  });

export default verifyAdmin;
