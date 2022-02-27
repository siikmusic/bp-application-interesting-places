import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { auth, storage } from "../firebase";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import {Slider} from '@miblanchard/react-native-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = () => {
  const [image, setImage] = useState(
    "https://api.adorable.io/avatars/80/abott@adorable.png"
  );
  const [downloadUrl, setUrl] = useState("");

  const [pickedImagePath, setPickedImagePath] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [distance, setDistance] = useState(50)
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();
    
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
  const storeDistance = async () => {
    try {
      await AsyncStorage.setItem('@distance', distance.toString())
    } catch (e) {
      // saving error
    }
  }
  const getDistance = async () => {
    try {
      const value = await AsyncStorage.getItem('@distance')
      if(value !== null) {
        setDistance(value)
      }
    } catch(e) {
      // error reading value
    }
  }

  useEffect(() => {
    getDistance();
  },[])

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
  const updateDistance = (distance) => {
    setDistance(distance);
  }
  const submit = async () => {
    const fullName = firstName.concat(" ", lastName);
    /*console.log(fullName);
    auth.currentUser.updateEmail(email);
    var applicationVerifier = new auth.RecaptchaVerifier("recaptcha-container");
    var provider = new auth.PhoneAuthProvider();
    provider
      .verifyPhoneNumber(phoneNumber, applicationVerifier)
      .then(function (verificationId) {
        var verificationCode = window.prompt(
          "Please enter the verification " +
            "code that was sent to your mobile device."
        );
        return auth.PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
      })
      .then(function (phoneCredential) {
        return auth.currentUser.updatePhoneNumber(phoneCredential);
      });*/
    storeDistance();
    if (pickedImagePath) {
      const uploadUri = pickedImagePath;
      let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
      const response = await fetch(uploadUri);
      const blob = await response.blob();

      const ref = storage.ref().child(filename);

      await ref.put(blob);
      const url = await ref
        .getDownloadURL()
        .then(function (url) {
          if (fullName) {
            auth.currentUser.updateProfile({
              displayName: fullName,
              photoURL: url,
            });
          } else {
            auth.currentUser.updateProfile({
              displayName: auth.currentUser.displayName,
              photoURL: url,
            });
          }
          alert("Success!");
        })
        .catch((error) => {
          throw error;
        });
    } else {
      auth.currentUser.updateProfile({
        displayName: fullName,
        photoURL: auth.currentUser.photoURL,
      });
    }
  };
  const DisplayAvatar = () => {
    var uri = auth.currentUser.photoURL;
    if (uri) {
      return (
        <Avatar.Image source={{ uri: uri }} size={95} style={styles.avatar} />
      );
    } else {
      return (
        <Avatar.Image
          source={require("../assets/placeholder-image.png")}
          style={styles.avatar}
        />
      );
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.statusBar} />

      <View style={styles.containerTopBar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="chevron-back-outline" size={24} color="black" />
            <Text>Back</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.topBarText}></Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          margin: 20,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={showImagePicker}>
            <DisplayAvatar />
          </TouchableOpacity>
          <Text style={{ marginBottom: 10, fontSize: 24, fontWeight: "bold" }}>
            {auth.currentUser.displayName
              ? auth.currentUser.displayName
              : "Your Name"}
          </Text>
        </View>

        <View style={styles.action}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            onChangeText={(text) => setFirstName(text)}
            style={[
              styles.textInput,
              {
                color: "black",
              },
            ]}
          >
              {auth.currentUser.displayName}

            </TextInput>
        </View>
        <View style={styles.action}>
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#666666"
            onChangeText={(text) => setLastName(text)}
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: "black",
              },
            ]}
          >
            {auth.currentUser.displayName}
            </TextInput>
        </View>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter Your Phone Number"
            onChangeText={(text) => setPhone(text)}
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: "black",
              },
            ]}
          >
              {auth.currentUser.phone}

            </TextInput>
        </View>
        <View style={styles.action}>
          <TextInput
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: "black",
              },
            ]}
          >
            {auth.currentUser.email}
          </TextInput>

        </View>
        <View>
          <View style={styles.distanceSliderText}>
            <Text>
              Distance Preference
            </Text>
            <Text style={{color: "grey"}}>
              {distance}km
            </Text>
          </View>

          <Slider trackStyle = {{backgroundColor: "white"}}   step = {1} minimumValue = {25} maximumValue = {200} value = {distance} onValueChange={value => updateDistance(value)}/>
        </View>
        
        <TouchableOpacity style={styles.commandButton} onPress={submit}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#29c5F6",
    alignItems: "center",
    marginTop: 10,
  },
  statusBar: {
    backgroundColor: "white",
    height: Constants.statusBarHeight,
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
  avatar: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#29c5F6",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  distanceSliderText: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
