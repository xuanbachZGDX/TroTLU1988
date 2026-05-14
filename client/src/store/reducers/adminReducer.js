import actionTypes from "../actions/actionType";

const initState = {
  dashboard: {},
  posts: [],
  postCount: 0,
  users: [],
  userCount: 0,
};

const adminReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.GET_ADMIN_DASHBOARD:
      return {
        ...state,
        dashboard: action.dashboard || {},
      };

    case actionTypes.GET_ADMIN_POSTS:
      return {
        ...state,
        posts: action.posts || [],
        postCount: action.count || 0,
      };

    case actionTypes.GET_ADMIN_USERS:
      return {
        ...state,
        users: action.users || [],
        userCount: action.count || 0,
      };

    case actionTypes.LOGOUT:
      return initState;

    default:
      return state;
  }
};

export default adminReducer;
