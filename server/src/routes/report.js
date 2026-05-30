import express from "express";
import * as reportController from "../controllers/reportController";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", reportController.createReport);
router.get("/admin", reportController.getReports);
router.put("/admin/handle", reportController.handleReport);

export default router;
