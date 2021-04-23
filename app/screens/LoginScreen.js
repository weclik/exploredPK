import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as firebase from "firebase";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions/actions";

import BasicButton from "../components/BasicButton";

export default function LoginScreen(props) {
  const { colors } = useTheme();

  const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");

  function onLogIn() {
    if (username === "") {
      //setError(t("Fill the fields correctly."));
      //alert(loginError);
      alert("Fill the fields correctly!");
    } else {
      firebase
        .auth()
        .signInAnonymously()
        .then(() => {
          //saveUser(username);
          try {
            AsyncStorage.setItem("username", username).then();
          } catch (error) {
            console.log(error.message);
            alert(error.message);
          }
        })
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    }
  }

  return (
    <ScrollView
      //contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={[styles.titleStyle, { color: colors.title }]}>
            Explored
          </Text>
          <Text style={[styles.titleStyle2, { color: colors.title }]}>
            Parkour spots
          </Text>
        </View>
        <View style={styles.welcome}>
          <Text style={[styles.welcomeStyle, { color: colors.text }]}>
            {/* {t("Welcome")} */}Welcome
          </Text>
        </View>
        <View style={styles.inputStyle}>
          <TextInput
            style={[
              {
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: colors.bgInput,
              },
              styles.txtInput,
            ]}
            //returnKeyType="done"
            autoCapitalize={"none"}
            autoCorrect={false}
            placeholder="Username"
            placeholderTextColor={colors.placeholder}
            onChangeText={(text) => setUsername(text)}
            value={username}
            elevation={5}
          />
          {/* <TextInput
            style={[
              {
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: colors.bgInput,
              },
              styles.txtInput,
            ]}
            autoCapitalize={"none"}
            autoCompleteType={"password"}
            autoCorrect={false}
            textContentType={"password"}
            placeholder="Password"
            placeholderTextColor={colors.placeholder}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            elevation={5}
          /> */}
        </View>
        <View style={styles.buttonStyle}>
          <BasicButton
            title="Login"
            onPress={() => {
              onLogIn();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 50,

    //fontFamily: "Righteous_400Regular",
    alignSelf: "center",
  },
  titleStyle2: {
    fontSize: 20,
    //fontFamily: "Righteous_400Regular",
    alignSelf: "center",
  },
  title: {
    top: 40,

    marginBottom: 20,
  },
  welcome: {
    marginVertical: 30,
  },
  welcomeStyle: {
    fontSize: 40,

    alignSelf: "center",
  },
  buttonStyle: {
    flexDirection: "row",
    marginBottom: 20,
    alignSelf: "center",
  },
  inputStyle: {
    marginTop: 50,
    marginBottom: 100,
  },
  txtInput: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },
});
