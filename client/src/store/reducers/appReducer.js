import actionTypes from "../actions/actionType";

const initState = {
  msg: "",
  categories: [],
  prices: [],
  areas: [],
  provinces: [],
  features: [],
  isLoading: false,
};

const appReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.GET_CATEGORIES:
      return {
        ...state,
        categories: action.categories || [],
        msg: action.msg || "",
      };
    case actionTypes.GET_PRICES:
      return {
        ...state,
        prices: action.prices || [],
        msg: action.msg || "",
      };
    case actionTypes.GET_AREAS:
      return {
        ...state,
        areas: action.areas || [],
        msg: action.msg || "",
      };
    case actionTypes.GET_PROVINCES:
      return {
        ...state,
        provinces: action.provinces || [],
        msg: action.msg || "",
      };

    case actionTypes.GET_FEATURES:
      return {
        ...state,
        features: action.features || [],
      };
    case actionTypes.LOADING:
      return {
        ...state,
        isLoading: action.flag,
      };

    default:
      return state;
  }
};

export default appReducer;
