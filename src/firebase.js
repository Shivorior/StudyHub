// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Paste the keys you copied from Firebase here:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "flowstate-5620f.firebaseapp.com",
  projectId: "flowstate-5620f",
  storageBucket: "flowstate-5620f.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
