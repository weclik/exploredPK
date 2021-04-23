import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";

function BasicButton(props) {
  const { colors } = useTheme();

  return (
    <Pressable
      elevation={10}
      onPress={props.onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.btnPressed : colors.bgButton,
        },
        styles.button,
        props.style,
      ]}
    >
      <Text
        style={[
          { color: colors.title, borderColor: colors.border },
          styles.buttonText,
        ]}
      >
        {props.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 20,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    width: "80%",
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    margin: 10,
  },
  buttonText: {
    fontSize: 20,
    //fontFamily: "",
    fontWeight: "600",
    alignSelf: "center",
  },
});

export default BasicButton;
