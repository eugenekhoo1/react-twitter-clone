// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJmpbLhyasKWjCWY7YLLWySbkp2e455_8",
  authDomain: "tweeter-image-db.firebaseapp.com",
  projectId: "tweeter-image-db",
  storageBucket: "tweeter-image-db.appspot.com",
  messagingSenderId: "564124049821",
  appId: "1:564124049821:web:86ec2db6ff5fd8b0678f74",
  measurementId: "G-WY2JXXZ3EQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;
