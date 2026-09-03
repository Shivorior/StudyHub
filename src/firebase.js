// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for StudyHub
const firebaseConfig = {
  apiKey: "AIzaSyANZ5uUdf9nAegtFJfonE-qlS5OuOsUPYY",
  authDomain: "flowstate-5620f.firebaseapp.com",
  projectId: "flowstate-5620f",
  storageBucket: "flowstate-5620f.firebasestorage.app",
  messagingSenderId: "486118848872",
  appId: "1:486118848872:web:98b30b7b5079d852a07edd",
  measurementId: "G-KKT77L3N44"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
