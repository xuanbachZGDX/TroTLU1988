import * as postService from "../../services/Post/postService";

export const createNewPost = async (req, res) => {
  try {
    const { categoryCode, title, priceNumber, areaNumber } = req.body;
    const { id } = req.user;
    if (!categoryCode || !id || !title || !priceNumber || !areaNumber) {
      return res.status(400).json({ err: 1, msg: "Missing required fields" });
    }
    const response = await postService.createNewPostService(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + (error.message || error),
    });
  }
};

export const getPostLimitAdmin = async (req, res) => {
  const { page, ...query } = req.query;
  const { id } = req.user;
  try {
    if (!id)
      return res.status(400).json({ err: 1, msg: "Missing required fields" });
    const response = await postService.getPostLimitAdminService(
      page,
      query,
      id,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const updatePost = async (req, res) => {
  const { postId, ...payload } = req.body;
  const { id } = req.user;
  try {
    if (!postId || !id)
      return res.status(400).json({ err: 1, msg: "Missing required fields" });
    const response = await postService.updatePost(postId, payload, req.user);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.query;
  const { id } = req.user;
  try {
    if (!postId || !id)
      return res.status(400).json({ err: 1, msg: "Missing required fields" });
    const response = await postService.deletePost(postId, req.user);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const restorePost = async (req, res) => {
  const { postId } = req.body;
  const { id } = req.user;
  try {
    if (!postId || !id)
      return res.status(400).json({ err: 1, msg: "Missing required fields" });
    const response = await postService.restorePost(postId, req.user);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const extendPost = async (req, res) => {
  const { postId, days, star } = req.body;
  const { id } = req.user;
  try {
    if (!postId || !id)
      return res
        .status(400)
        .json({ err: 1, msg: "Thiếu mã bài đăng hoặc người dùng" });
    const response = await postService.extendPostService(
      postId,
      id,
      days,
      star,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const rejectPost = async (req, res) => {
  const { postId } = req.body;
  const { role } = req.user;
  try {
    if (role !== "admin")
      return res.status(403).json({ err: 1, msg: "Không có quyền thực hiện" });
    if (!postId)
      return res.status(400).json({ err: 1, msg: "Thiếu mã bài đăng" });
    const response = await postService.rejectPostService(postId);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};
