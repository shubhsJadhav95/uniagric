import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBezknPt66Az9zTPGmujexIFUm9mxbjqd4",
  authDomain: "agri-87b39.firebaseapp.com",
  projectId: "agri-87b39",
  storageBucket: "agri-87b39.firebasestorage.app",
  messagingSenderId: "2867533978",
  appId: "1:2867533978:web:211cf66e5941d474536723",
  measurementId: "G-VT8QMHDE38"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, db, auth, analytics }; 