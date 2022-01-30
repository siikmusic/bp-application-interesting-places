import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  ListItem,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PlaceRef, firestore } from "../firebase";
import {
  addPlace,
  getUnVerifiedPlaces,
  validatePlace,
  deletePlace,
} from "../api/PlacesApi";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import firebase from "firebase/app";
import "firebase/firestore";
import { useFonts } from "expo-font";

export class VerifyPlaceList extends Component {
  state = {
    placeList: [],
    currentPlaceItem: null,
    refreshFlatlist: false,
    selectedIndex: 0,
  };

  onPlacesRecieved = (placeList) => {
    this.setState((prevState) => ({
      placeList: (prevState.placeList = placeList),
    }));
  };

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "95%",
          backgroundColor: "#555",
        }}
      />
    );
  };
  Capitalize(str) {
    return str;
  }
  onPlaceDeleted = () => {
    var newPlaceList = [...this.state.placeList];
    newPlaceList.splice(this.state.selectedIndex, 1);
    this.setState((prevState) => ({
      placeList: (prevState.placeList = newPlaceList),
    }));
    alert("Place deleted");
  };
  onPlaceValidated = (place) => {
    alert("Place Verified");
    this.state.refreshFlatlist = !this.state.refreshFlatlist;
  };
  setVerified = (place) => {
    validatePlace(place, this.onPlaceValidated);
  };
  componentDidMount() {
    getUnVerifiedPlaces(this.onPlacesRecieved);
  }
  renderPlace(item) {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.placeList ? (
          <FlatList
            data={this.state.placeList}
            extraData={this.state.refreshFlatlist}
            keyExtractor={(item, index) => {
              return index;
            }}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item }) => (
              <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.place}>
                  <Image style={styles.image} source={{ uri: item.uri }} />
                  <View style={styles.margin}>
                    <Text style={styles.heading1}>Name: {item.name}</Text>
                    <Text style={styles.heading2}>Info: {item.info}</Text>
                  </View>
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <View style={styles.categoryContainer}>
                      <Text style={{ padding: 5 }}>
                        {this.Capitalize(item.category)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        deletePlace(item, this.onPlaceDeleted);
                      }}
                      style={{ marginLeft: "auto" }}
                    >
                      <AntDesign name="closecircle" size={30} color="#FF6962" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setVerified(item);
                      }}
                      style={{ marginLeft: 5, marginRight: 5 }}
                    >
                      <AntDesign name="checkcircle" size={30} color="#77DD76" />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          />
        ) : (
          <Text style={styles.heading1}>No Places</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  categoryContainer: {
    marginTop: "2%",
    marginLeft: "1%",

    alignItems: "center",
    backgroundColor: "#c9f1fd",

    maxWidth: "40%",
    borderRadius: 3,
  },
  inputContainer: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginBottom: 15,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonContainer: {
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
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
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
  },
  buttonOutlineTextWhite: {
    textAlign: "center",
    color: "white",
  },
  buttonOutlineTextBlue: {
    textAlign: "center",
    color: "#29c5F6",
  },
  buttonOutlineTextBlueNoCenter: {
    fontWeight: "bold",
    color: "#29c5F6",
  },
  textForgot: {
    marginTop: 5,
  },
  header: {
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
  headerCenter: {
    alignSelf: "center",
  },
  heading1: {
    marginTop: "2%",
    color: "black",
    fontSize: 20,
  },
  heading2: {
    marginBottom: "10%",
    fontSize: 14,
    color: "grey",
    paddingRight: 20,
  },
  heading3: {
    marginBottom: "5%",
    fontSize: 28,
    color: "black",
  },
  place: {
    marginTop: "10%",
  },
  image: {
    marginLeft: "1%",
    width: 200,
    height: 200,
  },
  margin: {
    marginLeft: 5,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingRight: 10,
  },
});
