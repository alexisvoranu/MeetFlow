import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqOsojSBqNM7LjULCe9wrOQCGAYZMkv4Y",
  authDomain: "meetflow-e5950.firebaseapp.com",
  databaseURL:
    "https://meetflow-e5950-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "meetflow-e5950",
  storageBucket: "meetflow-e5950.firebasestorage.app",
  messagingSenderId: "788639562123",
  appId: "1:788639562123:web:745b0c9de417d53bd0978e",
  measurementId: "G-9D3JQVR23B",
};

FirebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(FirebaseApp);
