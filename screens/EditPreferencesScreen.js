import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useFonts } from "expo-font";
import Constants from "expo-constants";
import data from "../data/preferences.json";
import { Feather, Ionicons } from "@expo/vector-icons";
import { updateInitForm } from "../api/PlacesApi";
import { getInitForm } from "../api/PlacesApi";
import { Dimensions } from "react-native";
const InitPreferencesScreen = (props) => {
  const navigation = useNavigation();
  const [preferences, setPreferences] = useState([]);
  const [addedPreferences, setAddedPreferences] = useState();
  const handleContinue = () => {
    const preferenceString = addedPreferences.join(" ");
    updateInitForm(preferenceString);
    navigation.goBack();
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
  const onInitFormReceived = (initForm) => {
    const form = initForm.split(" ");
    var tmp = data.preferences;
    const newData = tmp.filter((dat) => !form.includes(dat));
    setPreferences(newData);
    if (typeof form === "string") setAddedPreferences([form]);
    else setAddedPreferences(form);
  };
  useEffect(() => {
    getInitForm(props.route.params, onInitFormReceived);
  }, []);
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
      <View style={styles.containerTopBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="chevron-back" size={24} style={styles.icon} />
            <Text style={styles.topBarText}>Back</Text>
          </View>
        </TouchableOpacity>

        <View></View>
      </View>
      <View style={styles.centerText}>
        <Text style={styles.header}>Edit Your Preferences</Text>
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
            <View style={styles.horizontalAlign}>
              <Text>{item}</Text>
              <TouchableOpacity onPress={() => handleAdd(item)}>
                <Feather name="plus-circle" size={16} style={styles.icon} />
              </TouchableOpacity>
            </View>
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
            <View style={styles.horizontalAlign}>
              <Text>{item}</Text>
              <TouchableOpacity onPress={() => handleRemove(item)}>
                <Feather name="minus-circle" size={16} style={styles.icon} />
              </TouchableOpacity>
            </View>
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
    width: 300,

    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    top: Dimensions.get("window").height - 150,
    left: Dimensions.get("window").width / 2 - 125,
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
  topBarText: {
    fontFamily: "MontserratRegular",
    marginTop: 4,
    color: "black",
  },
  containerTopBar: {
    alignSelf: "stretch",
    backgroundColor: "#000",
    height: 52,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
