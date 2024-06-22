import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHIuPViz84auzY4cR00IgPRitGrB23HzM",
  authDomain: "espritook.firebaseapp.com",
  projectId: "espritook",
  storageBucket: "espritook.appspot.com",
  messagingSenderId: "1046567881871",
  appId: "1:1046567881871:web:85e0ea3d718cdc120174fa",
  measurementId: "G-BPZNFK4J38"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
