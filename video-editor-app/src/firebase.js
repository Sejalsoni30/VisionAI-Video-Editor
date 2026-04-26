// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 1. Ye import hona chahiye
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAa9Fzh-nRd74Quq7vcnJiNAzqNllCGU7g",
  authDomain: "video-editor-app-843fa.firebaseapp.com",
  databaseURL: "https://video-editor-app-843fa-default-rtdb.firebaseio.com",
  projectId: "video-editor-app-843fa",
  storageBucket: "video-editor-app-843fa.firebasestorage.app",
  messagingSenderId: "820887215900",
  appId: "1:820887215900:web:ab6c138ab7232aff6624d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // 👈 2. Ye 'db' export hona zaroori hai!
// ✨ DRIVE SCOPE ADD KARO: Taaki login ke waqt user se Drive permission maangi jaye
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');