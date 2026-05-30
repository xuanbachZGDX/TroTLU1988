import actionTypes from "./actionType";
import * as api from "../../services";

export const getAllCategories =
  (force = false) =>
  async (dispatch, getState) => {
    const { app } = getState();
    if (!force && app?.categories?.length > 0) return;
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

export const getPrices = () => async (dispatch, getState) => {
  const { app } = getState();
  if (app?.prices?.length > 0) return;
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

export const getAreas = () => async (dispatch, getState) => {
  const { app } = getState();
  if (app?.areas?.length > 0) return;
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

export const getProvinces = () => async (dispatch, getState) => {
  const { app } = getState();
  if (app?.provinces?.length > 0) return;
  try {
    const response = await api.apiGetPublicProvinces();
    if (response?.status === 200) {
      dispatch({
        type: actionTypes.GET_PROVINCES,
        provinces: response.data.map((p) => ({
          code: p.code,
          value: p.name,
        })),
        msg: "",
      });
    } else {
      dispatch({
        type: actionTypes.GET_PROVINCES,
        msg: "Thất bại khi lấy tỉnh thành",
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

export const getFeatures = () => async (dispatch, getState) => {
  const { app } = getState();
  if (app?.features?.length > 0) return;
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

export const apiGetDistricts = (provinceCode) => async (dispatch) => {
  try {
    const response = await api.apiGetPublicDistrict(provinceCode);
    if (response?.status === 200) {
      return {
        data: {
          err: 0,
          response: (response.data.districts || []).map((d) => ({
            code: d.code,
            value: d.name,
          })),
        },
      };
    }
    return { data: { err: 1, response: [] } };
  } catch (error) {
    return { data: { err: 1, response: [] } };
  }
};
export const apiGetPrices = api.apiGetPrices;
export const apiGetAreas = api.apiGetAreas;
export const apiGetProvinces = api.apiGetProvinces;

export const loading = (flag) => ({
  type: actionTypes.LOADING,
  flag,
});
