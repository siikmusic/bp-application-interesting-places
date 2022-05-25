import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  getUnVerifiedPlaces,
  validatePlace,
  deletePlace,
} from "../api/PlacesApi";
import { AntDesign } from "@expo/vector-icons";
import "firebase/firestore";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

export class VerifyPlaceList extends Component {
  state = {
    placeList: [],
    currentPlaceItem: null,
    refreshFlatlist: false,
    selectedIndex: 0,
  };

  onPlacesRecieved = (placeList) => {
    console.log(placeList);
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
    alert("Place deleted");
    var newPlaceList = [...this.state.placeList];
    newPlaceList.splice(this.state.selectedIndex, 1);
    this.setState((prevState) => ({
      placeList: (prevState.placeList = newPlaceList),
    }));
  };
  onPlaceValidated = () => {
    var newPlaceList = [...this.state.placeList];
    newPlaceList.splice(this.state.selectedIndex, 1);
    this.setState((prevState) => ({
      placeList: (prevState.placeList = newPlaceList),
    }));
    console.log(this.state.refreshFlatlist);
  };
  setVerified = (place) => {
    validatePlace(place, this.onPlaceValidated);
  };
  componentDidMount() {
    console.log("mount");
    getUnVerifiedPlaces(this.onPlacesRecieved);
  }
  renderPlace(item) {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  }
  checkUri(uri) {
    if (uri.includes("PhotoService")) {
      const photo_reference = uri.substring(
        uri.indexOf("GetPhoto?") + 9,
        uri.lastIndexOf("&callback")
      );
      const final = photo_reference.replace("1sAap", "Aap");
      uri =
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
        final +
        "&key=AIzaSyCNYU8Q6lggN_ZPXxuaxuXuB-aq2XZJk04";
    }
    return uri;
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.placeList.length > 0 ? (
          <FlatList
            data={this.state.placeList}
            extraData={this.state.refreshFlatlist}
            keyExtractor={(item, index) => {
              return index;
            }}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item }) => (
              <Card style={{ width: Dimensions.get("window").width }}>
                <Card.Content>
                  <Title>{item.data().name}</Title>
                  <Paragraph>{item.data().info} </Paragraph>
                </Card.Content>
                <Card.Cover source={{ uri: this.checkUri(item.data().uri) }} />
                <Card.Actions>
                  <View style={styles.categoryContainer}>
                    <Text style={{ padding: 5 }}>
                      {this.Capitalize(item.data().category)}
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
                </Card.Actions>
              </Card>
            )}
          />
        ) : (
          <Text style={styles.heading1}>No places to verify</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
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
    backgroundColor: "white",
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
