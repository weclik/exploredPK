import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

function LittleMapButton(props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "grey" : colors.cards,
        },
        styles.buttonStyle,
        props.style,
      ]}
    >
      <AntDesign
        style={props.showShadow && styles.txtShadow}
        name={props.iconName}
        size={22}
        color={props.iconColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    position: "absolute",
    top: 7,
    zIndex: 2,
    padding: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  txtShadow: {
    textShadowColor: "rgba(0,0,0,0.80)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
});

export default LittleMapButton;
