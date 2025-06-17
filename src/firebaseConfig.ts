
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from 'firebase/auth';

import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

  const login = async ()=>{

        // Sign in with a popup
        // This will open a new window for the user to sign in
        // I am not an AI, I am Adnan, the developer of this code

      signInWithPopup(auth, provider).then((result) => {
          const user = result.user;
          console.log("User signed in: ", user.displayName);
        }).catch((error) => {
          console.error("Error signing in: ", error.message);
        });
    }
    
  const logout = async () => {
    signOut(auth).then(() => {

    }).catch((error) => {
      console.error("Error signing out: ", error.message);
    })
  }




export {db, login, logout };
