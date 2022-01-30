import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";

const TabNavigator = ({ color1, color2, color3 }) => {
  const navigation = useNavigation();

  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  const route = useRoute();
  const navigateHome = () => {
    if (route != "Home") navigation.replace("Home");
  };
  const navigateMyList = () => {
    navigation.replace("MyListScreen");
  };
  const navigateAccount = () => {
    navigation.replace("AccountScreen");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateHome}>
        <View style={{ justifyContent: "center" }}>
          <FontAwesome name="home" size={24} color={color1} />
          <Text style={styles.text}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateMyList}>
        <View style={{ justifyContent: "center" }}>
          <MaterialIcons
            style={{ marginLeft: 12 }}
            name="place"
            size={24}
            color={color2}
          />
          <Text style={styles.text}>My Places</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateAccount}>
        <View style={{ justifyContent: "center" }}>
          <AntDesign name="user" size={24} color={color3} />
          <Text style={styles.text}>Profile</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: 60,
    flexDirection: "row", // row
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-around", // center, space-around
  },
  text: {
    right: 5,
  },
});
