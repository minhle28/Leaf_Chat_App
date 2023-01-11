import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import "firebase/compat/storage";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCufBAvCwzRNshOCkohYAE_mdkvCFjzE0o",
  authDomain: "leafchat-b01a4.firebaseapp.com",
  projectId: "leafchat-b01a4",
  storageBucket: "leafchat-b01a4.appspot.com",
  messagingSenderId: "915053578124",
  appId: "1:915053578124:web:1b6c56f1b13f5a8658f8a9",
  measurementId: "G-TT3Z5VQTND"
};
// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const auth = getAuth();
export const database = getFirestore();
export { firebase };