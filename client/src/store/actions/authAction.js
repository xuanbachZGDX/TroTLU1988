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
    dispatch({
      type: actionTypes.REGISTER_FAIL,
      data: null,
    });
  }
};

export const login = (payload) => async (dispatch) => {
  try {
    const response = await apiLogin(payload);
    if (response?.data.err === 0) {
        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            data: response.data.token
        })
    }
    else {
        dispatch({
        type: actionTypes.LOGIN_FAIL,
        data: response.data.msg
    })
    }
  } catch (error) {
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      data: "Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối mạng!",
    });
  }
};

export const loginGoogle = (credential) => async (dispatch) => {
  try {
    const response = await apiLoginGoogle(credential);
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        data: response.data.token,
      });
    } else {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
        data: response.data.msg || "Đăng nhập Google thất bại",
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      data: "Kết nối đến máy chủ thất bại!",
    });
  }
};

export const logout = () => ({
  type: actionTypes.LOGOUT,
})
