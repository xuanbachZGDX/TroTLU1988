import express from "express";
import * as controller from "../controllers/App/districtController";

const router = express.Router();

router.get("/all", controller.getDistricts);

export default router;
