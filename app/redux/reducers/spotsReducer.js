import {
  USER_STATE_CHANGED,
  SPOTS_STATE_CHANGED,
  CHALLENGES_STATE_CHANGED,
  CLEAR_DATA,
} from "../actions/types";

const initialState = {
  spots: [],
  challenges: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SPOTS_STATE_CHANGED:
      return { ...state, spots: action.spots };

    case CHALLENGES_STATE_CHANGED:
      return {
        ...state,
        challenges: action.challenges,
      };
    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};
