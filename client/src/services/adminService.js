import axiosConfig from "../axiosConfig";

export const apiGetAdminDashboard = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/api/v1/admin/dashboard",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAdminPosts = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/api/v1/admin/posts",
        params,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiDeleteAdminPost = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/api/v1/admin/posts/${postId}`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiApproveAdminPost = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/api/v1/admin/posts/${postId}/approve`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAdminUsers = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/api/v1/admin/users",
        params,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpdateUserStatus = (userId, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/api/v1/admin/users/${userId}/status`,
        data: { status },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiRejectAdminPost = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/api/v1/admin/posts/${postId}/reject`,
        data: { postId },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAdminContacts = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/api/v1/admin/contacts",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiDeleteAdminContact = (contactId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/api/v1/admin/contacts/${contactId}`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
