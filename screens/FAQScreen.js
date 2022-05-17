import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { List } from "react-native-paper";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const FAQScreen = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [expanded1, setExpanded1] = React.useState(false);
  const [expanded2, setExpanded2] = React.useState(false);
  const [expanded3, setExpanded3] = React.useState(false);
  const [expanded4, setExpanded4] = React.useState(false);

  const handlePress = () => setExpanded(!expanded);
  const handlePress1 = () => setExpanded1(!expanded1);
  const handlePress2 = () => setExpanded2(!expanded2);
  const handlePress3 = () => setExpanded3(!expanded3);
  const handlePress4 = () => setExpanded4(!expanded4);

  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.statusBar} />
      <View style={styles.containerTopBar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="chevron-back-outline" size={24} color="black" />
            <Text style={{ marginTop: 2 }}>Back</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.topBarText}></Text>
          </View>
        </TouchableOpacity>
      </View>
      <List.Section title="F.A.Q.">
        <List.Accordion
          title="Can I add a new place to the app?"
          titleStyle={expanded ? styles.titleTextExpanded : styles.titleText}
          expanded={expanded}
          onPress={handlePress}
          descriptionNumberOfLines={5}
          left={(props) => (
            <List.Icon
              {...props}
              color={expanded ? "#29c5F6" : "black"}
              icon="rhombus-medium"
            />
          )}
        >
          <List.Item
            descriptionNumberOfLines={5}
            title="Yes you can!"
            description="In the Home screen click on Add Place and fill in all the information about your place. After that an administrator will verify the place and add or delete it."
          />
        </List.Accordion>
        <List.Accordion
          title="How can I change the distance?"
          titleStyle={expanded1 ? styles.titleTextExpanded : styles.titleText}
          expanded={expanded1}
          onPress={handlePress1}
          left={(props) => (
            <List.Icon
              {...props}
              color={expanded1 ? "#29c5F6" : "black"}
              icon="rhombus-medium"
            />
          )}
        >
          <List.Item
            descriptionNumberOfLines={5}
            title="Account->Settings"
            description="Go to Account->Settings and change the slider!"
          />
        </List.Accordion>
        <List.Accordion
          title="How to reload the places?"
          titleStyle={expanded2 ? styles.titleTextExpanded : styles.titleText}
          expanded={expanded2}
          onPress={handlePress2}
          left={(props) => (
            <List.Icon
              {...props}
              color={expanded2 ? "#29c5F6" : "black"}
              icon="rhombus-medium"
            />
          )}
        >
          <List.Item
            descriptionNumberOfLines={5}
            title="Swipe down!"
            description="In the Home screen swipe down to reload the list of places."
          />
        </List.Accordion>
        <List.Accordion
          title="How can I edit my profile?"
          titleStyle={expanded3 ? styles.titleTextExpanded : styles.titleText}
          expanded={expanded3}
          onPress={handlePress3}
          left={(props) => (
            <List.Icon
              {...props}
              color={expanded3 ? "#29c5F6" : "black"}
              icon="rhombus-medium"
            />
          )}
        >
          <List.Item
            descriptionNumberOfLines={5}
            title="Account->Settings"
            description="Go to Account->Settings and change your account information including your name, phone number and profile picture."
          />
        </List.Accordion>
        <List.Accordion
          title="How can I change my preferences?"
          titleStyle={expanded4 ? styles.titleTextExpanded : styles.titleText}
          expanded={expanded4}
          onPress={handlePress4}
          left={(props) => (
            <List.Icon
              {...props}
              color={expanded4 ? "#29c5F6" : "black"}
              icon="rhombus-medium"
            />
          )}
        >
          <List.Item
            descriptionNumberOfLines={5}
            titleNumberOfLines={5}
            title="Account->Settings->Edit Preference or unlike places"
            description="Go to Account->Settings->Edit Preference and change your preferences or simply unlike places you don't like anymore."
          />
        </List.Accordion>
      </List.Section>
    </View>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  titleText: {
    color: "black",
  },
  titleTextExpanded: {
    color: "#29c5F6",
  },
  statusBar: {
    backgroundColor: "white",
    height: Constants.statusBarHeight,
  },
});
