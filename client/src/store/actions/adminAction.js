import actionTypes from "./actionType";
import * as api from "../../services/adminService";

export const getAdminDashboard = () => async (dispatch) => {
  try {
    const response = await api.apiGetAdminDashboard();
    dispatch({
      type: actionTypes.GET_ADMIN_DASHBOARD,
      dashboard: response?.data?.err === 0 ? response.data.response : {},
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ADMIN_DASHBOARD,
      dashboard: {},
    });
  }
};

export const getAdminPosts = (query) => async (dispatch) => {
  try {
    const response = await api.apiGetAdminPosts(query);
    dispatch({
      type: actionTypes.GET_ADMIN_POSTS,
      posts: response?.data?.err === 0 ? response.data.response?.rows : [],
      count: response?.data?.err === 0 ? response.data.response?.count : 0,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ADMIN_POSTS,
      posts: [],
      count: 0,
    });
  }
};

export const getAdminUsers = (query) => async (dispatch) => {
  try {
    const response = await api.apiGetAdminUsers(query);
    dispatch({
      type: actionTypes.GET_ADMIN_USERS,
      users: response?.data?.err === 0 ? response.data.response?.rows : [],
      count: response?.data?.err === 0 ? response.data.response?.count : 0,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ADMIN_USERS,
      users: [],
      count: 0,
    });
  }
};
