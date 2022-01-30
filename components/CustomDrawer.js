import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { FontAwesome } from "react-native-vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { auth } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const CustomDrawer = (props) => {

  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.messege));
  };
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#29c5F6" }}
      >
        <ImageBackground
          source={require("../assets/drawer-bg.png")}
          style={{ padding: 20 }}
        >
          <Image
            source={require("../assets/adaptive-icon.png")}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          ></Image>
          <Text style={styles.paragraph}>John Doe</Text>
        </ImageBackground>
        <View style={styles.drawList}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity onPress={handleSignOut}>
        <View style={{ flexDirection: "row", padding: 15 }}>
          <Ionicons name="exit-outline" size={24} color="black" />
          <Text style={styles.signOut}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawer;
const styles = StyleSheet.create({
  paragraph: {
    fontFamily: "MontserratRegular",
    fontSize: 12,
    color: "white",
  },
  drawList: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  signOut: {
    fontFamily: "MontserratRegular",
    color: "black",
    marginTop: 3,
    paddingLeft: 5,
  },
});
