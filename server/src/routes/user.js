import express from "express";
import verifyToken from "../middlewares/verifyToken";
import * as userController from "../controllers/User/userController";

const router = express.Router();

router.use(verifyToken);
router.get("/me",  userController.getCurrent);
router.put("/me",  userController.updateUser);
router.get("/my-contacts", userController.getMyContacts);

export default router;
