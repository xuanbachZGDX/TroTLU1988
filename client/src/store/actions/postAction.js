import actionTypes from "./actionType";
import { apiGetAllPosts, apiGetAllPostsLimit, apiGetNewPosts, apiGetPostLimitAdmin, apiGetPostById } from "../../services/postService";

export const getPostDetail = (id) => async (dispatch) => {
  try {
    const response = await apiGetPostById(id);
    if (response?.data.err === 0) {
      dispatch({ type: actionTypes.GET_POST_DETAIL, postDetail: response.data.response });
    } else {
      dispatch({ type: actionTypes.GET_POST_DETAIL, postDetail: null });
    }
  } catch (error) {
    dispatch({ type: actionTypes.GET_POST_DETAIL, postDetail: null });
  }
};


export const getAllPosts = () => async (dispatch) => {
  try {
    const response = await apiGetAllPosts();
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_POSTS,
        posts: response.data.response,
      });
    } else {
      dispatch({
        type: actionTypes.GET_POSTS,
        msg: response.data.msg,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_POSTS,
      posts: null,
    });
  }
};

export const getAllPostsLimit = (query) => async (dispatch) => {
  try {
    const response = await apiGetAllPostsLimit(query);
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_POSTS_LIMIT,
        posts: response.data.response?.rows,
        count: response.data.response?.count
      });
    } else {
      dispatch({
        type: actionTypes.GET_POSTS_LIMIT,
        msg: response.data.msg,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_POSTS,
      posts: null,
    });
  }
};

export const getNewPosts = () => async (dispatch) => {
  try {
    const response = await apiGetNewPosts();
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_NEW_POSTS,
        newPosts: response.data.response,
      });
    } else {
      dispatch({
        type: actionTypes.GET_NEW_POSTS,
        msg: response.data.msg,
        newPosts: null
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_NEW_POSTS,
      newPosts: null,
    });
  }
};

export const getPostsLimitAdmin = (query) => async (dispatch) => {
  try {
    const response = await apiGetPostLimitAdmin(query);
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_POST_ADMIN,
        posts: response.data.response?.rows,
        count: response.data.response?.count
      });
    } else {
      dispatch({
        type: actionTypes.GET_POST_ADMIN,
        msg: response.data.msg,
        posts: null
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_POST_ADMIN,
      posts: null,
    });
  }
};

export const editPost = (dataEdit) => ({
  type: actionTypes.EDIT_POST,
  dataEdit
})

export const resetDataEdit = () => ({
  type: actionTypes.RESET_DATA_EDIT
})