import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
