import express from "express";
import * as controller from "../controllers/provinceController";

const router = express.Router();

router.get("/all", controller.getProvinces);

export default router;
