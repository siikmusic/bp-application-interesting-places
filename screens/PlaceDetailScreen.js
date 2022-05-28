import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Button,
} from "react-native";
import * as Linking from "expo-linking";

import { useNavigation } from "@react-navigation/core";

import { useFonts } from "expo-font";

import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

const PlaceDetailScreen = (props) => {
  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const navigation = useNavigation();
  const myPlace = props.route.params.place;

  const navigateHome = () => {
    navigation.goBack();
  };

  const redirect = (name) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${myPlace.location.latitude},${myPlace.location.longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };
  const distance = props.route.params.loc;
  const user = props.route.params.user;
  const mapRegion = {
    latitude: myPlace.location.latitude,
    longitude: myPlace.location.longitude,
    longitudeDelta: 0.0922,
    latitudeDelta: 0.0421,
  };
  const checkUri = (uri) => {
    if (uri.includes("PhotoService")) {
      const photo_reference = uri.substring(
        uri.indexOf("GetPhoto?") + 9,
        uri.lastIndexOf("&callback")
      );
      const final = photo_reference.replace("1sAap", "Aap");
      uri =
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=" +
        final +
        "&key=AIzaSyBdrp2AnP452z_TncsrxwiBI07LrZ_LCL8";
    }

    return uri;
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <ImageBackground
          source={{ uri: checkUri(myPlace.uri) }}
          style={{
            height: Dimensions.get("window").height / 2,
            width: "100%",
            marginTop: 150,
          }}
        >
          <LinearGradient
            style={{}}
            colors={["rgba(0,0,0,0.3)", "transparent", "rgba(0,0,0,0.7)"]}
          >
            <View
              style={{
                marginTop: 5,
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity onPress={navigateHome}>
                <View style={{ flexDirection: "row" }}>
                  <Ionicons name="chevron-back" size={24} color="white" />
                  <Text style={styles.heading2White}>Back</Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  marginLeft: "auto",
                  marginRight: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={24}
                  color="white"
                />

                <Text style={styles.heading2White}>{distance}</Text>
              </View>
            </View>
            <View style={styles.placeIcon}>
              <Text style={styles.heading1White}>{myPlace.name}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      <ScrollView style={styles.footer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.heading1}>About</Text>
          <View style={{ marginLeft: "auto" }}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: 2,
            width: "100%",
            backgroundColor: "#555",
            marginBottom: 10,
            marginTop: -10,
          }}
        />
        <Text style={styles.heading2}>{myPlace.info}</Text>
        <View style={{ maxWidth: "100%" }}>
          <Text style={styles.heading1}>Location</Text>
          <View
            style={{
              height: 2,
              backgroundColor: "#555",
              marginBottom: 20,
              marginTop: -10,
            }}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <MapView
            initialRegion={mapRegion}
            center={mapRegion}
            style={styles.map}
            zoomControlEnabled={true}
            fullscreenControl={true}
            showsUserLocation={true}
            loadingIndicatorColor="#666666"
            loadingBackgroundColor="#eeeeee"
          >
            <Marker coordinate={mapRegion} />
          </MapView>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => redirect(myPlace.name)}
          >
            <Feather
              style={{ margin: 2 }}
              name="navigation"
              size={20}
              color="#555"
            />
            <Text>Navigate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlaceDetailScreen;

const styles = StyleSheet.create({
  head: {
    flex: 1,
    paddingBottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 2,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
    bottom: 90,
    paddingBottom: 50,
    backgroundColor: "#fff",
  },
  map: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  containerTopBar: {
    alignSelf: "stretch",
    backgroundColor: "#fff",
    height: 180,
    flexDirection: "row", // row
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between", // center, space-around
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 999,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  inputContainer: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginBottom: 15,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  button1: {
    alignSelf: "flex-end",
    backgroundColor: "#eeeeee",
    width: "30%",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    padding: 5,
    marginBottom: 30,
    borderRadius: 8,
  },
  button2: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#29c5F6",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
  },
  buttonOutlineTextWhite: {
    fontFamily: "MontserratBold",
    textAlign: "center",
    color: "white",
  },
  buttonOutlineTextBlue: {
    fontFamily: "MontserratBold",
    textAlign: "center",
    color: "#29c5F6",
  },
  buttonOutlineTextBlueNoCenter: {
    fontFamily: "MontserratBold",
    fontWeight: "bold",
    color: "#29c5F6",
  },
  textForgot: {
    fontFamily: "MontserratRegular",
    marginTop: 5,
  },
  header: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    paddingTop: 20,
  },
  headerCenter: {
    alignSelf: "center",
  },
  heading1: {
    marginBottom: "5%",
    fontFamily: "MontserratRegular",
    color: "black",
    fontSize: 25,
  },
  heading1White: {
    marginBottom: "5%",
    fontFamily: "MontserratBold",
    color: "black",
    fontSize: 25,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 40,
    paddingBottom: 50,
  },
  heading2: {
    fontFamily: "MontserratRegular",

    marginBottom: "5%",
    fontSize: 14,
    color: "grey",
  },
  heading2White: {
    fontFamily: "MontserratRegular",
    fontSize: 14,
    marginTop: 2,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 30,
  },
  heading3: {
    fontFamily: "MontserratBold",
    marginBottom: "5%",
    fontSize: 28,
    color: "black",
  },
  placeIcon: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 160,
    marginLeft: 15,
  },
  bottomView: {
    flex: 1,
    backgroundColor: "white",
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    marginBottom: -20,
    paddingLeft: 10,
    color: "black",
    fontFamily: "MontserratRegular",
  },
  statusBar: {
    backgroundColor: "white",
    height: Constants.statusBarHeight,
  },
  topBarText: {
    fontFamily: "MontserratRegular",
    marginTop: 2,
  },
});
