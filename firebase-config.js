// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKPV27qEWkRejitV2hfd9qYFREJ-l2BJI",
  authDomain: "gec-note-vault.firebaseapp.com",
  projectId: "gec-note-vault",
  storageBucket: "gec-note-vault.firebasestorage.app",
  messagingSenderId: "140360776529",
  appId: "1:140360776529:web:d764f4e3d9d911f25b3170",
  measurementId: "G-40DP4NDHF4"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);