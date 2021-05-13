import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";

import { useTheme } from "@react-navigation/native";

import firebase from "firebase";
import "firebase/firestore";

import BasicButton from "../components/BasicButton";

export default function RegisterScreen(props) {
  const { colors } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState("");

  function onSignUp() {
    if (
      username === "" ||
      password === "" ||
      verPassword === "" ||
      email === ""
    ) {
      Alert.alert(
        //t("Delete spot"),
        "Empty fields",
        //t("Are you sure you want to delete this spot?"),
        "Please fill all the fields correctly",
        [
          {
            //text: t("Cancel"),
            text: "Ok",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } else {
      try {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((result) => {
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({
                username,
                email,
              });
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
            alert(error.message);
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
            autoCorrect={false}
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            onChangeText={(text) => setEmail(text)}
            value={email}
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
              if (password === verPassword) {
                onSignUp();
              } else {
                alert("Not matching passwords!");
              }
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
