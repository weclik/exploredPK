import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as Linking from "expo-linking";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { useDispatch, useSelector } from "react-redux";
import { setChallenges } from "../redux/actions/actions";

import IconButton from "../components/IconButton";
import BasicButton from "../components/BasicButton";
import ChallengeView from "../components/ChallengeView";

import * as firebase from "firebase";
import "firebase/firestore";

const Tab = createMaterialTopTabNavigator();

const SpotScreen = (props) => {
  const { spot } = props.route.params;
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const saveChallenges = (challenges) => dispatch(setChallenges(challenges));

  const challenges = useSelector((state) => state.spotsReducer.challenges);

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

    return () => {
      challengeSubscribe();
    };
  }, []);

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: true,
        labelStyle: {
          fontSize: 14,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Info") {
            iconName = focused ? "info-circle" : "info";
          } else if (route.name === "Challenges") {
            iconName = focused ? "trophy" : "trophy";
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
                getRoute();
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
            <BasicButton
              title="Add new challenge"
              onPress={() => {
                props.navigation.navigate("AddChallenge", { spot: spot });
              }}
            />
            {challenges.length !== 0 && (
              <FlatList
                //style={{ }}
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
});
