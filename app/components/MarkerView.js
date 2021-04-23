import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { getDistance } from "geolib";

function MarkerView(props) {
  const { colors } = useTheme();
  const [isLoc, setIsLoc] = useState(false);

  const { spot } = props;
  useEffect(
    function () {
      if (props.location !== null) {
        setIsLoc(true);
      }
    },
    [props.location]
  );

  return (
    <View>
      <View
        style={[styles.container, { backgroundColor: colors.spotBg }]}
        onPress={props.onPress}
      >
        <View style={styles.txt}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.titleStyle, { color: colors.text }]}
          >
            {spot.title}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.descStyle, { color: colors.text }]}
          >
            {spot.description}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.descStyle, { color: colors.text }]}
          >
            {isLoc &&
              getDistance(
                {
                  latitude: spot.latlng.latitude,
                  longitude: spot.latlng.longitude,
                },
                {
                  latitude: props.location.latitude,
                  longitude: props.location.longitude,
                }
              )}{" "}
            m
          </Text>
        </View>
      </View>
      <View style={[styles.arrowBorder, { borderTopColor: colors.spotBg }]} />
      <View style={[styles.arrow, { borderTopColor: colors.spotBg }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    borderWidth: 0.5,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 10,
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
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
});

export default MarkerView;
