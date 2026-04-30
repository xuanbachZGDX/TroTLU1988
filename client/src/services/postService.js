import axios from "axios";
import axiosConfig from "../axiosConfig";

export const apiGetAllPosts = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/api/v1/posts/all",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAllPostsLimit = (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/posts`,
        params: query,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPostById = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/posts/detail`,
        params: { id },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetNewPosts = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/posts/latest`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUploadImages = (images) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "post",
        url: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        data: images
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiCreatePost = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: `/api/v1/posts/create`,
        data: payload
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpdatePost = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/api/v1/posts/update`,
        data: payload
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPostLimitAdmin = (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/api/v1/posts/manage`,
        params: query,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiDeletePost = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/api/v1/posts/delete`,
        params: { postId },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
