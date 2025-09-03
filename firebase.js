
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For more information on how to get this value visit: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAThDQpmTEP_7UVjjqN-MA9A5ViRom7mw8",
  authDomain: "donate-6f850.firebaseapp.com",
  projectId: "donate-6f850",
  storageBucket: "donate-6f850.appspot.com",
  messagingSenderId: "805870053914",
  appId: "1:805870053914:web:9d7472f3f57432ef19bfa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
