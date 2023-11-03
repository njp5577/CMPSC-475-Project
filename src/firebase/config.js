import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyCSEAYJzFdr-IewxZOFKgGA8uZBVxaZKy4",
    authDomain: "cmpsc475-86dcb.firebaseapp.com",
    projectId: "cmpsc475-86dcb",
    storageBucket: "cmpsc475-86dcb.appspot.com",
    messagingSenderId: "830778722468",
    appId: "1:830778722468:web:b1123259573d6f3d44fe31",
    measurementId: "G-59YDXEKYN6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);