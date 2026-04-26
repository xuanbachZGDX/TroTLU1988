import actionTypes from "./actionType";
import * as api from "../../services";

export const getCurrent = () => async (dispatch) => {
  try {
    const response = await api.apiGetCurrent();
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_CURRENT,
        currentData: response.data.response,
      });
    } else {
      dispatch({
        type: actionTypes.GET_CURRENT,
        msg: response.data.msg,
        currentData: null,
      });
      dispatch({
        type: actionTypes.LOGOUT,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_CURRENT,
      currentData: null,
      msg: error,
    });
    dispatch({
      type: actionTypes.LOGOUT,
    });
  }
};
