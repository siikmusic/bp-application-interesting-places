import React, { useState, useCallback, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Title, Text, TouchableRipple } from "react-native-paper";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const [user, setUser] = useState(auth.currentUser);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      auth.currentUser.reload();
      setUser(auth.currentUser);
      var unsubscribe;
      auth.onAuthStateChanged((user) => {
        unsubscribe = setUser(user);
      });
      console.log(user);
      setUsername(user.displayName);
      setEmail(user.email);
      setAvatar(user.photoURL);
      return () => unsubscribe;
    }, [])
  );
  useEffect(() => {
    console.log("new User");
  }, [user]);
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
    setUser(auth.currentUser);
  }, [auth.currentUser]);
  const handleEdit = () => {
    navigation.navigate("Edit Profile");
  };
  const handleFAQ = () => {
    navigation.navigate("FAQScreen");
  };

  const DisplayAvatar = () => {
    var uri = avatar;
    if (uri) {
      return (
        <Avatar.Image source={{ uri: uri }} size={100} style={styles.avatar} />
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
    <SafeAreaView style={styles.container}>
      <View style={styles.statusBar} />
      <View style={styles.head}>
        <View style={styles.containerTopBar}>
          <TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              <Text></Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit}>
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="account-edit"
                size={24}
                color="black"
              />
              <Text style={styles.topBarText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.userInfoSection}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: 15,
            }}
          >
            {avatar ? (
              <Avatar.Image
                source={{ uri: uri }}
                size={100}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Image
                source={require("../assets/placeholder-image.png")}
                style={styles.avatar}
              ></Avatar.Image>
            )}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {username ? (
                <Title
                  style={[
                    styles.title,
                    {
                      marginTop: 15,
                      marginBottom: 5,
                    },
                  ]}
                >
                  {username}
                </Title>
              ) : (
                <Title
                  style={[
                    styles.title,
                    {
                      marginTop: 15,
                      marginBottom: 5,
                    },
                  ]}
                >
                  Your Name
                </Title>
              )}
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection2}>
          <View style={styles.row}>
            <MaterialIcons name="email" size={24} color="black" />
            <Text
              style={{
                fontFamily: "MontserratRegular",
                color: "#000",
                marginLeft: 5,
                marginTop: 2,
              }}
            >
              {email}
            </Text>
          </View>
        </View>

        <View style={styles.menuWrapper}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate("FAQScreen");
            }}
          >
            <View style={styles.menuItem}>
              <MaterialIcons name="contact-support" size={24} color="white" />
              <Text style={styles.menuItemText}>FAQ</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => {
              navigation.navigate("Edit Profile");
            }}
          >
            <View style={styles.menuItem}>
              <MaterialIcons name="settings" size={24} color="white" />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={handleSignOut}>
            <View style={styles.menuItem}>
              <MaterialIcons name="logout" size={24} color="white" />
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
          </TouchableRipple>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  avatar: {
    width: 105,
    height: 105,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
  head: {
    flex: 1,
    paddingBottom: 50,
    marginTop: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarText: {
    fontFamily: "MontserratRegular",
    marginTop: 2,
  },
  userInfoSection2: {
    marginBottom: 25,
    bottom: 80,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    alignItems: "center",
    bottom: 80,
  },
  footer: {
    flex: 7,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "#29c5F6",
    shadowColor: "#29c5F6",
    shadowOffset: {
      width: 20,
      height: 30,
    },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "MontserratBold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
    fontFamily: "MontserratBold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {},
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
  },
  menuItemText: {
    color: "#fff",
    marginLeft: 5,
    marginTop: -2,
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 26,
    fontFamily: "MontserratBold",
  },
  statusBar: {
    backgroundColor: "white",
    height: Constants.statusBarHeight,
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
});
