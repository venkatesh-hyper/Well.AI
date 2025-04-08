// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ add this line

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD3qye_T3MzlMbcDJAHXz6o20I8HuutIg",
  authDomain: "well-ai-b2844.firebaseapp.com",
  projectId: "well-ai-b2844",
  storageBucket: "well-ai-b2844.firebasestorage.app",
  messagingSenderId: "613556524030",
  appId: "1:613556524030:web:01d0347510662ae010a6af",
  measurementId: "G-PR9X43F7YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth instance so you can use it in Login/Signup
export const auth = getAuth(app);
