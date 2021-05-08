import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Dimensions, StatusBar } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import Location from "expo-location";
import * as Permissions from "expo-permissions";
import MarkerView from "../components/MarkerView";
import { useTheme } from "@react-navigation/native";

export default function NavigateScreen(props) {
  const { colors } = useTheme();
  const { spot } = props.route.params;

  const [location, setLocation] = useState(null);
  const [permission, setPermission] = useState(false);
  const [locRegion, setLocRegion] = useState(null);

  const mapRef = useRef();

  //const GOOGLE_MAPS_APIKEY = "AIzaSyCTouMeor8kOIr-D1BFAG_9GzyHVxtbWPY";

  async function askPermissionAsync() {
    // let per = await Location.getForegroundPermissionsAsync();
    // if (per.status === "granted") {
    setPermission(true);
    // } else {
    //   alert("Location permission not granted");
    // }
  }

  useEffect(() => {
    if (!permission) {
      askPermissionAsync();
      console.log(spot);
      setLocRegion({
        latitude: spot.latlng.latitude,
        longitude: spot.latlng.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.01,
      });
      if (locRegion) {
        mapRef.current.animateToRegion(locRegion, 1000);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={permission}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: spot.latlng.latitude, //48.71946342885445,
          longitude: spot.latlng.longitude, //21.24937682284641,
          latitudeDelta: 0.001,
          longitudeDelta: 0.01,
        }}
        onUserLocationChange={(e) => {
          setLocation(e.nativeEvent.coordinate);
        }}
      >
        <Marker
          coordinate={{
            latitude: spot.latlng.latitude,
            longitude: spot.latlng.longitude,
          }}
          image={require("../../assets/marker.png")}
        >
          <Callout tooltip>
            <MarkerView spot={spot} location={location} />
          </Callout>
        </Marker>
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your location"
            //image={require("../../assets/position.png")}
          ></Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerStyle: {
    flex: 0.1,
    marginTop: 20,
    borderBottomWidth: 2,
    borderColor: "#204774",
  },
  titleStyle: {
    fontSize: 35,
    alignSelf: "center",
  },
});
