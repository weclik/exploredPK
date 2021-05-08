import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  Alert,
  Switch,
} from "react-native";
import Checkbox from "expo-checkbox";

import * as firebase from "firebase";
import "firebase/firestore";

import { useDispatch, useSelector } from "react-redux";
import { setUserChallengesDone } from "../redux/actions/actions";

import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import IconButton from "./IconButton";

//import "../i18n";
//import { useTranslation } from "react-i18next";

function ChallengeView(props) {
  const { colors } = useTheme();

  const { challenge } = props;

  const dispatch = useDispatch();

  const chlngs = useSelector((state) => state.userReducer.userChallengesDone);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (!isEnabled) {
      challengeDone();
    } else {
      challengeNotDone();
    }
  };

  function challengeDone() {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("challengesDone")
      .doc(challenge.key)
      .set({})
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
      });
  }

  function challengeNotDone() {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("challengesDone")
      .doc(challenge.key)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
      });
  }

  useEffect(() => {
    if (chlngs.indexOf(challenge.key) > -1) {
      setIsEnabled(true);
    }
  }, [chlngs, challenge]);

  //const { t, i18n } = useTranslation();

  return (
    <Pressable
      onPress={props.onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.spotBg,
        },
      ]}
    >
      <Image
        style={{
          flex: 1,
          height: Dimensions.get("window").height / 3,
          width: "100%",
          borderRadius: 5,
          borderWidth: isEnabled ? 3 : 1,
          borderColor: isEnabled ? "green" : "lightgrey",
          resizeMode: "cover",
        }}
        source={{
          uri: challenge?.photoURL,
        }}
      />
      <View style={styles.txtContainer}>
        <View style={styles.txt}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.titleStyle, styles.txtShadow]}
          >
            {challenge?.name}
          </Text>
        </View>
      </View>
      {/* <Switch
        style={styles.switch}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "green" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isEnabled}
      /> */}
      <Checkbox
        style={[styles.switch, styles.txtShadow]}
        value={isEnabled}
        onValueChange={toggleSwitch}
        color={isEnabled ? "black" : "black"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    //borderBottomWidth: 1,
    //borderColor: "lightgrey",
    //borderRadius: 20,
    margin: 5,
    flex: 1 / 3,
  },
  txtContainer: {
    flexDirection: "row",
  },
  txt: {
    position: "absolute",
    bottom: 15,
    left: 5,
    width: "90%",
  },
  switch: {
    position: "absolute",
    top: 15,
    right: 5,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: "black",
  },
  titleStyle: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  descStyle: {
    fontSize: 10,
    color: "white",
    marginRight: 10,
    width: "80%",
    marginBottom: 10,
  },
  txtShadow: {
    textShadowColor: "rgba(0,0,0,0.80)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ChallengeView;
