import axios from "../lib/axios";

export const apiGetCurrent = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/users/me",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpdateUser = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "put",
        url: "/api/v1/users/me",
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetMyInquiries = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/users/my-contacts",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetUserNotifications = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/users/notifications",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiReadUserNotification = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "put",
        url: `/api/v1/users/notifications/${id}/read`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiSubmitKyc = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "put",
        url: "/api/v1/users/kyc",
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
