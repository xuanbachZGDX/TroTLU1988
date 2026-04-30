import express from "express";
import * as postController from "../controllers/postController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/all",    postController.getPosts);
router.get("/",       postController.getPostsLimit);
router.get("/latest", postController.getNewPosts);
router.get("/detail", postController.getPostById);

router.use(verifyToken);
router.post("/create",   postController.createNewPost);
router.get("/manage",    postController.getPostLimitAdmin);
router.put("/update",    postController.updatePost);
router.delete("/delete", postController.deletePost);

export default router;
