import {
  USER_STATE_CHANGED,
  SPOT_ADDED,
  SPOT_DELETED,
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

    case SPOT_ADDED:
      return { ...state, spots: state.spots.concat(action.spot) };

    case SPOT_DELETED:
      return {
        ...state,
        spots: state.spots.filter((item) => item.id !== action.spot.id),
      };
    case CHALLENGES_STATE_CHANGED:
      return {
        ...state,
        challenges: action.challenges,
      };
    case CLEAR_DATA:
      return {
        ...state,
        spots: initialState,
      };

    default:
      return state;
  }
};
