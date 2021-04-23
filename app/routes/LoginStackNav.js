import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import themes from "../constants/Theme";
// import Parse from "parse/react-native";
import * as firebase from "firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions/actions";

import LoginScreen from "../screens/LoginScreen";
import MainTab from "./MainTabNav";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SpotScreen from "../screens/SpotScreen";
import AddSpotScreen from "../screens/AddSpotScreen";

const CustomDarkTheme = themes.CustomDarkTheme;
const CustomDefaultTheme = themes.CustomDefaultTheme;

const Stack = createStackNavigator();

function LoginStackNav(props) {
  return (
    <NavigationContainer
      theme={props.theme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <Stack.Navigator initialRouteName={"Login"}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default LoginStackNav;
