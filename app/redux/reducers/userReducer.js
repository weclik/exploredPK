import { USER_STATE_CHANGED } from "../actions/types";

const initialState = {
  user: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGED:
      return { ...state, user: action.user };

    default:
      return state;
  }
};
