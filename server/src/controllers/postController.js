import * as postService from "../services/postService.js";

export const getPostById = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) return res.status(400).json({ err: 1, msg: "Missing post id" });
    const response = await postService.getPostByIdService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const getPosts = async (req, res) => {
  try {
    const response = await postService.getPostsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};

export const getPostsLimit = async (req, res) => {
  const {
    page,
    priceNumber,
    areaNumber,
    "priceNumber[]": priceNumberArray,
    "areaNumber[]": areaNumberArray,
    ...query
  } = req.query;
  const cleanQuery = {};
  const normalizeRange = (value) => {
    if (!value) return undefined;
    const values = Array.isArray(value) ? value : [value];
    const normalized = values
      .map((item) => +item)
      .filter((item) => !Number.isNaN(item));
    return normalized.length ? normalized : undefined;
  };

  Object.keys(query).forEach((key) => {
    if (key.endsWith("[]")) {
      cleanQuery[key.replace("[]", "")] = query[key];
    } else {
      cleanQuery[key] = query[key];
    }
  });

  try {
    const response = await postService.getPostsLimitService(page, cleanQuery, {
      priceNumber: normalizeRange(priceNumberArray || priceNumber),
      areaNumber: normalizeRange(areaNumberArray || areaNumber),
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};

export const getNewPosts = async (req, res) => {
  try {
    const response = await postService.getNewPostService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};

export const createNewPost = async (req, res) => {
  try {
    const { categoryCode, title, priceNumber, areaNumber, label } = req.body;
    const { id } = req.user;
    if (
      !categoryCode ||
      !id ||
      !title ||
      !priceNumber ||
      !areaNumber ||
      !label
    ) {
      return res.status(400).json({
        err: 1,
        msg: "Missing required fields",
      });
    }
    const response = await postService.createNewPostService(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};

export const getPostLimitAdmin = async (req, res) => {
  const { page, ...query } = req.query;
  const {id} = req.user;
  try {
    if (!id) return res.status(400).json({
      err: 1,
      msg: "Missing required fields",
    });
    const response = await postService.getPostLimitAdminService(page, query, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};

export const updatePost = async (req, res) => {
    const { postId, ...payload } = req.body;
    const {id} = req.user;
  try {
    if (!postId || !id) return res.status(400).json({
      err: 1,
      msg: "Missing required fields",
    });
    const response = await postService.updatePost(postId, payload);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};

export const deletePost = async (req, res) => {
    const { postId } = req.query;
    const {id} = req.user;
  try {
    if (!postId || !id) return res.status(400).json({
      err: 1,
      msg: "Missing required fields",
    });
    const response = await postService.deletePost(postId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Failed at post controller: " + error,
    });
  }
};