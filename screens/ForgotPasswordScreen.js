import React, { useEffect, useState } from "react";
import {
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  Dimensions,
} from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const handleReset = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(function (user) {})
      .catch(function (e) {
        console.log(e);
      });
    navigation.replace("ResetScreen");
  };
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
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.head}>
        <ImageBackground
          source={require("../assets/signin.jpg")}
          style={{
            height: Dimensions.get("window").height / 2,
            width: "100%",
          }}
        >
          <View style={styles.placeIcon}>
            <MaterialIcons name="place" size={100} color="white" />
            <Text style={styles.heading1White}>INTERESTING PLACES</Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.footer}>
        <Text style={styles.heading1}>Forgot Your Password?</Text>
        <Text style={styles.heading2}>Enter your email to reset it.</Text>
        <View>
          <Text style={styles.buttonOutlineTextBlueNoCenter}>E-mail</Text>
          <View style={styles.action}>
            <Feather name="user" size={20} color="black" />
            <TextInput
              style={styles.textInput}
              placeholder="Your e-mail"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleReset} style={styles.button1}>
            <Text style={styles.buttonOutlineTextWhite}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29c5F6",
  },
  inputContainer: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginBottom: 15,
  },
  head: {
    flex: 1,
    paddingBottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 2.5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonContainer: {
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
    color: "#29c5F6",
  },
  buttonOutlineTextBlueNoCenter: {
    fontFamily: "MontserratBold",
    fontWeight: "bold",
    color: "#29c5F6",
  },
  textForgot: {
    marginTop: 5,
  },
  header: {
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
  headerCenter: {
    alignSelf: "center",
  },
  heading1: {
    marginBottom: "5%",
    fontFamily: "MontserratRegular",
    color: "black",
    fontSize: 25,
  },
  heading2: {
    marginBottom: "5%",
    fontSize: 14,
    fontFamily: "MontserratRegular",

    color: "grey",
  },
  heading3: {
    marginBottom: "5%",
    fontSize: 28,
    fontFamily: "MontserratRegular",

    color: "black",
  },
  heading1White: {
    marginBottom: "5%",
    fontFamily: "MontserratBold",
    color: "black",
    fontSize: 25,
    color: "white",
  },
  placeIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 160,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
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
