import { firestore, auth, storage } from "../firebase";
import { query, where } from "firebase/firestore";

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
    .add({
      uid: user.uid,
      email: user.email,
      isAdmin: user.isAdmin,
      likedPlaces: user.likedPlaces,
    })
    .then((data) => addComplete(data))
    .catch((error) => console.log(error));
}

export async function getVerifiedPlaces(placesRetrieved) {
  var placeList = [];
  var snapshot = await firestore.collection("Places").get();

  snapshot.forEach((doc) => {
    const placeItem = doc.data();
    if (doc.data().isValidated) {
      const placeItem = doc.data();
      placeItem.id = doc.id;
      placeList.push(placeItem);
    }
  });

  placesRetrieved(placeList);
}
export async function getUnVerifiedPlaces(placesRetrieved) {
  var placeList = [];

  var snapshot = await firestore.collection("Places").get();

  snapshot.forEach((doc) => {
    if (!doc.data().isValidated) {
      const placeItem = doc.data();
      placeItem.id = doc.id;
      placeList.push(placeItem);
    }
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
  var snapshot = await firestore.collection("Users").get();
  var currentUser;
  snapshot.forEach((doc) => {
    if (doc.data().uid == auth.currentUser.uid) {
      currentUser = doc;
    }
  });
  var likedPlaces = [];

  var snapshotPlace = await firestore.collection("Places").get();
  var currentUser;
  snapshotPlace.forEach((doc) => {
    if (currentUser.data().likedPlaces)
      if (currentUser.data().likedPlaces.includes(doc.data().name))
        likedPlaces.push(doc);
  });
  placesRetrieved(likedPlaces);
}
export async function updateUser(place, placeName) {
  var snapshot = await firestore.collection("Users").get();
  var currentUser;
  snapshot.forEach((doc) => {
    if (doc.data().uid == auth.currentUser.uid) {
      currentUser = doc;
    }
  });
  var likedPlaces = currentUser.data().likedPlaces;
  if (currentUser.data().likedPlaces)
    if (!currentUser.data().likedPlaces.includes(placeName))
      likedPlaces.push(placeName);

  firestore
    .collection("Users")
    .doc(currentUser.id)
    .set({
      email: currentUser.data().email,
      isAdmin: currentUser.data().isAdmin,
      likedPlaces: likedPlaces,
      uid: currentUser.data().uid,
    })
    .catch((error) => console.log(error));
}
export async function deleteLikedPlace(likedPlaces) {
  var snapshot = await firestore.collection("Users").get();
  var currentUser;
  snapshot.forEach((doc) => {
    if (doc.data().uid == auth.currentUser.uid) {
      currentUser = doc;
    }
  });

  firestore
    .collection("Users")
    .doc(currentUser.id)
    .set({
      email: currentUser.data().email,
      isAdmin: currentUser.data().isAdmin,
      likedPlaces: likedPlaces,
      uid: currentUser.data().uid,
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
