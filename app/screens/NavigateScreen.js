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
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setPermission(true);
    } else {
      alert("Location permission not granted");
    }
  }

  useEffect(() => {
    if (!permission) {
      askPermissionAsync();
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
          latitude: 48.71946342885445,
          longitude: 21.24937682284641,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onUserLocationChange={(e) => {
          setLocation(e.nativeEvent.coordinate);
          location &&
            setLocRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.01,
            });
        }}
        onPress={(e) => {
          setNewMarker(newMarker === null ? e.nativeEvent.coordinate : null);
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
            image={require("../../assets/marker.png")}
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
