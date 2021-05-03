import {
  USER_STATE_CHANGED,
  USERSPOTS_STATE_CHANGED,
  USER_CHALLENGES_DONE_CHANGED,
  CLEAR_DATA,
} from "../actions/types";

const initialState = {
  user: {},
  userSpots: [],
  userChallengesDone: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGED:
      return { ...state, user: action.user };
    case USERSPOTS_STATE_CHANGED:
      return { ...state, userSpots: action.userSpots };
    case USER_CHALLENGES_DONE_CHANGED:
      return { ...state, userChallengesDone: action.userChallengesDone };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
