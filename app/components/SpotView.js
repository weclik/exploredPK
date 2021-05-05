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

//import "../i18n";
//import { useTranslation } from "react-i18next";

function SpotView(props) {
  const { colors } = useTheme();
  const [author, setAuthor] = useState("");

  useEffect(() => {
    getUsername();
  }, []);

  //const { t, i18n } = useTranslation();

  const getUsername = async () => {
    try {
      firebase
        .firestore()
        .collection("users")
        .doc(props.createdBy)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setAuthor(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
    } catch (error) {
      // error reading value
      console.log(error.message);
      alert(error.message);
    }
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.spotBg }]}
      onPress={props.onPress}
    >
      <Image
        style={{
          flex: 1,
          height: Dimensions.get("window").height / 3,
          width: "100%",
          //alignSelf: "center",
          borderRadius: 5,
          //marginBottom: 20,
          borderWidth: 1,
          borderColor: "grey",
          resizeMode: "cover",
        }}
        source={{
          uri: props.image,
        }}
      />
      <View style={styles.txtContainer}>
        <View style={styles.txt}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.titleStyle, styles.txtShadow]}
          >
            {props.title}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.descStyle, styles.txtShadow]}
          >
            {props.description}
          </Text>
        </View>
        <Text
          ellipsizeMode="tail"
          style={[
            styles.txtShadow,
            {
              position: "absolute",
              bottom: 15,
              right: 15,
              fontSize: 14,
              color: "white",
              marginRight: 10,
            },
          ]}
        >
          {author.username}
        </Text>
      </View>
      <IconButton
        onPress={() => {
          if (firebase.auth().currentUser.uid === props.createdBy) {
            Alert.alert(
              //t("Delete spot"),
              "Delete spot",
              //t("Are you sure you want to delete this spot?"),
              "Are you sure you want to delete this spot?",
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
                      .doc(props.objectId)
                      .delete()
                      .then(() => {
                        console.log("Document successfully deleted!");
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
              "You have to be creator of the spot to be able to delete it."
            );
          }
        }}
        iconName={"close"}
        style={{ top: 15, right: 15, borderWidth: 0.5, borderColor: "grey" }}
        iconColor="white"
        showShadow={true}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 20,
  },
  txtContainer: {
    flexDirection: "row",
  },
  txt: {
    position: "absolute",
    bottom: 15,
    left: 15,
  },
  titleStyle: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  descStyle: {
    fontSize: 16,
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

export default SpotView;
