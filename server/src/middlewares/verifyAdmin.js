import verifyToken from "./verifyToken";

const verifyAdmin = (req, res, next) =>
  verifyToken(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        err: 1,
        msg: "Admin permission required",
      });
    }

    return next();
  });

export default verifyAdmin;
