import express from "express";
import * as postController from "../controllers/Post/postController";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/all",    postController.getPosts);
router.get("/",       postController.getPostsLimit);
router.get("/latest", postController.getNewPosts);
router.get("/detail", postController.getPostById);

router.use(verifyToken);
router.post("/create",   postController.createNewPost);
router.get("/manage",    postController.getPostLimitAdmin);
router.get("/history",   postController.getPostHistory);
router.put("/update",    postController.updatePost);
router.put("/extend",    postController.extendPost);
router.put("/restore",   postController.restorePost);
router.delete("/delete", postController.deletePost);

export default router;
