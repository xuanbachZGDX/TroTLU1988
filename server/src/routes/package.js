import express from "express";
import * as controller from "../controllers/App/packageController";

const router = express.Router();

router.get("/all", controller.getAllPackages);

export default router;
