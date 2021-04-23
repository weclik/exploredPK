import {
  USER_STATE_CHANGED,
  SPOT_ADDED,
  SPOT_DELETED,
  SPOTS_STATE_CHANGED,
  CHALLENGES_STATE_CHANGED,
  CLEAR_DATA,
} from "./types";

export const setUser = (user) => {
  return { type: USER_STATE_CHANGED, user: user };
};

export const addSpot = (spot) => {
  return { type: SPOT_ADDED, spot: spot };
};

export const deleteSpot = (spot) => {
  return { type: SPOT_DELETED, spot: spot };
};

export const setSpots = (spots) => {
  return { type: SPOTS_STATE_CHANGED, spots: spots };
};

export const setChallenges = (challenges) => {
  return { type: CHALLENGES_STATE_CHANGED, challenges: challenges };
};

export const clear = () => {
  return { type: CLEAR_DATA, spot: [] };
};
