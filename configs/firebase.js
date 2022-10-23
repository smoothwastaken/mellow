// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA2qDObTJ7FPB9wWG-nShncEz4-FEcqqaA",
  authDomain: "mellowapp-dev2.firebaseapp.com",
  projectId: "mellowapp-dev2",
  storageBucket: "mellowapp-dev2.appspot.com",
  messagingSenderId: "732602507179",
  appId: "1:732602507179:web:1574d03efe5a0471143cee",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const db = getFirestore(app);

export default app;
