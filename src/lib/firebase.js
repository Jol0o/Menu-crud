import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBH3RTk86YcW1IiaR91qUnSnCa5p7oxEco",
    authDomain: "utak-b93c5.firebaseapp.com",
    projectId: "utak-b93c5",
    storageBucket: "utak-b93c5.appspot.com",
    messagingSenderId: "592528527785",
    appId: "1:592528527785:web:69e22ba1933e30195bb4b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);