import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import {  getVerifiedPlaces, getMostPopularPlaces,getLikedPlaces } from "../api/PlacesApi";
import { PlaceList } from "../components/PlaceList";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import categories from "../data/categories.json"
import {Corpus, Similarity} from "tiny-tfidf"
import {getPreference} from "../recommendation/Recommendation"
import * as Location from "expo-location";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { ActivityIndicator, Colors } from 'react-native-paper';
import * as Font from 'expo-font';

import 'react-native-console-time-polyfill';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [placeList, setPlaceList] = useState([]);
  const [likedPlaceList, setLikedPlaceList] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [recommendedPlaces, setRecommendedPlaces] = useState([])
  const [sortedPlaces, setSortedPlaces] = useState([])
  const [distanceUpdated, setDistanceUpdated] = useState(false)
  const [popularPlaces, setPopularPlaces] = useState([])
  const [location, setLocation] = useState()
  const [locationLoaded, setLocationLoaded] = useState(false)
  const [distance, setDistance] = useState()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [likedPlaceListUpdated, setLikedPlaceListUpdated] = useState(false)
  const [sortedCategories, setSortedCategories] = useState();


  const fetchFonts = async () =>
  await Font.loadAsync({
    'MontserratRegular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'MontserratBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  });
  const onPlacesRecieved = (places) => {
    setPlaceList(places);
  };
  const onPopularPlacesReceived = (popularPlaces) => {
    setPopularPlaces(popularPlaces);

  }
  const onLikedPlacesReceived = (likedPlaces) => {
    setLikedPlaceList(likedPlaces); 

  }

  useEffect(() => {
    if(placeList.length > 0) {
      //console.log("loaded")
      if(Object.keys(currentUser).length > 0)
        //console.log("user loaded")
        if(likedPlaceListUpdated) {
          //console.log("likedplacelist")
          setRecommendedPlaces(getRecommendation());
        }
    }
      

  },[placeList,likedPlaceListUpdated])
  const fetchLocation = async () => {
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    let loc = await Location.getCurrentPositionAsync({ enableHighAccuracy: false });

    const tempLocation = {
      longitude: loc.coords.longitude,
      latitude: loc.coords.latitude,
    }

    if(typeof location === "undefined") {

      setLocation(tempLocation);
    }
    else if(location.latitude !== tempLocation.latitude) {
      setLocation(tempLocation);
    }

  };

  useEffect(() => {
    fetchFonts();
    setLoading(true)
  },[])

  const fetchCategories = async () => {
    try {
      const value = await AsyncStorage.getItem('@categories')
      if(value !== null) {
        var sortedCategories = JSON.parse(value);
        sortedCategories.sort((a,b) => (a.visitedCount < b.visitedCount) ? 1 : ((b.visitedCount < a.visitedCount) ? -1 : 0))
        setSortedCategories(sortedCategories)
      }

    } catch(e) {
      console.log(e);
    }
  }

  const fetchDistance = async () => {
    try {
      const value = await AsyncStorage.getItem('@distance')
      if(value !== null) {
        if(value !== distance) {
          setDistance(value)
        }
        
      }
      else {
        setDistance(50)
      }
    } catch(e) {
      setDistance(50)
    }
  }
  const handleRefresh = () => {
    setLikedPlaceListUpdated(false)

    setRefreshing(true)
  }
  const getRecommendation = () => {
    console.time('recommend')

    var descriptions = []
    var names = [] 
    var estimatedLikedPlaces = []
    const likedPlaces = currentUser.data().likedPlaces;
    placeList.forEach((place) =>{
      if(place) {
        if(!place.info)
          descriptions.push(place.name);
        else
          descriptions.push(place.info);
        names.push(place.name) 
      }
    })

    var newPlaceList = [...placeList];
    likedPlaceList.forEach((likedPlace) => {
      const info = likedPlace.data().info;
      const name = likedPlace.data().name
      var isFound = false;
      if(!descriptions.includes(info))
        descriptions.push(info);
      
      if(!names.includes(name))
        names.push(name) 

      if(newPlaceList.some(person => person.name === name)){
          isFound = true;
      }
      if(!isFound) {
        newPlaceList.push(likedPlace.data())
      }
    
    })

    const corpus = new Corpus(names,descriptions);
    const similarity = new Similarity(corpus);
    estimatedLikedPlaces = corpus.getResultsForQuery(currentUser.data().initForm).slice(0,2).map(place => place[0]);
    var userProfile = likedPlaces.concat(estimatedLikedPlaces).sort(() => Math.random() - 0.5)
    var isInit = true;
    var recommendedPlaces = getPreference(userProfile, similarity, isInit, newPlaceList,likedPlaces)

    var placeNames = recommendedPlaces.map(p => p[0]);
    const notLikedPlaceNames = placeNames.filter(place =>{
      return likedPlaces.includes(place) === false;
    })
    var recommendedPlacesDocs = []
    notLikedPlaceNames.forEach(placeName =>{
      newPlaceList.forEach((place) =>{ 
        if(place.name === placeName) {
          recommendedPlacesDocs.push(place) 
        }
      })
    })
    console.timeEnd('recommend')

    return recommendedPlacesDocs;
  }
  useEffect(() => {
  },[recommendedPlaces])
  useFocusEffect(
    useCallback(() => {
      var unsubscribe;
      unsubscribe = fetchDistance();

      return () => unsubscribe;
    }, [])
  ); 
  useEffect(() => {
    fetchLocation();
    fetchCategories();
  },[])

  useEffect(() => {
    setDistanceUpdated(!distanceUpdated)
  },[distance])
  useEffect(() => {
    if(typeof likedPlaceList !== 'undefined' && (!likedPlaceListUpdated)) {
      setLikedPlaceListUpdated(true)

    }

  },[likedPlaceList])
   useEffect(()  => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if(!!location) {
      setLocationLoaded(true)
    }
  },[location])

  useEffect(() => {
    if(refreshing) {

      fetchLocation();
      fetchCategories();
      checkAdmin();

    }
  },[refreshing])

  useEffect(() => {
    if(locationLoaded) {
 
      getVerifiedPlaces(onPlacesRecieved, location, distance);
      getMostPopularPlaces(onPopularPlacesReceived);
    }
  },[locationLoaded, distance])

  useEffect(() => {
    console.time(` init`);

    var placesByCategory = []
    if(placeList.length > 0 && popularPlaces.length > 0) {
    if(recommendedPlaces.length > 0) {
      placesByCategory.push({
        category: "Recommended", 
        places: recommendedPlaces
      }) 
    }
      placesByCategory.push({
        category: "Most Popular", 
        places: popularPlaces
      }) 
      sortedCategories.forEach(category =>{
        var categoryList = placeList.filter(place =>{
          return ((place.category.toLowerCase() == category.category.toLowerCase()))})

        placesByCategory.push({
          category: category.category,
          places: categoryList
        })
      })
      setSortedPlaces(placesByCategory);
      setLoading(false); 
      if(refreshing){
        setRefreshing(false);
      }
    }
      console.timeEnd(` init`);

 
  },[recommendedPlaces])

  const checkAdmin =  () => {
    
    console.time('refresh')
    firestore.collection("Users").doc(auth.currentUser.uid).get().then((user) =>{
      
      setCurrentUser(user)
      
      getLikedPlaces(onLikedPlacesReceived, user)

      if(user.data().isAdmin)
        setIsAdmin(true)

    });
    console.timeEnd('refresh')
    

  };
  const placeAddNavigate = () => {
    navigation.replace("PlaceAddScreen",{location: location}); 
  };
  const verifyPlaceNavigate = () => {
    navigation.replace("VerifyPlacesScreen");
  };
  const allEmpty = (obj) => {
    Object.keys(obj).every(function(key){
      console.log(obj[key])
      return obj[key].length === 0
    })
  }
  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "75%",
          backgroundColor: "#888",
          opacity: 0.7,
          alignSelf: "center",
        }}
      />
    );
  }

  if(!loading) {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={styles.containerTopBar}>
          <View style={styles.shadow}>
            {isAdmin ? ( 
              <TouchableOpacity onPress={verifyPlaceNavigate}>
                <View style={{ flexDirection: "row" }}>
                  <Feather name="shield" size={24} style={styles.icon} />
                  <Text style={styles.topBarText}>Verify Places</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text></Text>
            )}
          </View>
          <TouchableOpacity onPress={placeAddNavigate}>
            <View style={{ flexDirection: "row" }}>
              <Feather name="plus-circle" size={24} style={styles.icon} />
              <Text style={styles.topBarText}>Add Place</Text>
            </View> 
          </TouchableOpacity>

        </View>
  
        <View style={styles.container}>
                <FlatList
                data = {sortedPlaces}
                keyExtractor={(item, index) => {
                  return index;
                }}
                initialNumToRender={3}
                getItemLayout={(data, index) => (
                  {length: 300, offset: 300 * index, index}
                )}
                style = { {marginBottom: 100}}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                
                renderItem={({ item }) => (
                  <>
                    {(item.places.length > 0) ? (
                    <>
                      <View style={{marginLeft: 50, marginBottom: 10}}>
                        <Text style={styles.header}>{item.category}</Text> 
                      </View> 
                        <PlaceList sortedCategories={sortedCategories} user={currentUser} location = {location} likedPlace={likedPlaceList} distanceUpdate = {distanceUpdated} refreshing = {refreshing} distance = {distance} places= {item.places} category = {item.category}/>
                      <FlatListItemSeparator/>

                    </>):(<>
                    </>)}
                  </> 
                )}
              /> 
        </View>
      </View> 
    );
  }
  else {
    return(
      <View style={styles.container}>
          <ActivityIndicator size = {"large"} animating={true} color={Colors.blue800} />
      </View>
    )
  }
  
}; 

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },

  statusBar: {
    backgroundColor: "#C2185B",
    height: Constants.statusBarHeight,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  header: {
    alignSelf: "flex-start",
    fontFamily: "MontserratBold",
    fontSize: 30
  },
  containerTopBar: {
    alignSelf: "stretch",
    backgroundColor: "#000",
    height: 52,
    flexDirection: "row", 
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between", 
    paddingLeft: 10,
    paddingRight: 10,
  },
  icon: {
    color: "#29c5F6",
    marginRight: 5,
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
    fontFamily: "MontserratBold",

    color: "white",
  },
  buttonOutlineTextBlue: {
    textAlign: "center",
    fontFamily: "MontserratBold",

    color: "#29c5F6",
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
  topBarText: {
    fontFamily: "MontserratRegular",
    marginTop: 2,
  },
});
