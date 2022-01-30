import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { PlaceList } from "../components/PlaceList";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import UserRef from "../firebase";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [places, setPlaces] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  
  // Sign out of application
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.messege));
  };
  useEffect(() => {
    checkAdmin();
  }, []);
  const checkAdmin = async () => {
    var snapshot = await firestore.collection("Users").get();

    snapshot.forEach((doc) => {
      if (doc.data().uid == auth.currentUser.uid) {
        setCurrentUser(doc);
        if (doc.data().isAdmin) {
          setIsAdmin(true);
        }
      }
    });
  };
  const placeAddNavigate = () => {
    navigation.replace("PlaceAddScreen");
  };
  const verifyPlaceNavigate = () => {
    navigation.replace("VerifyPlacesScreen");
  };
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
        <PlaceList style={{ marginBottom: 200 }} user={currentUser} />
      </View>
    </View>
  );
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
