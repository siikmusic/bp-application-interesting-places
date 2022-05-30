import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useFonts } from "expo-font";
import Constants from "expo-constants";
import data from "../data/preferences.json";
import { Feather } from "@expo/vector-icons";
import { updateInitForm } from "../api/PlacesApi";

const InitPreferencesScreen = () => {
  const navigation = useNavigation();
  const [preferences, setPreferences] = useState(data.preferences);
  const [addedPreferences, setAddedPreferences] = useState([]);
  const handleContinue = () => {
    const preferenceString = addedPreferences.join(" ");
    updateInitForm(preferenceString);
    navigation.replace("TabNavigator");
  };
  const [] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });

  const handleAdd = (item) => {
    var index = preferences.indexOf(item);
    var pref = [...preferences];

    var addedPref = [...addedPreferences];

    var addedPreference = preferences[index];

    pref.splice(index, 1);
    if (index !== -1) {
      setPreferences(pref);
      addedPref.push(addedPreference);
      setAddedPreferences(addedPref);
    }
  };
  const handleRemove = (item) => {
    var index = addedPreferences.indexOf(item);
    var pref = [...preferences];
    var addedPref = [...addedPreferences];
    const removedPreference = addedPref.splice(index, 1);
    if (index !== -1) {
      setAddedPreferences(addedPref);
      pref.push(removedPreference);
      setPreferences(pref);
    }
  };

  return (
    <View>
      <View style={styles.statusBar}></View>
      <View style={styles.centerText}>
        <Text style={styles.header}>Tap A Few Things You Like</Text>
      </View>
      <FlatList
        style={{ marginTop: 10 }}
        data={preferences}
        columnWrapperStyle={{
          justifyContent: "space-between",
          alignS: "center",
        }}
        keyExtractor={(item, index) => {
          return index;
        }}
        numColumns={3}
        extraData={preferences}
        renderItem={({ item }) => (
          <View style={styles.blueContainer}>
            <TouchableOpacity onPress={() => handleAdd(item)}>
              <View style={styles.horizontalAlign}>
                <Text>{item}</Text>
                <Feather name="plus-circle" size={16} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <FlatList
        style={{ marginTop: 10 }}
        data={addedPreferences}
        columnWrapperStyle={{
          justifyContent: "space-between",
          alignS: "center",
        }}
        keyExtractor={(item, index) => {
          return index;
        }}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.redContainer}>
            <TouchableOpacity onPress={() => handleRemove(item)}>
              <View style={styles.horizontalAlign}>
                <Text>{item}</Text>
                <Feather name="minus-circle" size={16} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <View></View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1}>
          <Text onPress={handleContinue} style={styles.buttonOutlineTextWhite}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InitPreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalAlign: {
    flex: 1,
    flexDirection: "row",
  },
  centerText: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  icon: {
    marginLeft: 5,
    marginTop: 2,
  },
  header: {
    fontFamily: "MontserratBold",
    fontSize: 24,
  },
  statusBar: {
    backgroundColor: "white",
    height: Constants.statusBarHeight,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  button1: {
    backgroundColor: "#29c5F6",
    width: "80%",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonOutlineTextWhite: {
    fontFamily: "MontserratBold",
    textAlign: "center",
    color: "white",
  },
  blueContainer: {
    alignSelf: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#c9f1fd",
    borderRadius: 3,
    margin: 5,
  },
  redContainer: {
    alignSelf: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#f57777",
    borderRadius: 3,
    margin: 5,
  },
});
