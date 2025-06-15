
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from 'firebase/auth';

import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyClhJbJk85nb7C_YvyR2mrj3qvQUMRZk5Q",
  authDomain: "riseup-20bbe.firebaseapp.com",
  projectId: "riseup-20bbe",
  storageBucket: "riseup-20bbe.firebasestorage.app",
  messagingSenderId: "482524120442",
  appId: "1:482524120442:web:11f0afa60d3aa31521c2c3"
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
