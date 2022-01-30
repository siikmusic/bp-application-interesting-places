import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetScreen from "./screens/ResetScreen";
import PlaceAddScreen from "./screens/PlaceAddScreen";
import VerifyPlacesScreen from "./screens/VerifyPlacesScreen";
import AccountScreen from "./screens/AccountScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CustomDrawer from "./components/CustomDrawer";
import { AppStack } from "./navigation/MainStackNavigator";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useFonts } from "expo-font";

export default function App() {
  return <AppStack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
