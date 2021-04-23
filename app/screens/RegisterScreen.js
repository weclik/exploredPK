import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";

import { useTheme } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions/actions";

import BasicButton from "../components/BasicButton";

export default function RegisterScreen(props) {
  const { colors } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState("");

  const dispatch = useDispatch();

  const saveUser = (user) => dispatch(setUser(user));

  function submitAndClear() {
    setUsername("");
    setPassword("");
    setVerPassword("");
  }

  function onSignUp() {
    if (username === "" || password === "" || verPassword === "") {
      //alert(t("Fill the fields correctly."));
      alert("Fill the fields correctly.");
    } else {
      try {
        Parse.User.logOut();
        let user = new Parse.User();
        user.set("username", username);
        user.set("password", password);
        const result = user
          .signUp()
          .then((user) => {
            submitAndClear();
            saveUser(user);

            props.navigation.replace("MainTab");
          })
          .catch((error) => {
            console.log(error.message);
            if (error.code === 202) {
              console.log("USERNAME TAKEN");
              //alert(t("Username taken!"));
              alert("Username taken.");
            }
          });
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
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
            Sign Up
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
            autoCapitalize={"none"}
            autoCorrect={false}
            placeholder="Username"
            placeholderTextColor={colors.placeholder}
            onChangeText={(text) => setUsername(text)}
            value={username}
            elevation={5}
          />
          <TextInput
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
          />
          <TextInput
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
            placeholder="Verify password"
            placeholderTextColor={colors.placeholder}
            onChangeText={(text) => setVerPassword(text)}
            value={verPassword}
            secureTextEntry={true}
            elevation={5}
          />
        </View>
        <View style={styles.buttonStyle}>
          <BasicButton
            title="Sign Up"
            onPress={() => {
              onSignUp();
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
    alignSelf: "center",
  },
  titleStyle2: {
    fontSize: 20,
    alignSelf: "center",
  },
  title: {
    top: 20,
    //flex: 5,
    alignContent: "center",
    //justifyContent: "center",
  },
  buttonStyle: {
    //flex: 2,
    justifyContent: "center",
    //flexDirection: "row",
    marginBottom: 40,
  },
  inputStyle: {
    //flex: 3,
    //height: "50%",
    marginTop: 50,
    marginBottom: 100,
    //justifyContent: "center",
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
