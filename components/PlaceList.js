import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  ListItem,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import PlaceRef, { auth } from "../firebase";
import { addPlace, getVerifiedPlaces, updateUser } from "../api/PlacesApi";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/core";

export function PlaceList(props) {
  [currentPlaceItem, setCurrentPlaceItem] = useState(null);
  const [dist, setDist] = useState(0);
  [location, setLocation] = useState({
    latitude: 137,
    longitude: -22,
  });
  [placeList, setPlaceList] = useState([]);

  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const navigation = useNavigation();

  const onPlacesRecieved = (places) => {
    setPlaceList(places);
  };
  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#555",
        }}
      />
    );
  };
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(async () => {
    getVerifiedPlaces(onPlacesRecieved);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });
  }, []);
  const getDist = (item) => {
    if (item.location) {
      var dis = getDistance(location, item.location);
      return Math.floor(dis / 1000);
    } else {
      return 0;
    }
  };
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={placeList}
        keyExtractor={(item, index) => {
          return index;
        }}
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 90 }}
        ItemSeparatorComponent={FlatListItemSeparator}
        renderItem={({ item }) => (
          <View style={styles.place}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Place Details", {
                  place: item,
                  loc: getDist(item),
                })
              }
            >
              <ImageBackground style={styles.image} source={{ uri: item.uri }}>
                <TouchableOpacity
                  onPress={() => {
                    var user = props.user;
                    var likedPlaces = user.data().likedPlaces;
                    if (user.data().likedPlaces)
                      if (!user.data().likedPlaces.includes(item.name))
                        likedPlaces.push(item.name);
                    var newUser = {
                      email: user.data().email,
                      isAdmin: user.data().isAdmin,
                      likedPlaces: likedPlaces,
                      uid: user.data().uid,
                    };

                    updateUser(newUser, item.name);
                  }}
                >
                  <AntDesign
                    style={{
                      margin: 10,
                    }}
                    name="heart"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </ImageBackground>
            </TouchableOpacity>
            <View style={styles.row}>
              <View style={styles.categoryContainer}>
                <Text style={styles.category}>{Capitalize(item.category)}</Text>
              </View>
              <View style={styles.categoryContainer2}>
                <Text style={styles.category}>{getDist(item)}km</Text>
              </View>
            </View>
            <View style={{ marginBottom: "10%" }}>
              <Text style={styles.heading1}>{item.name}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "80%",
    alignItems: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignContent: "space-around",
  },
  categoryContainer: {
    marginTop: "2%",
    alignItems: "center",
    backgroundColor: "#c9f1fd",
    maxWidth: "50%",
    borderRadius: 3,
  },
  categoryContainer2: {
    marginTop: "2%",
    alignItems: "center",
    backgroundColor: "#c9f1fd",
    maxWidth: "35%",
    borderRadius: 3,
    marginLeft: "auto",
  },
  category: {
    fontFamily: "MontserratRegular",
    paddingHorizontal: 10,
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
    width: 250,
    justifyContent: "center",
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
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
  },
  buttonOutlineTextWhite: {
    textAlign: "center",
    color: "white",
  },
  buttonOutlineTextBlue: {
    textAlign: "center",
    color: "#29c5F6",
  },
  buttonOutlineTextBlueNoCenter: {
    fontWeight: "bold",
    color: "#29c5F6",
  },
  textForgot: {
    marginTop: 5,
  },
  header: {
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
  headerCenter: {
    alignSelf: "center",
  },
  heading1: {
    marginTop: "2%",
    color: "black",
    fontSize: 25,
    fontFamily: "MontserratRegular",
  },
  heading2: {
    marginBottom: "10%",
    fontSize: 14,
    color: "grey",
    fontFamily: "MontserratRegular",
  },
  heading3: {
    marginBottom: "5%",
    fontSize: 28,
    color: "black",
    fontFamily: "MontserratRegular",
  },
  place: {
    marginTop: "10%",
  },
  image: {
    flex: 1,
    alignItems: "flex-end",
    width: 300,
    height: 300,
  },
});
