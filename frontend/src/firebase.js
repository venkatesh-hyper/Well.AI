import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDdJsEl4byBT80cOK2O-GFwp0uTWSvArM",
  authDomain: "well-ai-ef741.firebaseapp.com",
  projectId: "well-ai-ef741",
  storageBucket: "well-ai-ef741.firebasestorage.app",
  messagingSenderId: "934662916221",
  appId: "1:934662916221:web:06467817ea0f0335a08914"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); 


export { app, auth, googleProvider, db }; 
