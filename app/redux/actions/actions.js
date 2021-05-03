import {
  USER_STATE_CHANGED,
  USERSPOTS_STATE_CHANGED,
  SPOTS_STATE_CHANGED,
  CHALLENGES_STATE_CHANGED,
  CLEAR_DATA,
} from "./types";
import * as firebase from "firebase";
import "firebase/firestore";

export function clearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}

export const setUser = (user) => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGED, user: snapshot.data() });
        } else {
          console.log("does not exist");
        }
      });
  };
};

export const setSpots = (spots) => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("spots")
      .where("public", "==", true)
      .onSnapshot(
        (querySnapshot) => {
          const spts = [];

          querySnapshot.forEach((documentSnapshot) => {
            spts.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          dispatch({ type: SPOTS_STATE_CHANGED, spots: spts });
        },
        (err) => {
          console.log(err.message);
        }
      );
  };
};

export const setUserSpots = (spots) => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("spots")
      .where("createdBy", "==", firebase.auth().currentUser.uid)
      .onSnapshot(
        (querySnapshot) => {
          const spts = [];

          querySnapshot.forEach((documentSnapshot) => {
            spts.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          dispatch({ type: USERSPOTS_STATE_CHANGED, userSpots: spts });
        },
        (err) => {
          console.log(err.message);
        }
      );
  };
};

export const setChallenges = (challenges) => {
  return { type: CHALLENGES_STATE_CHANGED, challenges: challenges };
};
