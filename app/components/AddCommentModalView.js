import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, Switch } from "react-native";

import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import BasicButton from "./BasicButton";
import IconButton from "./IconButton";
import { Rating, AirbnbRating } from "react-native-ratings";

function AddCommentModalView(props) {
  const { colors } = useTheme();

  //const [comment, setComment] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: colors.spotBg }]}>
      <IconButton
        onPress={() => props.onPress()}
        iconName={"close"}
        style={{ top: 5, right: 10 }}
        iconColor="black"
        showShadow={false}
      />
      <Text style={[styles.titleStyle, { color: colors.text }]}>
        Leave a comment and rate the spot
      </Text>
      <TextInput
        style={[
          {
            borderColor: colors.border,
            color: colors.primary,
            backgroundColor: colors.bgInput,
          },
          styles.txtInput,
          { width: "100%", height: 80, marginBottom: 20 },
        ]}
        maxLength={100}
        multiline={true}
        autoCapitalize={"none"}
        autoCorrect={false}
        placeholder="Comment"
        placeholderTextColor={colors.placeholder}
        onChangeText={(text) => props.setComment(text)}
        value={props.comment}
        elevation={5}
      />
      <Rating
        type="custom"
        ratingColor={colors.title}
        tintColor={colors.spotBg}
        startingValue={0}
        ratingBackgroundColor="lightgrey"
        ratingCount={5}
        imageSize={20}
        onFinishRating={(value) => {
          props.onPressRating(value);
        }}
        style={{ marginBottom: 10 }}
      />

      <View style={styles.row}>
        <Text style={{ color: colors.text }}>Add anonymous comment? </Text>
        <Switch
          style={styles.switch}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={props.isAnonym ? "green" : "#e13333"}
          onValueChange={props.setIsAnonym}
          value={props.isAnonym}
        />
      </View>

      <BasicButton
        title="Add comment"
        style={{}}
        onPress={() => {
          props.onPressButton();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignSelf: "center",
    //margin: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  row: {
    marginVertical: 10,
    flexDirection: "row",
  },
  txt: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  descStyle: {
    fontSize: 12,
  },
  txtInput: {
    alignSelf: "center",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    //fontWeight: "bold",
    fontSize: 15,
  },
  switch: {
    marginHorizontal: 30,
    bottom: 3,
  },
});

export default AddCommentModalView;
