import { DefaultTheme, DarkTheme } from "@react-navigation/native";

module.exports = {
  CustomDarkTheme: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      //background: "#204774",
      primary: "#82B087",
      //card: "#204774",
      title: "#82B087",
      bgButton: "#111111",
      btnPressed: "#444444",
      spotBg: "#000009",
      placeholder: "lightgrey",
    },
  },
  CustomDefaultTheme: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      //background: "#82B087",
      primary: "#204774",
      title: "#204774",
      //card: "#82B087",
      text: "#212f3d",
      bgButton: "#f1f9ff",
      btnPressed: "lightgrey",
      spotBg: "white",
      placeholder: "grey",
      bgInput: "white",
    },
  },
};
