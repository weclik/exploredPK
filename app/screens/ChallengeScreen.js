import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  Alert,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

import IconButton from "../components/IconButton";

const ChallengeScreen = (props) => {
  const { challenge } = props.route.params;
  //const { spot } = props.route.params;
  const { colors } = useTheme();

  const chlngs = useSelector((state) => state.userReducer.userChallengesDone);
  const spot = useSelector((state) => state.spotsReducer.spots).find((spot) => {
    return spot.key === challenge.onSpot;
  });
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (chlngs.indexOf(challenge.key) > -1) {
      setIsDone(true);
    }
  }, [challenge]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPress={() => {
            if (firebase.auth().currentUser.uid === challenge.createdBy) {
              props.navigation.navigate("EditChallenge", {
                spot: spot,
                challenge: challenge,
              });
            } else {
              alert(
                "You have to be creator of this challenge to be able to edit it."
              );
            }
          }}
          iconName="edit"
          style={{ right: 15, bottom: 5 }}
          iconColor={colors.text}
        />
      ),
    });
  }, [props.navigation]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <IconButton
        onPress={() => {
          Alert.alert(
            //t("Delete spot"),
            "Delete challenge",
            //t("Are you sure you want to delete this spot?"),
            "Are you sure you want to delete this challenge?",
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
                  firebase
                    .firestore()
                    .collection("challenges")
                    .doc(challenge.key)
                    .delete()
                    .then(() => {
                      console.log("Document successfully deleted!");
                      Alert.alert("Delete successful.");
                      props.navigation.goBack();
                    })
                    .catch((error) => {
                      console.error("Error removing document: ", error);
                    });
                },
              },
            ],
            { cancelable: false }
          );
        }}
        iconName={"close"}
        style={{ top: 15, right: 15, borderWidth: 0.5, borderColor: "grey" }}
        iconColor={colors.text}
        showShadow={false}
      />
      <View style={styles.title}>
        <Text style={[styles.titleStyle, { color: colors.title }]}>
          {challenge?.name}
        </Text>
        {isDone && <Text style={{ color: "green", fontSize: 20 }}>DONE</Text>}
      </View>
      <Text
        onPress={() => props.navigation.navigate("Spot", { spot: spot })}
        style={[
          {
            color: colors.text,
            fontSize: 20,
            marginLeft: 20,
            marginBottom: 10,
          },
        ]}
      >
        On spot: {spot?.title}
      </Text>
      <Image
        style={{
          height: 250,
          width: "90%",
          alignSelf: "center",
          borderRadius: 10,
        }}
        source={{
          uri: challenge?.photoURL,
        }}
      />
      <View style={styles.description}>
        <Text style={[styles.descText, { color: colors.text }]}>
          {challenge?.description}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ChallengeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 30,
    alignSelf: "center",
  },
  title: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
    marginTop: 15,
  },
  description: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  descText: {
    fontSize: 18,
    alignSelf: "center",
  },
  myLocationStyle: {
    position: "absolute",
    top: 33,
    right: 20,
    zIndex: 2,
    padding: 5,
    borderRadius: 20,
  },
});
