import { firestore, auth, storage } from "../firebase";
import { query, where } from "firebase/firestore";
import firebase from 'firebase/app'

export function addPlace(place, addComplete) {
  firestore
    .collection("Places")
    .add({
      name: place.name,
      info: place.info,
      uri: place.uri,
      category: place.category,
      location: place.location,
      isValidated: place.isValidated,
    })
    .then((data) => addComplete(data))
    .catch((error) => console.log(error));
}
export function addUser(user, addComplete) {
  firestore
    .collection("Users")
    .doc(auth.currentUser.uid).set({
      email: user.email,
      isAdmin: user.isAdmin,
      likedPlaces: user.likedPlaces,
    })
    .then((data) => addComplete(data))
    .catch((error) => console.log(error));
}

export async function getVerifiedPlaces(placesRetrieved) {
  var placeList = [];
  await firestore.collection("Places").where("isValidated","==",true).get().then((snapshot) => {
    snapshot.forEach(doc => {
      placeList.push(doc.data());
    })
  });
  placesRetrieved(placeList);
}
export async function getUnVerifiedPlaces(placesRetrieved) {
  var placeList = [];

  await firestore.collection("Places").where("isValidated","==",false).get().then((snapshot) => {
    snapshot.forEach(doc => {
      placeList.push(doc.data());
    })
  });
  placesRetrieved(placeList);
}

export function updatePlace(place, updateComplete) {
  firestore
    .collection("Places")
    .doc(place.id)
    .set(place)
    .then(() => updateComplete(place))
    .catch((error) => console.log(error));
}
export async function getLikedPlaces(placesRetrieved) {
  var currentUser = await firestore.collection("Users").doc(auth.currentUser.uid).get();
  var data = currentUser.data();
  console.log(data.likedPlaces);
  var likedPlaces = [];
  if(data.likedPlaces.length > 0) {
    await firestore.collection("Places").where("name","in", data.likedPlaces).get().then(snapshot => {
      snapshot.forEach(doc => {
        likedPlaces.push(doc);
      })
      
    });
  }

  placesRetrieved(likedPlaces);
}
export async function addLiked(placeName) {
  var uid = auth.currentUser.uid;

  firestore.collection("Users").doc(uid)
    .update({

      likedPlaces: firebase.firestore.FieldValue.arrayUnion(placeName),
    })
    .catch((error) => console.log(error));
}
export async function deleteLikedPlace(placeName) {
  var uid = auth.currentUser.uid;
  firestore.collection("Users").doc(uid).update({

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
