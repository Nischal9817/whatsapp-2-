import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrgKAdG3RA-Ctf7Fa8rVrIa1-Wt4HC9IY",
  authDomain: "whatsapp-2-7306f.firebaseapp.com",
  projectId: "whatsapp-2-7306f",
  storageBucket: "whatsapp-2-7306f.appspot.com",
  messagingSenderId: "568453096724",
  appId: "1:568453096724:web:c4764e3c86e02b2f468e01",
  measurementId: "G-QR6G2QCE3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db,auth,provider };