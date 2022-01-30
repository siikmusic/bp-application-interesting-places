import React, { useEffect, useState } from "react";
import {
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
  ImageBackground,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";

import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { FontAwesome } from "react-native-vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { updateUser } from "../api/PlacesApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { getLikedPlaces } from "../api/PlacesApi";

const PlaceDetailScreen = (props) => {
  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const [currentUser, setCurrentUser] = useState({});
  const navigation = useNavigation();

  const placeAddNavigate = () => {
    navigation.replace("PlaceAddScreen");
  };
  const checkAdmin = async () => {
    var snapshot = await firestore.collection("Users").get();

    snapshot.forEach((doc) => {
      if (doc.data().uid == auth.currentUser.uid) {
        setCurrentUser(doc);
      }
    });
  };
  const navigateHome = () => {
    navigation.goBack();
  };
  const myPlace = props.route.params.place;
  const distance = props.route.params.loc;
  const user = props.route.params.user;
  const mapRegion = {
    latitude: myPlace.location.latitude,
    longitude: myPlace.location.longitude,
    longitudeDelta: 0.0922,
    latitudeDelta: 0.0421,
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  useEffect(() => {
    checkAdmin();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <ImageBackground
          source={{ uri: myPlace.uri }}
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

                <Text style={styles.heading2White}>{distance}km</Text>
              </View>
            </View>
            <View style={styles.placeIcon}>
              <Text style={styles.heading1White}>{myPlace.name}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      <ScrollView style={styles.footer}>
        <View>
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
          </View>
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
    bottom: 65,
    backgroundColor: "#fff",
  },
  map: {
    width: 300,
    height: 300,
    marginBottom: 80,
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
    backgroundColor: "#29c5F6",
    width: "100%",
    padding: 15,
    marginBottom: 10,
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
    marginTop: 180,
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
