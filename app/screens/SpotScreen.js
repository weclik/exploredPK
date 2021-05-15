import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Rating, AirbnbRating } from "react-native-ratings";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as Linking from "expo-linking";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { useDispatch, useSelector } from "react-redux";
import { setChallenges, setRating } from "../redux/actions/actions";

import IconButton from "../components/IconButton";
import BasicButton from "../components/BasicButton";
import ChallengeView from "../components/ChallengeView";
import AddCommentModalView from "../components/AddCommentModalView";
import CommentView from "../components/CommentView";

import * as firebase from "firebase";
import "firebase/firestore";

const Tab = createMaterialTopTabNavigator();

const SpotScreen = (props) => {
  const { spot } = props.route.params;
  const { colors } = useTheme();

  const [average, setAverage] = useState(0);

  const [starNum, setStarNum] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonym, setIsAnonym] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const saveChallenges = (challenges) => dispatch(setChallenges(challenges));
  const saveRating = (rating) => dispatch(setRating(rating));

  const rating = useSelector((state) => state.spotsReducer.rating);
  const challenges = useSelector((state) => state.spotsReducer.challenges);
  const username = useSelector((state) => state.userReducer.user.username);

  async function getRoute() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      let source = await Location.getCurrentPositionAsync();
      source = source.coords.latitude + "," + source.coords.longitude;
      let dest = spot.latlng.latitude + "," + spot.latlng.longitude;
      let route = source + "/" + dest;
      Linking.openURL("https://www.google.com/maps/dir/" + route);
    } else {
      alert("Location permission not granted");
    }
  }

  function addRating() {
    firebase
      .firestore()
      .collection("spots")
      .doc(spot.key)
      .collection("rating")
      .doc(firebase.auth().currentUser.uid)
      .set({
        rating: starNum,
        anonymous: isAnonym,
        user: isAnonym ? null : username,
        comment: comment,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
      });
  }

  function ratingWord(value) {
    if (value === 0) {
      return "Unrated";
    } else if (value <= 1) {
      return "Bad";
    } else if (value <= 2) {
      return "Meh";
    } else if (value <= 3) {
      return "Decent";
    } else if (value <= 4) {
      return "Good";
    } else if (value <= 5) {
      return "Excellent";
    }
  }

  function rateSpot() {
    console.log(rating);
    if (rating.find((item) => item.key === firebase.auth().currentUser.uid)) {
      Alert.alert(
        //t("Delete spot"),
        "You already rated this spot!",
        //t("Are you sure you want to delete this spot?"),
        "Do you want to change your rating?",
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
              addRating();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      addRating();
    }
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPress={() => {
            if (firebase.auth().currentUser.uid === spot.createdBy) {
              props.navigation.navigate("EditSpot", { spot: spot });
            } else {
              alert(
                "You have to be creator of the spot to be able to edit it."
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

  useEffect(() => {
    const challengeSubscribe = firebase
      .firestore()
      .collection("challenges")
      .where("onSpot", "==", spot.key)
      .where("public", "==", true)
      .onSnapshot(
        (querySnapshot) => {
          const chlngs = [];

          querySnapshot.forEach((documentSnapshot) => {
            chlngs.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          saveChallenges(chlngs);
        },
        (err) => {
          console.log(err.message);
        }
      );

    const ratingSubscribe = firebase
      .firestore()
      .collection("spots")
      .doc(spot.key)
      .collection("rating")
      .onSnapshot(
        (querySnapshot) => {
          const rtngs = [];

          querySnapshot.forEach((documentSnapshot) => {
            rtngs.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          saveRating(rtngs);

          if (rtngs.length !== 0) {
            let sum = rtngs
              .map(function (item) {
                return item.rating;
              })
              .reduce(function (curval, newval) {
                return curval + newval;
              });
            let avrg = sum / rtngs.length;
            setAverage(avrg);
          }
        },
        (err) => {
          console.log(err.message);
        }
      );

    return () => {
      challengeSubscribe();
      ratingSubscribe();
    };
  }, []);

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        showIcon: true,
        labelStyle: {
          fontSize: 14,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Info") {
            iconName = focused ? "info-circle" : "info-circle";
          } else if (route.name === "Challenges") {
            iconName = focused ? "trophy" : "trophy";
          } else if (route.name === "Comments") {
            iconName = focused ? "comment-dots" : "comment";
          }
          return <FontAwesome5 name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Info">
        {() => (
          <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
          >
            <IconButton
              onPress={() => {
                //props.navigation.navigate("Navigate", { spot: spot });
                Alert.alert(
                  //t("Delete spot"),
                  "Get directions",
                  //t("Are you sure you want to delete this spot?"),
                  "Do you want to get directions to this spot?",
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
                        getRoute();
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={styles.myLocationStyle}
              iconName={"enviromento"}
              iconColor={colors.text}
            />
            <View style={styles.title}>
              <Text style={[styles.titleStyle, { color: colors.title }]}>
                {spot.title}
              </Text>
            </View>
            <Rating
              type="custom"
              ratingColor={colors.title}
              tintColor={colors.background}
              startingValue={average}
              ratingBackgroundColor="lightgrey"
              ratingCount={5}
              imageSize={25}
              readonly={true}
              style={styles.rating}
            />
            <Text
              style={[
                styles.titleStyle,
                { color: colors.text, marginBottom: 10, fontSize: 24 },
              ]}
            >
              {ratingWord(average)}{" "}
              {Math.round((average + Number.EPSILON) * 10) / 10}
            </Text>
            <Image
              style={{
                height: 250,
                width: "90%",
                alignSelf: "center",
                borderRadius: 10,
              }}
              source={{
                uri: spot.imageURL,
              }}
            />
            <View style={styles.description}>
              <Text style={[styles.descText, { color: colors.text }]}>
                {spot.description}
              </Text>
            </View>
          </ScrollView>
        )}
      </Tab.Screen>
      <Tab.Screen name="Challenges">
        {() => (
          <View>
            <Text
              style={[
                styles.titleStyle,
                { color: colors.text, marginVertical: 15 },
              ]}
            >
              {" "}
              Public challenges{" "}
            </Text>

            {challenges.length !== 0 && (
              <FlatList
                style={{ height: "70%" }}
                numColumns={3}
                data={challenges}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <ChallengeView
                    onPress={() =>
                      props.navigation.navigate("Challenge", {
                        challenge: item,
                        spot: spot,
                      })
                    }
                    challenge={item}
                    spot={spot}
                  />
                )}
              />
            )}
            <BasicButton
              title="Add new challenge"
              onPress={() => {
                props.navigation.navigate("AddChallenge", { spot: spot });
              }}
            />
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Comments">
        {() => (
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <AddCommentModalView
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                  onPressRating={(num) => setStarNum(num)}
                  comment={comment}
                  setComment={(cmnt) => setComment(cmnt)}
                  isAnonym={isAnonym}
                  setIsAnonym={() => setIsAnonym(!isAnonym)}
                  onPressButton={() => {
                    rateSpot();
                    console.log(rating);
                  }}
                />
              </View>
            </Modal>

            <Text
              style={[
                styles.titleStyle,
                { color: colors.text, marginVertical: 15 },
              ]}
            >
              {" "}
              Comments{" "}
            </Text>
            {rating.length !== 0 && (
              <FlatList
                style={{ height: "70%" }}
                data={rating}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <CommentView spot={spot} comment={item} />
                )}
              />
            )}
            <BasicButton
              title="Add comment"
              style={{}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            />
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default SpotScreen;

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
    marginHorizontal: 30,
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
  rating: { marginBottom: 10 },
  centeredView: {
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    bottom: 20,
    marginTop: 22,
  },
});
