import actionTypes from "./actionType";
import * as api from "../../services";

export const getAllCategories = () => async (dispatch) => {
  try {
    const response = await api.apiGetAllCategories();
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_CATEGORIES,
        categories: response.data.response,
      });
    } else {
      dispatch({
        type: actionTypes.GET_CATEGORIES,
        msg: response.data.msg,
        categories: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_CATEGORIES,
      categories: null,
    });
  }
};

export const getPrices = () => async (dispatch) => {
  try {
    const response = await api.apiGetPrices();
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_PRICES,
        prices: response.data.response.sort((a, b) => {
          return +a.order - +b.order;
        }),
        msg: "",
      });
    } else {
      dispatch({
        type: actionTypes.GET_PRICES,
        msg: response.data.msg,
        prices: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_PRICES,
      prices: null,
      msg: error,
    });
  }
};

export const getAreas = () => async (dispatch) => {
  try {
    const response = await api.apiGetAreas();
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_AREAS,
        areas: response.data.response.sort((a, b) => {
          return +a.order - +b.order;
        }),
        msg: "",
      });
    } else {
      dispatch({
        type: actionTypes.GET_AREAS,
        msg: response.data.msg,
        areas: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_AREAS,
      areas: null,
      msg: error,
    });
  }
};

export const getProvinces = () => async (dispatch) => {
  try {
    const response = await api.apiGetProvinces();
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_PROVINCES,
        provinces: response.data.response,
        msg: "",
      });
    } else {
      dispatch({
        type: actionTypes.GET_PROVINCES,
        msg: response.data.msg,
        provinces: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_PROVINCES,
      provinces: null,
      msg: error,
    });
  }
};

export const getFeatures = () => async (dispatch) => {
  try {
    const response = await api.apiGetFeatures();
    if (response?.data.err === 0) {
      dispatch({
        type: actionTypes.GET_FEATURES,
        features: response.data.response,
      });
    } else {
      dispatch({ type: actionTypes.GET_FEATURES, features: [] });
    }
  } catch (error) {
    dispatch({ type: actionTypes.GET_FEATURES, features: [] });
  }
};
