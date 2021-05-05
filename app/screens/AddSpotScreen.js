import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Switch,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { useSelector } from "react-redux";

import BasicButton from "../components/BasicButton";

const AddSpotScreen = (props) => {
  const { colors } = useTheme();

  async function getImageAsync() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    if (status === "granted") {
      pickImage();
    } else {
      alert("Permission wasn't granted!");
    }
  }

  const { marker } = props.route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isPublic, setIsPublic] = useState(false);
  const toggleSwitch = () => {
    setIsPublic((previousState) => !previousState);
  };

  const username = useSelector((state) => state.userReducer.user.username);

  async function saveSpot() {
    if (
      title === "" ||
      latitude === "" ||
      longitude === "" ||
      description === "" ||
      image === null
    ) {
      alert("Please fill all of the fields correctly.");
    } else {
      let geoPoint = new firebase.firestore.GeoPoint(
        Number(latitude),
        Number(longitude)
      );
      let spot = {
        title: title,
        latlng: geoPoint,
        description: description,
        imageURL: image,
        createdBy: firebase.auth().currentUser.uid,
        public: isPublic,
      };
      console.log(spot);

      firebase
        .firestore()
        .collection("spots")
        .doc()
        .set(spot)
        .then(() => {
          alert("Added successfully.");
          props.navigation.goBack();
        })
        .catch((error) => {
          console.log(error.message);
          alert(error.message);
        });
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

  function setCoords() {
    if (marker) {
      setLatitude(marker.latitude);
      setLongitude(marker.longitude);
    }
  }

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

  useEffect(() => {
    setCoords();
  }, []);

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
            Add spot
          </Text>
          <Text
            style={{
              color: colors.text,
              marginLeft: 10,
              fontSize: 15,
              marginTop: 10,
            }}
          >
            Created by: {username}
          </Text>
        </View>
        <BasicButton
          style={{ marginTop: 50 }}
          title="Pick a spot on the map"
          onPress={() => {
            console.log("spot picked");
            props.navigation.goBack();
          }}
        />
        <View style={styles.inputStyle}>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={[
                {
                  borderColor: colors.border,
                  color: colors.primary,
                  backgroundColor: colors.bgInput,
                },
                styles.txtInput,
                { width: "45%" },
              ]}
              keyboardType={"number-pad"}
              autoCapitalize={"none"}
              autoCorrect={false}
              placeholder="Latitude"
              placeholderTextColor={colors.placeholder}
              onChangeText={(text) => setLatitude(text)}
              value={latitude.toString()}
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
                { width: "45%" },
              ]}
              keyboardType={"number-pad"}
              autoCapitalize={"none"}
              autoCorrect={false}
              placeholder="Longitude"
              placeholderTextColor={colors.placeholder}
              onChangeText={(text) => setLongitude(text)}
              value={longitude.toString()}
              elevation={5}
            />
          </View>
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

          <View style={styles.row}>
            <Text>Do you want this spot to be public? </Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isPublic ? "green" : "#e13333"}
              onValueChange={toggleSwitch}
              value={isPublic}
            />
          </View>

          <Text
            style={{
              color: colors.primary,
              fontWeight: "700",
              fontSize: 15,
              alignSelf: "center",
              marginTop: 15,
            }}
            onPress={() => {
              getImageAsync();
            }}
          >
            Pick a spot image
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
            title="Add spot"
            onPress={() => {
              console.log("spot added");
              saveSpot();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AddSpotScreen;

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
    paddingHorizontal: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },
  switch: {
    marginHorizontal: 30,
    elevation: 1,
    bottom: 3,
  },
  row: {
    flexDirection: "row",
    margin: 20,
    marginBottom: 10,
  },
});
