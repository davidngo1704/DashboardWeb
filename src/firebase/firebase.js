
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRDr1KW32CxAndBM6O5Gfl4BwPCk__b8I",
  authDomain: "thanhdai1704.firebaseapp.com",
  projectId: "thanhdai1704",
  storageBucket: "thanhdai1704.firebasestorage.app",
  messagingSenderId: "527207583290",
  appId: "1:527207583290:web:b01188555d47f0fb126f03"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);
