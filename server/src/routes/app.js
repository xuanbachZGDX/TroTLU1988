import express from "express";
import * as contactController from "../controllers/App/contactController";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/contact", verifyToken, contactController.createContact);

export default router;
