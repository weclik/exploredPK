import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch } from "react-redux";
import {
  setSpots,
  setUser,
  setUserSpots,
  setUserChallenges,
  setUserChallengesDone,
  clearData,
} from "../redux/actions/actions";
import * as firebase from "firebase";
import "firebase/firestore";

import { FontAwesome5 } from "@expo/vector-icons";

import MapScreen from "../screens/MapScreen";
import SpotListScreen from "../screens/SpotListScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNav() {
  const dispatch = useDispatch();

  const saveSpots = (spots) => dispatch(setSpots(spots));

  useEffect(() => {
    dispatch(clearData());
    dispatch(setUser());
    dispatch(setUserSpots());
    dispatch(setUserChallenges());
    dispatch(setUserChallengesDone());

    let spotSubscribe = firebase
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

          saveSpots(spts);
        },
        (err) => {
          console.log(err.message);
        }
      );

    return () => {
      spotSubscribe();
      console.log("Tab unmount");
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Spots"
      tabBarOptions={{
        showLabel: false,
        labelStyle: {
          fontSize: 13,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Map") {
            iconName = focused ? "map-marked" : "map";
          } else if (route.name === "Spots") {
            iconName = focused ? "list" : "list-alt";
          } else if (route.name === "Profile") {
            iconName = focused ? "user-alt" : "user";
          }
          return <FontAwesome5 name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Spots"
        component={SpotListScreen}
        options={{
          headerShown: true,
          //unmountOnBlur: true,
        }}
      >
        {/* {(props) => <SpotListScreen {...props} name={name} spots={spots} />} */}
      </Tab.Screen>
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: true,
          //unmountOnBlur: true,
        }}
      >
        {/* {(props) => <MapScreen {...props} name={name} spots={spots} />} */}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          //unmountOnBlur: true,
        }}
      >
        {/* {(props) => <ProfileScreen {...props} name={name} />} */}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
