import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Appearance,
  useColorScheme,
} from "react-native";
//import { AppearanceProvider, Appearance } from "react-native-appearance";
import themes from "./app/constants/Theme";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginStackNav from "./app/routes/LoginStackNav";
import MainTab from "./app/routes/MainTabNav";
import SpotScreen from "./app/screens/SpotScreen";
import AddSpotScreen from "./app/screens/AddSpotScreen";
import ChallengeScreen from "./app/screens/ChallengeScreen";
import EditSpotScreen from "./app/screens/EditSpotScreen";
import EditChallengeScreen from "./app/screens/EditChallengeScreen";
import AddChallengeScreen from "./app/screens/AddChallengeScreen";
import NavigateScreen from "./app/screens/NavigateScreen";
import * as firebase from "firebase";

import { store } from "./app/redux/store";
import { Provider } from "react-redux";

const firebaseConfig = {
  apiKey: "AIzaSyDZtOtAaY01S41L2uyVowApNZkAALonsGk",
  authDomain: "exploredapp.firebaseapp.com",
  projectId: "exploredapp",
  storageBucket: "exploredapp.appspot.com",
  messagingSenderId: "611646677595",
  appId: "1:611646677595:web:61e525abe482c4194ad57e",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const CustomDarkTheme = themes.CustomDarkTheme;
const CustomDefaultTheme = themes.CustomDefaultTheme;

const Stack = createStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();

  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let onAuthStateSub = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true);
        setLoggedIn(false);
      } else {
        //console.log(user);
        setLoaded(true);
        setLoggedIn(true);
      }
    });

    return () => {
      onAuthStateSub();
    };
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0088ee" />
      </View>
    );
  }

  if (!loggedIn) {
    return (
      //<Provider store={store()}>
      // <AppearanceProvider>
      <LoginStackNav theme={colorScheme} />
      // </AppearanceProvider>
      //</Provider>
    );
  }

  return (
    <Provider store={store()}>
      {/* <AppearanceProvider> */}
      <NavigationContainer
        theme={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <Stack.Navigator initialRouteName={"MainTab"}>
          <Stack.Screen
            name="MainTab"
            component={MainTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Spot"
            component={SpotScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="AddSpot"
            component={AddSpotScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Challenge"
            component={ChallengeScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="EditSpot"
            component={EditSpotScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="EditChallenge"
            component={EditChallengeScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="AddChallenge"
            component={AddChallengeScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Navigate"
            component={NavigateScreen}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* </AppearanceProvider> */}
    </Provider>
  );
}
