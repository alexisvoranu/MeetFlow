import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { initializeApp } from "firebase/app";

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

initializeApp(firebaseConfig);

createApp(App).use(store).use(router).mount("#app");
