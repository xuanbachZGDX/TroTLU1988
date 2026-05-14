import axios from "axios";
import actionTypes from "./store/actions/actionType";
import { store } from "./redux";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // Gắn token vào header
    let token =
      window.localStorage.getItem("persist:auth") &&
      JSON.parse(window.localStorage.getItem("persist:auth"))?.token?.slice(
        1,
        -1,
      );
    config.headers = {
      authorization: token ? `Bearer ${token}` : null,
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      store.dispatch({ type: actionTypes.LOGOUT });
    }
    return Promise.reject(error);
  },
);

export default instance;
