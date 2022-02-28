import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from "react-native";
import { getLikedPlacesNoUser, deleteLikedPlace, addPlaceFromData
} from "../api/PlacesApi";
import Constants from "expo-constants";
import { Dimensions } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { useFonts } from "expo-font";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, Colors } from 'react-native-paper';
const MyListScreen = () => {
  const [likedPlaces, setLikedPlaces] = useState([]);
  const [location, setLocation] = useState({
    latitude: 137,
    longitude: -22,
  });
  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const [loading, setLoading] = useState(true);
  const onPlacesRecieved = (placeList) => {
    if(likedPlaces !== []){
      setLikedPlaces(placeList);
      setLoading(false);
    }
  };

  const deleteItem = (item) => {
    const filterData = likedPlaces.filter(
      (itemCurrent) => itemCurrent.data().name != item.data().name
    );
    const filterName = [];
    filterData.forEach((element) => {
      filterName.push(element.data().name);
    });
    setLikedPlaces(filterData);
    deleteLikedPlace(item.data().name);
  };
  const onPlaceAdded = () => {
    console.log("onPlaceAdded");
  }

  /* useEffect(() => {
    getLikedPlaces(onPlacesRecieved);
  }, []);*/
  
  useFocusEffect(
    useCallback( () => {
      var unsubscribe;

      unsubscribe = getLikedPlacesNoUser(onPlacesRecieved);

      
      return () => unsubscribe;
    }, [])
  );

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
      return dis;
    } else {
      return 0;
    }
  };
  const navigation = useNavigation();
  if(loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size = {"large"} animating={true} color={Colors.blue800} />
      </View>
    )
  }
  
  return (
    
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <View style={{ }}>
        <Text style={styles.heading1}>My List</Text>
      </View>
      <View style={styles.container}>
      {likedPlaces.length ? (
        <FlatList
          data={likedPlaces}
          keyExtractor={(item, index) => {
            return index;
          }}
          style={{marginBottom: 90}}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.shadow}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Place Details", {
                    place: item.data(),
                    loc: getDist(item.data()),
                  });
                }}
              >
                <ImageBackground
                  style={styles.image}
                  source={{ uri: item.data().uri }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      deleteItem(item);
                    }}
                    style={{
                      marginLeft: "auto",
                      marginRight: 10,
                      marginBottom: 10,
                    }} 
                  >
                    <AntDesign name="closecircle" size={20} color="#FF6962" />
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center"}}>
          <Text>No Liked Places</Text>
        </View>
      )}
      </View>
    </View>
  );
};

export default MyListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
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
    fontSize: 40,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 3,
  },
  heading2: {
    marginBottom: "2%",
    fontSize: 14,
    color: "white",
    textShadowColor: "black",
    textShadowOffset: {
      width: 10,
      height: 10,
    },
    textShadowRadius: 40,
  },
  heading3: {
    marginBottom: "5%",
    fontSize: 28,
    color: "black",
  },
  statusBar: {
    backgroundColor: "white",
    height: Constants.statusBarHeight,
  },

  image: {
    width: Dimensions.get("window").width / 2 - 10,
    height: Dimensions.get("window").width / 2 - 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
