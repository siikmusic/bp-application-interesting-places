// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import * as firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn_NXgHouSLi_PnMLL_yXBDonLXVB41wg",
  authDomain: "fir-auth-bb233.firebaseapp.com",
  projectId: "fir-auth-bb233",
  storageBucket: "fir-auth-bb233.appspot.com",
  messagingSenderId: "637682413429",
  appId: "1:637682413429:web:7fd2c46ebbec99e1676d3c",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const auth = firebase.auth();
const firestore = firebase.firestore(app);
const storage = firebase.storage(app);
export const PlaceRef = firestore.collection("Places");
export const UserRef = firestore.collection("Users");

export { auth, firestore, storage };
