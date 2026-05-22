import axiosConfig from "../lib/axios";

export const apiRegister = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/api/v1/auth/register",
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiLoginGoogle = (credential, accountType = null) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/api/v1/auth/google-login",
        data: { credential, accountType },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

  export const apiLogin = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/api/v1/auth/login",
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiForgotPassword = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/api/v1/auth/forgot-password",
        data: { email },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiResetPassword = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/api/v1/auth/reset-password",
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
