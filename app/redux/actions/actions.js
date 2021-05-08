import {
  USER_STATE_CHANGED,
  USERSPOTS_STATE_CHANGED,
  USERCHALLENGES_STATE_CHANGED,
  USER_CHALLENGES_DONE_CHANGED,
  SPOTS_STATE_CHANGED,
  CHALLENGES_STATE_CHANGED,
  RATING_STATE_CHANGED,
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
  // return (dispatch) => {
  //   firebase
  //     .firestore()
  //     .collection("spots")
  //     .where("public", "==", true)
  //     .onSnapshot(
  //       (querySnapshot) => {
  //         const spts = [];

  //         querySnapshot.forEach((documentSnapshot) => {
  //           spts.push({
  //             ...documentSnapshot.data(),
  //             key: documentSnapshot.id,
  //           });
  //         });

  //         dispatch({ type: SPOTS_STATE_CHANGED, spots: spts });
  //       },
  //       (err) => {
  //         console.log(err.message);
  //       }
  //     );
  // };
  return { type: SPOTS_STATE_CHANGED, spots: spots };
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

export const setUserChallenges = (spots) => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("challenges")
      .where("createdBy", "==", firebase.auth().currentUser.uid)
      .onSnapshot(
        (querySnapshot) => {
          const chlngs = [];

          querySnapshot.forEach((documentSnapshot) => {
            chlngs.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          dispatch({
            type: USERCHALLENGES_STATE_CHANGED,
            userChallenges: chlngs,
          });
        },
        (err) => {
          console.log(err.message);
        }
      );
  };
};

export const setUserChallengesDone = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("challengesDone")
      .onSnapshot(
        (querySnapshot) => {
          const chlngs = [];

          querySnapshot.forEach((documentSnapshot) => {
            chlngs.push(documentSnapshot.id);
          });

          dispatch({
            type: USER_CHALLENGES_DONE_CHANGED,
            userChallengesDone: chlngs,
          });
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

export const setRating = (rating) => {
  return { type: RATING_STATE_CHANGED, rating: rating };
};
