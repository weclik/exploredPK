import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Dimensions, StatusBar } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import Location from "expo-location";
import * as Permissions from "expo-permissions";
import { useSelector } from "react-redux";
import IconButton from "../components/IconButton";
import MarkerView from "../components/MarkerView";
import { useTheme } from "@react-navigation/native";

export default function MapScreen(props) {
  const { colors } = useTheme();

  const spots = useSelector((state) => state.spotsReducer.spots);
  const [location, setLocation] = useState(null);
  const [locRegion, setLocRegion] = useState(null);
  const [permission, askPermission, getPermission] = Permissions.usePermissions(
    Permissions.LOCATION
  );
  const [newMarker, setNewMarker] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (!permission || permission.status !== "granted") {
      askPermission();
    }
  }, []);

  function mapMarkers() {
    return spots.map((marker, index) => {
      return (
        <Marker
          key={index}
          coordinate={{
            latitude: marker.latlng.latitude,
            longitude: marker.latlng.longitude,
          }}
          image={require("../../assets/marker.png")}
          onCalloutPress={() => {
            props.navigation.navigate("Spot", {
              spot: marker,
            });
          }}
        >
          <Callout tooltip>
            <MarkerView
              spot={marker}
              location={location}
            />
          </Callout>
        </Marker>
      );
    });
  }

  return (
    <View style={styles.container}>
    <StatusBar />
      <View style={[styles.headerStyle, { borderColor: colors.title }]}>
        <Text style={[styles.titleStyle, { color: colors.title }]}>
          Explore
        </Text>
        {/* <IconButton
          onPress={() => {
            setMapType(mapType === "hybrid" ? "standard" : "hybrid");
          }}
          style={{ left: 70, top: 10 }}
          iconName={"swap"}
        /> */}
        <IconButton
          onPress={() => {
            askPermission();
            if (location !== undefined && location !== null) {
              mapRef.current.animateToRegion(locRegion, 1000);
            }
          }}
          iconName={"enviromento"}
          style={{ left: 20, top: 10 }}
          iconColor="darkgrey"
        />
        <IconButton
          onPress={() => {
            props.navigation.navigate("AddSpot", {
              marker: newMarker,
            });
          }}
          iconName={"plus"}
          style={{ right: 20, top: 10 }}
          iconColor="darkgrey"
          showShadow={false}
        />
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={permission && permission.status === "granted"}
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
        {newMarker && (
          <Marker
            coordinate={{
              latitude: newMarker.latitude,
              longitude: newMarker.longitude,
            }}
            image={require("../../assets/position.png")}
          />
        )}
        {mapMarkers()}
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
