import express from "express";
import * as controller from "../controllers/App/areaController";

const router = express.Router();

router.get("/all", controller.getAreas);

export default router;
