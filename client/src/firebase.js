// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a18ef.firebaseapp.com",
  projectId: "mern-estate-a18ef",
  storageBucket: "mern-estate-a18ef.appspot.com",
  messagingSenderId: "260206221227",
  appId: "1:260206221227:web:50d13680093ca3f943a4ee",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
