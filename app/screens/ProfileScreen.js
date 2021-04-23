import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
//import Parse from "parse/react-native";
import * as firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BasicButton from "../components/BasicButton";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/actions/actions";

export default function ProfileScreen(props) {
  const [loggedOut, setLoggedOut] = useState(false);

  const username = useSelector((state) => state.userReducer.user);
  const spots = useSelector((state) => state.spotsReducer.spots);
  const dispatch = useDispatch();

  const unsetUser = (user) => dispatch(setUser(user));

  function onLogOut() {
    // try {
    //   Parse.User.logOut()
    //     .then(() => {
    //       console.log("Logged out.");
    //       setLoggedOut(true);
    //       unsetUser(null);

    //       props.navigation.replace("Login");
    //     })
    //     .catch((error) => {
    //       console.log(error.message);
    //       alert(error.message);
    //     });
    // } catch (error) {
    //   console.log(error.message);
    //   alert(error.message);
    // }

    //props.navigation.replace("Login");
    try {
      AsyncStorage.setItem("username", "").then();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    firebase.auth().signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={{ alignSelf: "center", fontSize: 30 }}>{username}</Text>
      <BasicButton
        title="Log out"
        onPress={() => {
          Alert.alert(
            //t("Log Out"),
            "Log Out",
            //t("Are you sure you want to log out?"),
            "Are you sure you want to log out?",
            [
              {
                //text: t("Cancel"),
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                //text: t("Yes"),
                text: "Yes",
                onPress: () => {
                  console.log("yes Pressed");
                  onLogOut();
                },
              },
            ],
            { cancelable: false }
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
