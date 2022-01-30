import React, { useEffect, useState } from "react";
import {
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { FontAwesome } from "react-native-vector-icons";
import { addUser } from "../api/PlacesApi";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);
  const onUserAdded = (user) => {
    alert("User added");
    navigation.replace("Login");
  };
  const handleSignUp = () => {
    if (password == passwordValidation) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          var userRef = {
            uid: user.uid,
            email: user.email,
            isAdmin: false,
          };
          addUser(userRef, onUserAdded);
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              alert("Invalid email");
              break;
            case "auth/invalid-password":
              alert("Invalid password");
              break;
            default:
              alert("Invalid email or password");
              break;
          }
        });
    } else {
      alert("Passwords don't match");
    }
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
  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
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
        <Text style={styles.heading1}>Sign Up</Text>
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
        <View>
          <Text
            style={[
              styles.buttonOutlineTextBlueNoCenter,
              {
                marginTop: 10,
              },
            ]}
          >
            Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" size={20} color="black" />
            <TextInput
              style={styles.textInput}
              placeholder="Your password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={secureTextEntry ? true : false}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {secureTextEntry ? (
                <Feather name="eye-off" size={20} color="black" />
              ) : (
                <Feather name="eye" size={20} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.buttonOutlineTextBlueNoCenter,
              {
                marginTop: 10,
              },
            ]}
          >
            Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" size={20} color="black" />
            <TextInput
              style={styles.textInput}
              placeholder="Your password"
              onChangeText={(text) => setPasswordValidation(text)}
              value={passwordValidation}
              secureTextEntry={secureTextEntry ? true : false}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {secureTextEntry ? (
                <Feather name="eye-off" size={20} color="black" />
              ) : (
                <Feather name="eye" size={20} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button2}>
            <Text onPress={handleSignUp} style={styles.buttonOutlineTextBlue}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
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
  input: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonContainer: {
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
    borderWidth: 1,
    borderColor: "#29c5F6",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
  },
  buttonOutlineTextWhite: {
    fontFamily: "MontserratBold",
    textAlign: "center",
    color: "white",
  },
  buttonOutlineTextBlue: {
    fontFamily: "MontserratBold",
    textAlign: "center",
    color: "#29c5F6",
  },
  buttonOutlineTextBlueNoCenter: {
    fontFamily: "MontserratBold",
    fontWeight: "bold",
    color: "#29c5F6",
  },
  textForgot: {
    fontFamily: "MontserratRegular",
    marginTop: 5,
  },
  header: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    paddingTop: 20,
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
  heading1White: {
    marginBottom: "5%",
    fontFamily: "MontserratBold",
    color: "black",
    fontSize: 25,
    color: "white",
  },
  heading2: {
    fontFamily: "MontserratRegular",

    marginBottom: "5%",
    fontSize: 14,
    color: "grey",
  },
  heading3: {
    fontFamily: "MontserratBold",
    marginBottom: "5%",
    fontSize: 28,
    color: "black",
  },
  placeIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 160,
  },
  bottomView: {
    flex: 1,
    backgroundColor: "white",
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
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
