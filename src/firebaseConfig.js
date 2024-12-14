// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVcyQPlLEX3_n3ILlBnISeJ8c3J2gTS5s",
  authDomain: "survey-ab.firebaseapp.com",
  projectId: "survey-ab",
  storageBucket: "survey-ab.appspot.com",
  messagingSenderId: "728551087731",
  appId: "1:728551087731:web:2aa0ce91a5ee18545b5406",
  measurementId: "G-XWD95LP1Q0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };