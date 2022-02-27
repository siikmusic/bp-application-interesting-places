import { StyleSheet, Text, View, BackHandler } from 'react-native'
import React, {useEffect} from 'react'
import { useNavigation } from "@react-navigation/core";

const SettingScreen = () => {
    const navigation = useNavigation();

    const returnToHome = useEffect(() => {
        const backAction = () => {
          navigation.replace("SettingsScreen");
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);
  return (
    <View>
        <View style={styles.statusBar} />

      <Text>SettingScreen</Text>
    </View>
  )
}

export default SettingScreen

const styles = StyleSheet.create({})