import express from "express";
import verifyToken from "../middlewares/verifyToken";
import * as userController from "../controllers/userController";

const router = express.Router();

router.use(verifyToken);
router.get("/me",  userController.getCurrent);
router.put("/me",  userController.updateUser);

export default router;
