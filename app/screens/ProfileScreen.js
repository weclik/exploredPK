import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, FlatList } from "react-native";

import * as firebase from "firebase";
import { useTheme } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import IconButton from "../components/IconButton";

import SpotView from "../components/SpotView";
import ChallengeView from "../components/ChallengeView";
import { useSelector } from "react-redux";

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen(props) {
  const { colors } = useTheme();

  const username = useSelector((state) => state.userReducer.user.username);
  const userSpots = useSelector((state) => state.userReducer.userSpots);
  const userChallenges = useSelector(
    (state) => state.userReducer.userChallenges
  );

  function onLogOut() {
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
            firebase.auth().signOut();
          },
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.name, { color: colors.text }]}>{username}</Text>
      <IconButton
        onPress={() => {
          onLogOut();
        }}
        iconName={"logout"}
        style={{ right: 20, top: 20 }}
        iconColor={colors.text}
        showShadow={false}
      />
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
        <Tab.Screen name="My Spots">
          {() => (
            <View style={styles.container}>
              <FlatList
                style={{ flex: 1 }}
                data={userSpots}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <SpotView
                    title={item.title}
                    description={item.description}
                    image={item.imageURL}
                    onPress={() => {
                      props.navigation.navigate("Spot", {
                        spot: item,
                      });
                      console.log("Pressed");
                    }}
                    createdBy={item.createdBy}
                    objectId={item.key}
                  />
                )}
              />
            </View>
          )}
        </Tab.Screen>
        <Tab.Screen name="My challenges">
          {() => (
            <View>
              {userChallenges.length !== 0 && (
                <FlatList
                  //style={{ }}
                  numColumns={3}
                  data={userChallenges}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item }) => (
                    <ChallengeView
                      onPress={() =>
                        props.navigation.navigate("Challenge", {
                          challenge: item,
                          //spot: spot,
                        })
                      }
                      challenge={item}
                    />
                  )}
                />
              )}
            </View>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  name: { alignSelf: "center", fontSize: 30, marginVertical: 15 },
});
