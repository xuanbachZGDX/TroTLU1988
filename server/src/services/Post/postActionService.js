import db from "../../models";
import { createNewPostService } from "./Action/postCreateService";
import { updatePost } from "./Action/postUpdateService";

export { createNewPostService, updatePost };

export const deletePost = (postId, actor) =>
  new Promise(async (resolve, reject) => {
    try {
      const where = actor?.role === "admin" ? { id: postId } : { id: postId, userId: actor?.id };
      const post = await db.Post.findOne({ where });
      if (!post) return resolve({ err: 1, msg: "Không tìm thấy bài đăng" });

      await db.sequelize.transaction(async (transaction) => {
        await db.PostFeature.destroy({ where: { postId }, transaction });
        await db.Attribute.destroy({ where: { postId }, transaction });
        await db.Image.destroy({ where: { postId }, transaction });
        await db.Overview.destroy({ where: { postId }, transaction });
        await db.Post.destroy({ where: { id: postId }, transaction });
      });
      resolve({ err: 0, msg: "Xóa tin đăng thành công" });
    } catch (error) {
      reject(error);
    }
  });
