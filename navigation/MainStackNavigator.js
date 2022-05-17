import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Easing,
} from "react-native";
import {
  createNativeStackNavigator,
  TransitionPresets,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CardStyleInterpolators } from "@react-navigation/stack";

import {
  createAppContainer,
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetScreen from "../screens/ResetScreen";
import PlaceAddScreen from "../screens/PlaceAddScreen";
import VerifyPlacesScreen from "../screens/VerifyPlacesScreen";
import MyListScreen from "../screens/MyListScreen";
import PlaceDetailScreen from "../screens/PlaceDetailScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import InitPreferencesScreen from "../screens/InitPreferencesScreen";
import SettingScreen from "../screens/SettingScreen";
import FAQScreen from "../screens/FAQScreen";
import EditPreferencesScreen from "../screens/EditPreferencesScreen";
import { Ionicons } from "@expo/vector-icons";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="Home Screen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Place Details"
        component={PlaceDetailScreen}
        options={{ headerShown: false }}
      />
        <Stack.Screen
          name="Preferences"
          component={InitPreferencesScreen}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
};
const MyPlacesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyListScreen"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="Place Details"
        component={PlaceDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyListScreen"
        component={MyListScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const SettingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      /> 
      <Stack.Screen
        name="FAQScreen"
        component={FAQScreen}
        options={{ headerShown: false }}
      />
            <Stack.Screen
        name="EditPreferencesScreen"
        component={EditPreferencesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        keyboardHidesTabBar: true,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "My List") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={iconName} size={size} color={color} />
              <Text style={{ color: focused ? "#29c5F6" : "#000" }}>
                {route.name}
              </Text>
            </View>
          );
        },
        tabBarStyle: [
          {
            position: "absolute",
            bottom: 10,
            left: 10,
            right: 10,
            elevation: 0,
            backgroundColor: "#fff",
            borderRadius: 15,
            height: 80,
            ...style.shadow,
          },
        ],
        tabBarActiveTintColor: "#29c5F6",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="My List"
        component={MyPlacesStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={SettingStack}
        options={{ keyboardHidesTabBar: true, headerShown: false }}
      />
    </Tab.Navigator>
  );
};
const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: "horizontal",
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        headerMode="float"
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Preferences"
          component={InitPreferencesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetScreen"
          component={ResetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlaceAddScreen"
          component={PlaceAddScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="VerifyPlacesScreen"
          component={VerifyPlacesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const style = StyleSheet.create({
  shadow: {
    shadowColor: "#7F7F7F",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const configClosing = {
  animation: "timing",
  config: {
    duration: 500,
    easing: Easing.linear,
  },
};
export { AppStack };
