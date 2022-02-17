import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { addLiked } from "../api/PlacesApi";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/core";

export function PlaceList(props) {
  [currentPlaceItem, setCurrentPlaceItem] = useState(null);
  [location, setLocation] = useState({
    latitude: 137,
    longitude: -22,
  });
  [placeList, setPlaceList] = useState(null);
  const places = props.places
  console.log("som")
  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    MontserratLight: require("../assets/fonts/Montserrat-Light.ttf"),
  });
  const navigation = useNavigation();

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  useEffect(() => {
    setPlaceList(props.places)
    console.log("sut")
  }, [])
  useEffect(async () => {

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
      <FlatList
        data={places}
        keyExtractor={(item, index) => {
          return index;
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
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
                    addLiked(item.name);
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
            <View>
            <Text style={styles.name}>{item.name}</Text>

            </View>
            <View style={styles.row}>

              <Text style={styles.category}>{getDist(item)}km away</Text>
              
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
    alignItems: "center",
    marginLeft:50
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignContent: "space-around",
  },
  categoryContainer: {
    alignItems: "center",
    backgroundColor: "#c9f1fd",
    borderRadius: 3,
  },
  categoryContainer2: {
    alignItems: "center",
    backgroundColor: "#c9f1fd",
    borderRadius: 3,
    marginLeft: "auto",
  },
  category: {
    fontFamily: "MontserratRegular",
    paddingVertical: 10
  },

  header: {
    alignSelf: "flex-start",
    fontFamily: "MontserratRegular",
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
  name: {
    fontFamily: "MontserratLight",
    fontSize: 30,

  },
  place: {
    
    marginRight: 20,
  },
  image: {
    flex: 1,
    alignItems: "flex-end",
    width: 300,
    height: 300,
  },
});
