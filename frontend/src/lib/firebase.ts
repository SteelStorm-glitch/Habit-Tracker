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
  apiKey: "AIzaSyDgQcYtqcEY5F5s9a2dr9V-igvXsz4JgZU",
  authDomain: "habit-b2d0a.firebaseapp.com",
  databaseURL: "https://habit-b2d0a-default-rtdb.firebaseio.com",
  projectId: "habit-b2d0a",
  storageBucket: "habit-b2d0a.firebasestorage.app",
  messagingSenderId: "102979641225",
  appId: "1:102979641225:web:38484c9306f6d3aeb28b58",
  measurementId: "G-VLB18BZNBR"
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
