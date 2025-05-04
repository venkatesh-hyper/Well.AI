// firebaseUserUtils.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Load both profile and settings
export const loadUserData = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

// Save profile and settings (merged)
export const saveUserData = async (uid, profile = {}, settings = {}) => {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { profile, settings }, { merge: true });
};
