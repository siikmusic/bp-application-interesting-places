import React, { useEffect, useState } from "react";
import {
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
const ResetScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      navigation.replace("Login");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",

      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleLogin = () => {
    navigation.replace("Login");
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerCenter}>
        <Text style={styles.heading3}>
          Check your email to reset your password.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button1}>
          <Text style={styles.buttonOutlineTextWhite}>Back To Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
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
});
