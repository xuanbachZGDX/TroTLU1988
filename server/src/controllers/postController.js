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
