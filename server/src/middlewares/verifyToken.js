import jwt from "jsonwebtoken";
import db from "../models";

const verifyToken = (req, res, next) => {
  let accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken)
    return res.status(401).json({
      err: 1,
      msg: "Missing access token",
    });

  jwt.verify(accessToken, process.env.SECRET_KEY, async (err, decoded) => {
    if (err)
      return res.status(401).json({
        err: 1,
        msg: "Access token expired",
      });

    try {
      const user = await db.User.findByPk(decoded.id);
      if (!user || user.status === "blocked") {
        return res.status(403).json({
          err: 2,
          msg: "ACCOUNT_BLOCKED",
        });
      }
    } catch (dbErr) {
      console.error("Error checking blocked user status in verifyToken:", dbErr);
    }

    req.user = decoded;
    next();
  });
};

export default verifyToken;
