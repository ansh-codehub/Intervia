
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "intervia-8f858.firebaseapp.com",
  projectId: "intervia-8f858",
  storageBucket: "intervia-8f858.firebasestorage.app",
  messagingSenderId: "526989582615",
  appId: "1:526989582615:web:bc37533436d514d6771752"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth, provider}