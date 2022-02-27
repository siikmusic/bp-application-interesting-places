import { StyleSheet, Text, View,TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState }from 'react'
import { useNavigation } from "@react-navigation/core";
import { useFonts } from "expo-font";
import Constants from "expo-constants";
import data from "../data/preferences.json"
import { Feather } from "@expo/vector-icons";
import { updateInitForm } from '../api/PlacesApi';
const InitPreferencesScreen = () => {
    const navigation = useNavigation();
    const [preferences, setPreferences] = useState(data.preferences);
    const [preferenceString, setPreferenceString] = useState("");
    const handleContinue = () => {
        updateInitForm(preferenceString);
        navigation.replace("TabNavigator");
    }
    const [] = useFonts({
        MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
        MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
      });

    const handleAdd = (item) => {
        var index = preferences.indexOf(item);
        var pref = [...preferences];
        pref.splice(index, 1);
        if (index !== -1) {
            setPreferences(pref)
            const newPreferenceString = preferenceString.concat(item," ")
            setPreferenceString(newPreferenceString)
        }
    }
    
  return (
    <View>
        <View style={styles.statusBar}></View>
        <View style = {styles.centerText}>
            <Text style = {styles.header}>
                Tap A Few Things You Like
            </Text>
        </View>
        <FlatList
            style = {{marginTop:10}}
            data={preferences} 
            columnWrapperStyle={{justifyContent: 'space-between', alignS: 'center'}}

            keyExtractor={(item, index) => {
                return index;
            }}
            numColumns={3}
            extraData = {preferences}
            renderItem={({ item }) => (
                <View style={styles.blueContainer}>
                    <View style={styles.horizontalAlign}>

                        <Text>{item}</Text>
                        <TouchableOpacity onPress={(e) => handleAdd(item)}>
                            <Feather name="plus-circle" size={16} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                
            )}
        
        
        />
        <View>

        </View>
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button1}>
            <Text onPress={handleContinue} style={styles.buttonOutlineTextWhite}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default InitPreferencesScreen

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
        alignSelf: 'center', 
        paddingVertical: 5,
        paddingHorizontal:15,
        backgroundColor: "#c9f1fd",
        borderRadius: 3,
        margin: 10,
      },

})