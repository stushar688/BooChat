// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCQhSiP1_DbHmezQkJjN2gB5Gdz1a1IqLo",
  authDomain: "chatapp-6245f.firebaseapp.com",
  projectId: "chatapp-6245f",
  storageBucket: "chatapp-6245f.appspot.com",
  messagingSenderId: "84150445745",
  appId: "1:84150445745:web:543c3232ba88cf18b02490",
  measurementId: "G-6C1EYFBB81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth();

export {app,auth};