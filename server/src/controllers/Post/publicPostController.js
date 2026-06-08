import * as postService from "../../services/Post/postService";
import { dataPrice, dataArea } from "../../utils/data";

export const getPostById = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) return res.status(400).json({ err: 1, msg: "Missing post id" });
    const response = await postService.getPostByIdService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const getPosts = async (req, res) => {
  try {
    const response = await postService.getPostsService();
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const getPostsLimit = async (req, res) => {
  const {
    page,
    limit,
    priceNumber,
    areaNumber,
    "priceNumber[]": priceNumberArray,
    "areaNumber[]": areaNumberArray,
    priceCode,
    areaCode,
    priceRange,
    areaRange,
    ...query
  } = req.query;

  const normalizeRange = (value) => {
    if (!value) return undefined;
    const values = Array.isArray(value) ? value : [value];
    const normalized = values
      .map((item) => +item)
      .filter((item) => !Number.isNaN(item));
    return normalized.length ? normalized : undefined;
  };

  let resolvedPrice = normalizeRange(priceNumberArray || priceNumber);
  let resolvedArea = normalizeRange(areaNumberArray || areaNumber);

  const pCode = priceCode || priceRange;
  if (!resolvedPrice && pCode) {
    const foundPrice = dataPrice.find((p) => p.code === pCode);
    if (foundPrice) {
      resolvedPrice = [foundPrice.min, foundPrice.max];
    }
  }

  const aCode = areaCode || areaRange;
  if (!resolvedArea && aCode) {
    const foundArea = dataArea.find((a) => a.code === aCode);
    if (foundArea) {
      resolvedArea = [foundArea.min, foundArea.max];
    }
  }

  const cleanQuery = {};
  Object.keys(query).forEach((key) => {
    if (key.endsWith("[]")) {
      cleanQuery[key.replace("[]", "")] = query[key];
    } else {
      cleanQuery[key] = query[key];
    }
  });

  try {
    const response = await postService.getPostsLimitService(
      page,
      { ...cleanQuery, limitPost: limit },
      {
        priceNumber: resolvedPrice,
        areaNumber: resolvedArea,
      },
    );
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const getNewPosts = async (req, res) => {
  try {
    const response = await postService.getNewPostService();
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};

export const getPostHistory = async (req, res) => {
  const { postId } = req.query;
  const { id } = req.user;
  try {
    if (!postId || !id)
      return res.status(400).json({ err: 1, msg: "Missing required fields" });
    const response = await postService.getPostHistoryService(postId, req.user);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ err: -1, msg: "Failed at post controller: " + error });
  }
};
