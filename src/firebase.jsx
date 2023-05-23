import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// initializing the firebase in our project
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDTAZp7XW0pNTfyJ9chcmGSfN0LKKlkTc4",
    authDomain: "instagram-pj02.firebaseapp.com",
    projectId: "instagram-pj02",
    storageBucket: "instagram-pj02.appspot.com",
    messagingSenderId: "498466807101",
    appId: "1:498466807101:web:3e7e6ac7221065b4ae7954",
    measurementId: "G-F14VNRCR6E"
})

// grabbing services from firebase
const db = firebaseApp.firestore();         // access to database
const auth = firebase.auth();               // access to authentication
const storage = firebase.storage();         // how we upload bunch of info or pictures in storage and instance store in our db

export {db, auth, storage}