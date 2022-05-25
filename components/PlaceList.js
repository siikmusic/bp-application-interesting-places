import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { addLiked, deleteLikedPlace } from "../api/PlacesApi";
import { getDistance } from "geolib";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Font from "expo-font";
import { auth } from "../firebase";
export function PlaceList(props) {
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [placeList, setPlaceList] = useState([]);
  const [location, setLocation] = useState({
    latitude: 137,
    longitude: -22,
  });
  const [distance, setDistance] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [distanceUpdated, setDistanceUpdated] = useState(false);
  const [likedPlaceNames, setLikedPlaceNames] = useState([]);
  const [sortedCategories, setSortedCategories] = useState();
  useEffect(() => {
    var likedPlaceNames = [];
    props.likedPlace.forEach((place) => {
      likedPlaceNames.push(place.data().name);
    });
    setLikedPlaceNames(likedPlaceNames);
  }, [props.likedPlace]);

  useEffect(() => {
    setSortedCategories(props.sortedCategories);
  }, [props.sortedCategories]);

  useEffect(() => {
    if (typeof props.location !== "undefined") setLocation(props.location);
  }, [props.location]);

  useEffect(() => {
    loadFonts();
  }, []);
  useEffect(() => {
    if (props.refreshing) setRefreshing(true);
    else setRefreshing(false);
  }, [props.refreshing]);
  useEffect(() => {
    setDistanceUpdated(props.distanceUpdate);
  }, [props.distanceUpdate]);
  useEffect(() => {
    if (locationLoaded) {
      var filtered = [];
      filtered = props.places;

      if (props.category?.toString() === "Recommended") {
      } else if (props.category?.toString() === "Most Popular") {
      } else {
        filtered.sort((a, b) => (getDist(a) >= getDist(b) ? 1 : -1));
      }
      setPlaceList(filtered);
      setFiltered(true);
    }
  }, [locationLoaded, distance, refreshing, distanceUpdated]);
  useFocusEffect(
    useCallback(() => {
      var unsubscribe;
      unsubscribe = fetchDistance();
      return () => unsubscribe;
    }, [])
  );
  const fetchDistance = async () => {
    try {
      const value = await AsyncStorage.getItem(
        "@distance" + auth.currentUser.uid
      );
      if (value !== null) {
        setDistance(value);
      } else {
        setDistance(50);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
      MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
      MontserratLight: require("../assets/fonts/Montserrat-Light.ttf"),
    }).then(() => {});
  };

  const navigation = useNavigation();

  const setCategoryVisited = async () => {
    if (props.category !== "Recommended" && props.category !== "Most Popular") {
      var index = sortedCategories.findIndex(
        (x) => x.category === props.category
      );
      var tmp = [...sortedCategories];
      tmp[index].visitedCount = tmp[index].visitedCount + 1;
      setSortedCategories(tmp);
      try {
        await AsyncStorage.setItem(
          "@categories" + auth.currentUser.uid,
          JSON.stringify(tmp)
        );
      } catch (e) {
        console.log(e);
      }
    }
  };
  const checkUri = (uri) => {
    if (uri.includes("PhotoService")) {
      const photo_reference = uri.substring(
        uri.indexOf("GetPhoto?") + 9,
        uri.lastIndexOf("&callback")
      );
      const final = photo_reference.replace("1sAap", "Aap");
      uri =
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
        final +
        "&key=AIzaSyCNYU8Q6lggN_ZPXxuaxuXuB-aq2XZJk04";
    }
    return uri;
  };
  useEffect(() => {
    setLocationLoaded(true);
  }, [location]);
  const getDist = (item) => {
    if (item.location && location) {
      var dis = getDistance(location, item.location);
      if (dis < 1000) {
        return dis.toString() + "m";
      } else {
        return Math.floor(dis / 1000).toString() + "km";
      }
    } else {
      return 0;
    }
  };
  if (filtered)
    return (
      <View
        style={
          placeList.length === 1 ? styles.containerSingle : styles.container
        }
      >
        <FlatList
          data={placeList}
          keyExtractor={(item, index) => {
            return index;
          }}
          getItemLayout={(data, index) => ({
            length: 300,
            offset: 300 * index,
            index,
          })}
          extraData={props.places}
          initialNumToRender={2}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.place}>
              <TouchableOpacity
                onPress={() => {
                  setCategoryVisited();
                  navigation.navigate("Place Details", {
                    place: item,
                    loc: getDist(item),
                    isLiked: likedPlaceNames.includes(item.name),
                  });
                }}
              >
                <ImageBackground
                  style={styles.image}
                  source={{ uri: checkUri(item.uri) }}
                >
                  {likedPlaceNames.includes(item.name) ? (
                    <TouchableOpacity
                      onPress={() => {
                        deleteLikedPlace(item.name);
                        setLikedPlaceNames(
                          likedPlaceNames.filter(
                            (placeName) => placeName !== item.name
                          )
                        );
                      }}
                    >
                      <AntDesign
                        style={{
                          shadowColor: "#000",
                          margin: 10,
                        }}
                        name="heart"
                        size={24}
                        color="#fb3958"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        addLiked(item.name);
                        setCategoryVisited();
                        setLikedPlaceNames([...likedPlaceNames, item.name]);
                      }}
                    >
                      <AntDesign
                        style={{
                          borderColor: "#fff",
                          borderRadius: 5,
                          margin: 10,
                        }}
                        name="heart"
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                  )}
                </ImageBackground>
              </TouchableOpacity>
              <View style={{ flex: 1, flexDirection: "row", width: 300 }}>
                <View style={{ flexGrow: 1, flexDirection: "row" }}>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.category}>{getDist(item)} away</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  else {
    return <View></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginLeft: 50,
  },
  containerSingle: {
    flex: 1,
    alignItems: "center",
    marginLeft: 30,
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
    paddingVertical: 10,
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
    fontSize: 25,
    flex: 1,
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
