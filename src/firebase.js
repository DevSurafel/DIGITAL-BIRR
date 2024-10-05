// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADvWWej_dVOxfyhPJKqAj3Rxuly5l_mZc",
  authDomain: "digital-e-birr.firebaseapp.com",
  databaseURL: "https://digital-e-birr-default-rtdb.firebaseio.com",
  projectId: "digital-e-birr",
  storageBucket: "digital-e-birr.appspot.com",
  messagingSenderId: "787718964646",
  appId: "1:787718964646:web:4f30377e186f6d6a1fbb67",
  measurementId: "G-1PWVSBKLRT"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };
