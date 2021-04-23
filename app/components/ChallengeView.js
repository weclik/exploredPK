import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import IconButton from "./IconButton";

//import "../i18n";
//import { useTranslation } from "react-i18next";

function ChallengeView(props) {
  const { colors } = useTheme();

  const { challenge } = props;
  const { spot } = props;

  //const { t, i18n } = useTranslation();

  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.container, { backgroundColor: colors.spotBg }]}
    >
      <Image
        style={{
          flex: 1,
          height: Dimensions.get("window").height / 3,
          width: "100%",
          //alignSelf: "center",
          borderRadius: 5,
          //marginBottom: 20,
          borderWidth: 1,
          borderColor: "grey",
          resizeMode: "cover",
        }}
        source={{
          uri: challenge?.photoURL,
        }}
      />
      <View style={styles.txtContainer}>
        <View style={styles.txt}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.titleStyle, styles.txtShadow]}
          >
            {challenge?.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 20,
    margin: 5,
    flex: 1 / 3,
  },
  txtContainer: {
    flexDirection: "row",
  },
  txt: {
    position: "absolute",
    bottom: 15,
    left: 5,
  },
  titleStyle: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  descStyle: {
    fontSize: 10,
    color: "white",
    marginRight: 10,
    width: "80%",
    marginBottom: 10,
  },
  txtShadow: {
    textShadowColor: "rgba(0,0,0,0.80)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ChallengeView;
