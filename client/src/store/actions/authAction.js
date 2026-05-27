import actionTypes from "./actionType";
import { apiRegister, apiLogin, apiLoginGoogle } from "../../services/authService";

export const register = (payload) => async (dispatch) => {
  try {
    const response = await apiRegister(payload);
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
        data: response.data.token,
      });
    } else {
      dispatch({
        type: actionTypes.REGISTER_FAIL,
        data: response.data.msg,
      });
    }
  } catch (error) {
    const errorMsg = error.response?.data?.msg || error.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại kết nối mạng!";
    dispatch({
      type: actionTypes.REGISTER_FAIL,
      data: errorMsg,
    });
  }
};

export const login = (payload) => async (dispatch) => {
  try {
    const response = await apiLogin(payload);
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        data: response.data.token,
      });
    } else {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
        data: response.data.msg,
      });
    }
  } catch (error) {
    const errorMsg = error.response?.data?.msg || error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối mạng!";
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      data: errorMsg,
    });
  }
};

export const loginGoogle = (credential, accountType = null) => async (dispatch) => {
  try {
    const response = await apiLoginGoogle(credential, accountType);
    if (response?.data.err === 0 && response?.data.token) {
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        data: response.data.token,
      });
    } else if (response?.data.err !== 0) {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
        data: response.data.msg || "Đăng nhập Google thất bại",
      });
    }
    return response?.data;
  } catch (error) {
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      data: "Kết nối đến máy chủ thất bại!",
    });
    return null;
  }
};

export const logout = () => ({
  type: actionTypes.LOGOUT,
});

export const loginWithToken = (token) => ({
  type: actionTypes.LOGIN_SUCCESS,
  data: token,
});
