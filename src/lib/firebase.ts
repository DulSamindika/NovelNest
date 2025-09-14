// src/lib/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1dSIIaHdlsy9v0QAguwxS5nupRvrnTcw",
  authDomain: "test1-92f2d.firebaseapp.com",
  projectId: "test1-92f2d",
  storageBucket: "test1-92f2d.firebasestorage.app",
  messagingSenderId: "284301397991",
  appId: "1:284301397991:web:90a8649d0a718a04fdb742",
  measurementId: "G-NVHLWEVMF0",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// IMPORTANT: do this in the browser BEFORE the first getFirestore(app)
if (typeof window !== "undefined") {
  initializeFirestore(app, {
    // Force long-polling so hosts/CDNs that block streaming won’t break Firestore.
    experimentalForceLongPolling: true,
    // If you prefer auto: experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true,
  });
}

export const db: Firestore = getFirestore(app);
