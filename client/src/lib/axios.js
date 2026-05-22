import axios from "axios";
import actionTypes from "../store/actions/actionType";
import { store } from "../redux";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    let token = null;
    try {
      // 1. Ưu tiên lấy token trực tiếp từ Redux Store để đồng bộ tức thì khi vừa đăng nhập
      token = store.getState()?.auth?.token;

      // 2. Fallback sang đọc từ localStorage nếu Redux Store chưa sẵn sàng
      if (!token) {
        const persistAuth = window.localStorage.getItem("persist:auth");
        if (persistAuth) {
          const parsedAuth = JSON.parse(persistAuth);
          if (parsedAuth && parsedAuth.token && parsedAuth.token !== "null" && parsedAuth.token !== '""') {
            token = parsedAuth.token.slice(1, -1);
          }
        }
      }
    } catch (error) {
      console.error("Error retrieving auth token", error);
    }

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
    if (error.response) {
      if (error.response.status === 401) {
        store.dispatch({ type: actionTypes.LOGOUT });
      } else if (error.response.status === 403 && error.response.data?.msg === "ACCOUNT_BLOCKED") {
        store.dispatch({ type: actionTypes.LOGOUT });
        import("sweetalert2").then(({ default: Swal }) => {
          Swal.fire({
            icon: "error",
            title: "Tài khoản bị khóa",
            text: "Tài khoản của bạn đã bị khóa bởi quản trị viên. Hệ thống sẽ tự động đăng xuất.",
            confirmButtonText: "Đồng ý",
            allowOutsideClick: false,
          }).then(() => {
            window.location.href = "/login";
          });
        });
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
