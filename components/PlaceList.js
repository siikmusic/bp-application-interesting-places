import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { addLiked, deleteLikedPlace } from "../api/PlacesApi";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";

export function PlaceList(props) {
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [placeList, setPlaceList] = useState([]);
  const[location, setLocation] = useState({
    latitude: 137,
    longitude: -22,
  });
  const [distance, setDistance] = useState()  
  const [refreshing, setRefreshing] = useState(false);
  const [distanceUpdated, setDistanceUpdated] = useState(false);
  const [likedPlaceNames, setLikedPlaceNames] = useState([]);
  
  useEffect(() => {
    var likedPlaceNames = []
    props.likedPlace.forEach(place =>{
      likedPlaceNames.push(place.data().name)
    })
    setLikedPlaceNames(likedPlaceNames);
  },[props.likedPlace])

  useEffect(() => {
    if(typeof props.location !== 'undefined')
      setLocation(props.location)
  },[props.location])

  useEffect(() => {

    if(props.refreshing)
      setRefreshing(true);
    else
      setRefreshing(false)

  },[props.refreshing])
  useEffect(() => {
    setDistanceUpdated(props.distanceUpdated)
  },[props.distanceUpdated])
  useEffect(() => {
    if(locationLoaded){
      var filtered = []
      filtered =props.places;
      if(props.category.toString() === "Recommended" ) {
        filtered.forEach((place) => {
          console.log(props.category.toString())
        })
      }
      else if(props.category.toString() === "Most Popular")
      {}
      else{ 
        filtered.sort((a,b) =>(getDist(a) >= getDist(b)) ? 1: -1)

      }
      console.log("filtered")
      setPlaceList(filtered)
      setFiltered(true)
    } 

  },[locationLoaded,distance, refreshing,distanceUpdated])
  useFocusEffect(
    useCallback(() => {
      var unsubscribe;

      unsubscribe = fetchDistance();
      return () => unsubscribe;
    }, [])
  );
  const fetchDistance = async () => {
    try {
      const value = await AsyncStorage.getItem('@distance')
      if(value !== null) {
        setDistance(value)
      }
    } catch(e) {
      console.log(e)
    }
  }
  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    MontserratLight: require("../assets/fonts/Montserrat-Light.ttf"),
  });
  const navigation = useNavigation(); 

  

  useEffect( () => {
    setLocationLoaded(true)

  },[location]);
  const getDist = (item) => {
    if (item.location && location) {
      var dis = getDistance(location, item.location);
      return Math.floor(dis / 1000);
    } else {
      return 0;
    }
  };
  if(filtered)
    return (
      <View style={styles.container}>
        <FlatList
          data={placeList} 
          keyExtractor={(item, index) => {
            return index;
          }}
          getItemLayout={(data, index) => (
            {length: 300, offset: 300 * index, index}
          )}
          extraData={props.places}
          initialNumToRender={3}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          extraData={refreshing, distanceUpdated, likedPlaceNames}
          renderItem={({ item }) => (
            <View style={styles.place}>

              <TouchableOpacity
                onPress={() =>{
                  console.log(props.category)
                  navigation.navigate("Place Details", {
                    place: item,
                    loc: getDist(item),
                    isLiked: likedPlaceNames.includes(item.name)
                  })
                }

                }
              >
                <ImageBackground style={styles.image} source={{ uri: item.uri }}>
                  {likedPlaceNames.includes(item.name) ? (
                    <TouchableOpacity
                    onPress={() => {
                      deleteLikedPlace(item.name);
                      setLikedPlaceNames(likedPlaceNames.filter((placeName) =>(placeName !== item.name)))                   
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
                  ):(
                    <TouchableOpacity
                    onPress={() => {
                      addLiked(item.name);
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
              <View style={{flex: 1, flexDirection: 'row', width: 300}}>
                <View style={{flexGrow: 1, flexDirection: 'row'}}>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>

              <View style={styles.row}>

                <Text style={styles.category}>{getDist(item)}km away</Text>
                
              </View>
               
            </View>
          )}
        />
      </View>
 
    );
    else{
      return(<View></View>)
    }
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
    fontSize: 25,
    flex: 1
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
