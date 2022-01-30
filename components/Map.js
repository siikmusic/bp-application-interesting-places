import React, { Component } from "react";

import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessege: null,
      mapRegion: {
        latitude: 37,
        longitude: -122,
        longitudeDelta: 0.0922,
        latitudeDelta: 0.0421,
      },
      pin: { latitude: 37.4219983, longitude: -122.084 },
    };
  }
  componentDidMount() {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        this.state.errorMessege = "Permission to access location was denied";
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      this.state.mapRegion = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        longitudeDelta: 0.0922,
        latitudeDelta: 0.0421,
      };
      console.log(this.state.mapRegion);
    })();
  }
  onRegionChange = (mapRegion) => {
    this.state.mapRegion = mapRegion;
  };
  render() {
    const { region } = this.state.mapRegion;
    return (
      <View>
        <MapView
          initialRegion={region}
          center={this.state.mapRegion}
          style={styles.map}
          zoomControlEnabled={true}
          onRegionChangeComplete={this.onRegionChange}
          fullscreenControl={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
        >
          <Marker
            draggable
            coordinate={this.state.mapRegion}
            onDragStart={(e) => {
              console.log("drag start", e.nativeEvent.coordinates);
            }}
            onDragEnd={(e) => {
              this.state.pin = {
                latitude: e.nativeEvent.coordinates.latitude,
                longitude: e.nativeEvent.coordinates.longitude,
              };
              console.log("drag start", e.nativeEvent.coordinates);
            }}
          />
        </MapView>
      </View>
    );
  }
}

export default Map;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: 300,
    height: 300,
  },
  fullScreen: {
    width: 500,
    height: 500,
  },
});
