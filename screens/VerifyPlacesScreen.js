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

const VerifyPlacesScreen = () => {
  const navigation = useNavigation();

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
        <Text></Text>
        <Text></Text>
      </View>

      <View style={styles.container}>
        <VerifyPlaceList />
        <View style={styles.buttonContainer}></View>
      </View>
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
    flexDirection: "row", // row
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between", // center, space-around
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
});
