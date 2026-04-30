import axios from "../axiosConfig";

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
