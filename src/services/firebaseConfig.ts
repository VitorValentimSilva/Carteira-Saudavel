import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDf9NsJPv5auW8EaJzFjDL1noaekSsV8RU",
  authDomain: "carteira-saudavel-ed5cd.firebaseapp.com",
  projectId: "carteira-saudavel-ed5cd",
  storageBucket: "carteira-saudavel-ed5cd.firebasestorage.app",
  messagingSenderId: "56468323799",
  appId: "1:56468323799:web:8a1bbea243303868a71f92",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
