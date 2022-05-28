import { firestore, auth, storage } from "../firebase";
import { query, where } from "firebase/firestore";
import firebase from "firebase/app";
import "react-native-console-time-polyfill";

const geofire = require("geofire-common");
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
export function addPlace(place, addComplete) {
  const category = capitalizeFirstLetter(place.category);
  console.log(category);
  delay(500).then(() => {
    firestore
      .collection("Places")
      .add({
        name: place.name,
        info: place.info,
        uri: place.uri,
        category: category,
        geohash: place.geohash,
        location: place.location,
        numberOfLikes: 0,
        isValidated: place.isValidated,
      })
      .then((data) => addComplete(data))
      .catch((error) => console.log(error));
  });
}

export function addPlaceFromData(place, addComplete) {
  const hash = geofire.geohashForLocation([
    place.location.latitude,
    place.location.longitude,
  ]);

  firestore
    .collection("Places")
    .add({
      name: place.name,
      info: place.info,
      uri: place.uri,
      category: place.category,
      geohash: hash,
      location: place.location,
      numberOfLikes: 0,
      isValidated: place.isValidated,
    })
    .catch((error) => console.log(error));
}
export function addUser(user, addComplete) {
  firestore
    .collection("Users")
    .doc(auth.currentUser.uid)
    .set({
      email: user.email,
      isAdmin: user.isAdmin,
      likedPlaces: user.likedPlaces,
      userProfile: [],
      initForm: "",
    })
    .then((data) => addComplete(data))
    .catch((error) => console.log(error));
}

export async function getVerifiedPlaces(placesRetrieved, location, distance) {
  var placeList = [];
  const center = [location.latitude, location.longitude];
  const radiusInM = distance * 1000;
  console.log(distance, center);
  const bounds = geofire.geohashQueryBounds(center, radiusInM);
  for (const b of bounds) {
    await firestore
      .collection("Places")
      .where("isValidated", "==", true)
      .orderBy("geohash")
      .startAt(b[0])
      .endAt(b[1])
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const lat = doc.data().location.latitude;
          const lng = doc.data().location.longitude;

          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            placeList.push(doc.data());
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return placesRetrieved(placeList);
}
export async function getUnVerifiedPlaces(placesRetrieved) {
  var placeList = [];

  await firestore
    .collection("Places")
    .where("isValidated", "==", false)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        placeList.push(doc);
      });
    });
  placesRetrieved(placeList);
}

export async function updatePlace() {
  var placeList = [];
  await firestore
    .collection("Places")
    .where("isValidated", "==", true)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        placeList.push(doc);
      });
    });
  console.log(placeList.length);

  for (var i = 0; i < placeList.length; i++) {
    await firestore
      .collection("Places")
      .doc(placeList[i].id)
      .set({
        name: placeList[i].data().name,
        info: placeList[i].data().info,
        uri: placeList[i].data().uri,
        category: placeList[i].data().category,
        geohash: geofire.geohashForLocation([
          placeList[i].data().location.latitude,
          placeList[i].data().location.longitude,
        ]),
        location: placeList[i].data().location,
        isValidated: placeList[i].data().isValidated,
      })
      .catch((error) => console.log(error));
  }
}
export async function getLikedPlaces(placesRetrieved, user) {
  var data = user.data();
  var likedPlaces = [];
  console.time("get liked");
  if (data.likedPlaces.length > 0) {
    for (var i = 0; i < data.likedPlaces.length; i++) {
      await firestore
        .collection("Places")
        .where("name", "==", data.likedPlaces[i])
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            likedPlaces.push(doc);
          });
        });
    }
  }
  console.timeEnd("get liked");

  placesRetrieved(likedPlaces, user);
}

export async function getLikedPlacesNoUser(placesRetrieved) {
  var uid = auth.currentUser.uid;
  const data = await firestore.collection("Users").doc(uid).get();
  var likedPlaces = [];
  if (data.data().likedPlaces.length > 0) {
    for (var i = 0; i < data.data().likedPlaces.length; i++) {
      await firestore
        .collection("Places")
        .where("name", "==", data.data().likedPlaces[i])
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            likedPlaces.push(doc);
          });
        });
    }
  }
  placesRetrieved(likedPlaces);
}
export async function addLiked(placeName) {
  var uid = auth.currentUser.uid;
  firestore
    .collection("Users")
    .doc(uid)
    .update({
      likedPlaces: firebase.firestore.FieldValue.arrayUnion(placeName),
    })
    .catch((error) => console.log(error));
  firestore
    .collection("Places")
    .where("name", "==", placeName)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        firestore
          .collection("Places")
          .doc(doc.id)
          .update({
            numberOfLikes: firebase.firestore.FieldValue.increment(1),
          })
          .then(console.log("s"));
      });
    });
}

export async function deleteLikedPlace(placeName) {
  var uid = auth.currentUser.uid;
  firestore
    .collection("Users")
    .doc(uid)
    .update({
      likedPlaces: firebase.firestore.FieldValue.arrayRemove(placeName),
    })
    .catch((error) => console.log(error));
}
export function validatePlace(place, updateComplete) {
  firestore
    .collection("Places")
    .doc(place.id)
    .update({
      isValidated: true,
    })
    .then(() => updateComplete(place))
    .catch((error) => console.log(error));
}
export function deletePlace(place, deleteComplete) {
  firestore
    .collection("Places")
    .doc(place.id)
    .delete()
    .then(() => deleteComplete())
    .catch((error) => console.log(error));
}
export function updateInitForm(initForm) {
  var uid = auth.currentUser.uid;
  firestore
    .collection("Users")
    .doc(uid)
    .update({
      initForm: initForm,
    })
    .catch((error) => console.log(error));
}

export async function getMostPopularPlaces(onPopularPlacesReceived) {
  var popularPlaces = [];
  await firestore
    .collection("Places")
    .orderBy("numberOfLikes", "desc")
    .limit(10)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        popularPlaces.push(doc.data());
      });
    })
    .catch((error) => console.log(error));
  onPopularPlacesReceived(popularPlaces);
}

export async function getInitForm(uid, onInitFormReceived) {
  var initForm;
  await firestore
    .collection("Users")
    .doc(uid.uid)
    .get()
    .then((snapshot) => {
      initForm = snapshot.data().initForm;
    });

  onInitFormReceived(initForm);
}
