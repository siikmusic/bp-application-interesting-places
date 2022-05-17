import React, { useEffect, useState } from "react";
import {
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Picker,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { storage } from "../firebase";
import { addPlace } from "../api/PlacesApi";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import categories from "../data/categories.json";
import { ActivityIndicator, Colors } from "react-native-paper";

const PlaceAddScreen = ({ route }) => {
  const geofire = require("geofire-common");
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [pickedImagePath, setPickedImagePath] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: route.params.location.latitude,
    longitude: route.params.location.longitude,
    longitudeDelta: 0.0922,
    latitudeDelta: 0.0421,
  });
  const [pin, setPin] = useState({
    latitude: route.params.location.latitude,
    longitude: route.params.location.longitude,
  });
  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const navigateHome = () => {
    navigation.replace("TabNavigator");
  };
  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  };
  const onPlaceAdded = (place) => {
    alert("Place will be reviewed");
    navigation.replace("TabNavigator");
  };

  const addNewPlace = async () => {
    var place = {
      info: "",
      location: null,
      name: "",
      uri: "",
      category: "",
      geohash: "",
      numberOfLikes: 0,
      isValidated: true,
    };

    if (pickedImagePath) {
      const uploadUri = pickedImagePath;
      let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
      const response = await fetch(uploadUri);
      const blob = await response.blob();
      const hash = geofire.geohashForLocation([pin.latitude, pin.longitude]);
      const ref = storage.ref().child(filename);
      setIsUploading(true);
      await ref.put(blob).then(() => {
        setIsUploading(false);
      });
      const url = await ref
        .getDownloadURL()
        .then(function (url) {
          if (!url || !info || !name || !selectedValue) {
            alert("Fill all inputs");
          } else {
            place.uri = url;
            place.info = info;
            place.name = name;
            place.category = selectedValue;
            place.geohash = hash;
            place.location = pin;
            addPlace(place, onPlaceAdded);
          }
        })
        .catch((error) => {
          throw error;
        });
    } else {
      alert("Pick an image");
    }
    setPickedImagePath(null);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        this.state.errorMessege = "Permission to access location was denied";
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        longitudeDelta: 0.0922,
        latitudeDelta: 0.0421,
      });
    })();
  }, []);

  const PickerItems = categories.categories.map((i, key) => (
    <Picker.Item label={i.toString()} key={key} value={i.toString()} />
  ));
  const returnToHome = useEffect(() => {
    const backAction = () => {
      navigation.replace("TabNavigator");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerTopBar}>
        <View style={styles.shadow}>
          <TouchableOpacity onPress={navigateHome}>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="chevron-back" size={24} style={styles.icon} />
              <Text style={styles.topBarText}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center", marginRight: 50 }}>
          <Text style={styles.heading1}> Add Place</Text>
        </View>
        <View></View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.buttonOutlineTextBlueNoCenter}>Place name</Text>
        <TextInput
          placeholder="Enter name of place"
          onChangeText={(text) => setName(text)}
          value={name}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.buttonOutlineTextBlueNoCenter}>Description</Text>
        <TextInput
          placeholder="    Enter place description"
          onChangeText={(text) => setInfo(text)}
          value={info}
          multiline={true}
          style={styles.textInput}
        />
      </View>
      <View>
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
          <Marker
            draggable
            coordinate={pin}
            onDragEnd={(e) => {
              setPin({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
          />
        </MapView>
      </View>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        {PickerItems}
      </Picker>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={showImagePicker} style={styles.button1}>
          <Text style={styles.buttonOutlineTextWhite}>Select an image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addNewPlace} style={styles.button1}>
          <Text style={styles.buttonOutlineTextWhite}>Add Place</Text>
        </TouchableOpacity>
        {isUploading ? (
          <ActivityIndicator
            size={"large"}
            animating={true}
            color={Colors.blue800}
          />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default PlaceAddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  topBarText: {
    fontFamily: "MontserratRegular",
    marginTop: 2,
    color: "black",
  },
  buttonContainer: {
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  icon: {
    color: "#29c5F6",
    marginRight: 5,
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
    color: "grey",
  },
  button1: {
    backgroundColor: "#29c5F6",
    width: "100%",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  heading1: {
    marginBottom: "5%",

    color: "black",
    fontSize: 25,
  },
  heading2: {
    marginBottom: "5%",
    fontSize: 14,
    color: "grey",
  },
  heading3: {
    marginBottom: "5%",
    fontSize: 28,
    color: "black",
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
  map: {
    width: 300,
    height: 300,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  containerTopBar: {
    alignSelf: "stretch",
    backgroundColor: "#000",
    height: 52,
    flexDirection: "row", // row
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between", // center, space-around
    paddingLeft: 10,
    paddingRight: 10,
  },
});
