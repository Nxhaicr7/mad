import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7rDaDwQQaIby7LSSqYVcGYM1BwAx-TJo",
  authDomain: "expense-tracker-c13f0.firebaseapp.com",
  projectId: "expense-tracker-c13f0",
  storageBucket: "expense-tracker-c13f0.firebasestorage.app",
  messagingSenderId: "478282792207",
  appId: "1:478282792207:web:0f0dc3be7ac7da2402927a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const firestore = getFirestore(app);
