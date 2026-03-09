import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, deleteDoc, Timestamp, getDoc, setDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFgGnY4UR2HmBihj-uJYs33gLctaxrJ00",
  authDomain: "korpol-4eb9a.firebaseapp.com",
  projectId: "korpol-4eb9a",
  storageBucket: "korpol-4eb9a.firebasestorage.app",
  messagingSenderId: "1047092230990",
  appId: "1:1047092230990:web:257a0b31ab4da08cbd3c1f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, onAuthStateChanged, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, deleteDoc, getDoc, setDoc, increment };
export type { User, Timestamp };
