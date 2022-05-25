import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { VerifyPlaceList } from "../components/VerifyPlaceList";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

const VerifyPlacesScreen = () => {
  const navigation = useNavigation();
  const navigateHome = () => {
    navigation.replace("TabNavigator");
  };
  useEffect(() => {
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
      <View style={styles.statusBar} />
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
          <Text style={styles.heading1}> Verify Places</Text>
        </View>
        <View></View>
      </View>
      <VerifyPlaceList />
    </View>
  );
};

export default VerifyPlacesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  statusBar: {
    backgroundColor: "#C2185B",
    height: Constants.statusBarHeight,
  },
  containerTopBar: {
    alignSelf: "stretch",
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
    marginRight: 10,
  },
  adminIcon: {
    color: "#29c5F6",
    marginLeft: 10,
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
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    marginBottom: -20,
    paddingLeft: 10,
    color: "black",
    fontFamily: "MontserratRegular",
  },
  heading1: {
    marginBottom: "5%",

    color: "black",
    fontSize: 25,
  },
  topBarText: {
    fontFamily: "MontserratRegular",
    marginTop: 2,
    color: "black",
    marginLeft: -10,
  },
});
