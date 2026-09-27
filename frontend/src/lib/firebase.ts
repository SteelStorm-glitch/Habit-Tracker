import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import {
  getDatabase,
  ref,
  get,
  set,
  update
} from 'firebase/database'

// Firebase project configuration from project database
export const firebaseConfig = {
  apiKey: "AIzaSyABl4E43IjDiKBtP1ABn0yP_3S1Ijb0BSY",
  authDomain: "liferpg-1eb8c.firebaseapp.com",
  databaseURL: "https://liferpg-1eb8c-default-rtdb.firebaseio.com",
  projectId: "liferpg-1eb8c",
  storageBucket: "liferpg-1eb8c.firebasestorage.app",
  messagingSenderId: "1080983950861",
  appId: "1:1080983950861:web:16503949bbdfaef7222744",
  measurementId: "G-PT0MGMDWRR"
}

// Initialize Firebase singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
export const googleProvider = new GoogleAuthProvider()

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  ref,
  get,
  set,
  update,
  type FirebaseUser
}
