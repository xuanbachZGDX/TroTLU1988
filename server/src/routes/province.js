import express from "express";
import * as controller from "../controllers/App/provinceController";

const router = express.Router();

router.get("/all", controller.getProvinces);
router.get("/featured", controller.getProvinceWithCount);

export default router;
