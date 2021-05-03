import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import SpotView from "../components/SpotView";
import { useTheme } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { setSpots } from "../redux/actions/actions";

export default function SpotListScreen(props) {
  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  // const saveSpots = (spots) => dispatch(setSpots(spots));

  const spots = useSelector((state) => state.spotsReducer.spots);
  const username = useSelector((state) => state.userReducer.user.username);

  useEffect(() => {
    setIsLoading(false);
    return () => {
      console.log("unmounted spotlist");
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0088ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.title}>
        <Text style={[styles.txtTitle, { color: colors.primary }]}>Spots</Text>
      </View>
      <FlatList
        //style={{ }}
        data={spots}
        extraData={spots}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <SpotView
            title={item.title}
            description={item.description}
            image={item.imageURL}
            onPress={() => {
              props.navigation.navigate("Spot", {
                spot: item,
              });
              console.log("Pressed");
            }}
            createdBy={item.createdBy}
            objectId={item.key}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  txtTitle: {
    fontSize: 30,
  },
});
