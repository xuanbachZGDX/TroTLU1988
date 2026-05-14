import express from "express";
import * as adminController from "../controllers/Admin/adminController";
import verifyAdmin from "../middlewares/verifyAdmin";

const router = express.Router();

router.use(verifyAdmin);
router.get("/dashboard", adminController.getDashboard);
router.get("/posts", adminController.getPosts);
router.delete("/posts/:postId", adminController.deletePost);
router.put("/posts/:postId/approve", adminController.approvePost);
router.put("/posts/:postId/reject",  adminController.rejectPost);
router.get("/users", adminController.getUsers);
router.put("/users/:userId/status", adminController.updateUserStatus);
router.get("/contacts", adminController.getContacts);
router.delete("/contacts/:contactId", adminController.deleteContact);

export default router;
