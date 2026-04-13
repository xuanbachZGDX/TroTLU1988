import * as postService from "../services/postService.js";

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
  const { page, ...query } = req.query;
  const cleanQuery = {};
  
  Object.keys(query).forEach(key => {
    if (key.endsWith('[]')) {
      cleanQuery[key.replace('[]', '')] = query[key];
    } else {
      cleanQuery[key] = query[key];
    }
  });

  try {
    const response = await postService.getPostsLimitService(page, cleanQuery);
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
