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

export const apiUpdateUserStatus = (userId, status, reason = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/api/v1/admin/users/${userId}/status`,
        data: { status, reason },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiRejectAdminPost = (postId, reason = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/api/v1/admin/posts/${postId}/reject`,
        data: { postId, reason },
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

export const apiReplyAdminContact = (contactId, responseText) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/api/v1/admin/contacts/${contactId}/reply`,
        data: { responseText },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAdminNotifications = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/api/v1/admin/notifications",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiReadAdminNotification = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/api/v1/admin/notifications/${id}/read`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAdminSettings = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/api/v1/admin/settings",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpdateAdminSettings = (settings) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: "/api/v1/admin/settings",
        data: settings,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
