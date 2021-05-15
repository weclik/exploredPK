import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import IconButton from "./IconButton";
import { Rating } from "react-native-ratings";

//import "../i18n";
//import { useTranslation } from "react-i18next";

function CommentView(props) {
  const { colors } = useTheme();
  const { comment } = props;
  const { spot } = props;

  //const { t, i18n } = useTranslation();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.spotBg }]}
      onPress={props.onPress}
    >
      <Rating
        type="custom"
        ratingColor={colors.title}
        tintColor={colors.spotBg}
        startingValue={comment.rating}
        ratingBackgroundColor="lightgrey"
        ratingCount={5}
        imageSize={20}
        readonly={true}
        style={{ marginBottom: 5 }}
      />
      <Text style={[styles.titleStyle, { color: colors.text }]}>
        {comment.anonymous ? "Anonymous" : comment.user}
      </Text>
      <View style={styles.desc}>
        <Text
          numberOfLines={2}
          ellipsizeMode="clip"
          style={[styles.descStyle, { color: colors.text }]}
        >
          {comment.comment}
        </Text>
      </View>
      <IconButton
        onPress={() => {
          if (firebase.auth().currentUser.uid === comment.key) {
            Alert.alert(
              //t("Delete spot"),
              "Delete comment",
              //t("Are you sure you want to delete this spot?"),
              "Are you sure you want to delete this comment?",
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
                      .collection("spots")
                      .doc(spot.key)
                      .collection("rating")
                      .doc(comment.key)
                      .delete()
                      .then(() => {
                        console.log("Comment successfully deleted!");
                        Alert.alert("Delete successful.");
                      })
                      .catch((error) => {
                        console.error("Error removing document: ", error);
                      });
                  },
                },
              ],
              { cancelable: false }
            );
          } else {
            //Alert.alert(t("You have to be creator of the spot."));
            Alert.alert(
              "You have to be creator of the comment to be able to delete it."
            );
          }
        }}
        iconName={"close"}
        style={{ top: 5, right: 15 }}
        iconColor="black"
        showShadow={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: 120,
    marginBottom: 10,
  },
  titleStyle: {
    fontSize: 20,
    //color: "white",
    fontWeight: "bold",
  },
  desc: {
    width: "90%",
  },
  descStyle: {
    fontSize: 15,
  },
});

export default CommentView;
