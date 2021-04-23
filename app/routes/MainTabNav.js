import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch } from "react-redux";
import { setSpots, setUser } from "../redux/actions/actions";
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
  const saveUser = (username) => dispatch(setUser(username));

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        // value previously stored
        saveUser(value);
      }
    } catch (error) {
      // error reading value
      console.log(error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    getUsername();

    const spotsSubscribe = firebase
      .firestore()
      .collection("spots")
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
      console.log("Tab unmount");
      spotsSubscribe();
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
