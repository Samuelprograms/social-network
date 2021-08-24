import firebase from "firebase";

const firebaseConfig: Object = {
  apiKey: "AIzaSyBzpNEK4H_0ghRiwAZYAShs5Uy1ijL4flk",
  authDomain: "fir-exp-874a4.firebaseapp.com",
  projectId: "fir-exp-874a4",
  storageBucket: "fir-exp-874a4.appspot.com",
  messagingSenderId: "220212293953",
  appId: "1:220212293953:web:23ac98739a12de8e1e31c0",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();
const db = firebaseApp.firestore();
const storage = firebaseApp.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider, storage };
