import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
//import * as Permissions from "expo-permissions";

import BasicButton from "../components/BasicButton";

const EditSpotScreen = (props) => {
  const { colors } = useTheme();

  async function getImageAsync() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
    if (status === "granted") {
      pickImage();
    } else {
      alert("Permission wasn't granted!");
    }
  }

  const { spot } = props.route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(spot?.imageURL);

  const [title, setTitle] = useState(spot?.title);
  const [description, setDescription] = useState(spot?.description);

  const username = useSelector((state) => state.userReducer.user);

  async function editSpot() {
    if (title === "" || description === "" || image === null) {
      alert("Please fill all of the fields correctly.");
    } else {
      console.log(spot);
      try {
        firebase
          .firestore()
          .collection("spots")
          .doc(spot.key)
          .update({ title: title, description: description, imageURL: image })
          .then(() => {
            alert("Edited successfully.");
            props.navigation.goBack();
          })
          .catch((error) => {
            console.log(error.message);
            alert(error.message);
          });
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    }
  }

  //UPLOAD IMAGE
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    setIsLoading(true);

    let ref = firebase
      .storage()
      .ref()
      .child("spots/" + username + Date.parse(new Date()) + "-photo.jpg");
    await ref.put(blob);
    let extUri = await ref.getDownloadURL();

    setIsLoading(false);
    setImage(extUri);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result.uri);
    if (result && !result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    } else {
      console.log("canceled");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0088ee" />
      </View>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={[styles.titleStyle, { color: colors.title }]}>
            Edit spot
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
            placeholder="Spot name"
            placeholderTextColor={colors.placeholder}
            onChangeText={(text) => setTitle(text)}
            value={title}
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
            placeholder="Description"
            placeholderTextColor={colors.placeholder}
            onChangeText={(text) => setDescription(text)}
            value={description}
            elevation={5}
          />

          <Text
            style={{
              color: colors.primary,
              fontWeight: "700",
              fontSize: 15,
              alignSelf: "center",
              marginTop: 15,
              marginBottom: 15,
            }}
            onPress={() => {
              getImageAsync();
            }}
          >
            Change spot image
          </Text>

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: "90%", height: 200, alignSelf: "center" }}
            />
          )}
        </View>
        <View style={styles.buttonStyle}>
          <BasicButton
            title="Edit spot"
            onPress={() => {
              console.log("spot edited");
              editSpot();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditSpotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 50,
    alignSelf: "center",
  },
  title: {
    top: 20,

    alignContent: "center",
  },
  buttonStyle: {
    justifyContent: "center",

    marginBottom: 30,
  },
  inputStyle: {
    marginTop: 20,
    marginBottom: 30,
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
