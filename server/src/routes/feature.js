import express from "express";
import * as controller from "../controllers/App/featureController";

const router = express.Router();

router.get("/all", controller.getFeatures);

export default router;
