// Import the necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyC5gxQ8H12Olqk1AFQP-h_Ob-C-MCVPu3w",
  authDomain: "visual-112.firebaseapp.com",
  projectId: "visual-112",
  storageBucket: "visual-112.appspot.com",
  messagingSenderId: "45220742837",
  appId: "1:45220742837:web:20157e97ec7fa94c3360fc",
  measurementId: "G-RD5918NMPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

export { db };
