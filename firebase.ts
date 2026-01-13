
import { initializeApp, type FirebaseApp } from 'firebase/app';
// Fix: Consolidate named and type imports to ensure reliable module resolution
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const firebaseConfigRaw = process.env.FIREBASE_CONFIG;

if (firebaseConfigRaw) {
  try {
    const config = JSON.parse(firebaseConfigRaw);
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } catch (e) {
    console.error("Failed to parse Firebase Config", e);
  }
} else {
  console.warn("Firebase Config not found, system will run in Demo Mode");
}

export { auth, db };
export const isFirebaseEnabled = () => auth !== null && db !== null;
