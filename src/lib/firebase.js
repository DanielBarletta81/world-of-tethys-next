
// src/lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,GoogleAuthProvider,onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "process.env.NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "process.env.NEXT_PUBLIC_FIREBASE_APP_ID",
  measurementId: "process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" // optional
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const analytics =
  typeof window !== "undefined" && firebaseConfig.measurementId
    ? getAnalytics(app)
    : null;

hasFirebaseConfig
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

// Only require the keys the client SDK actually needs; measurementId is optional.
const requiredKeys = [
  NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID
];

const hasFirebaseConfig = requiredKeys.every((key) => Boolean(process.env[key]));

if (typeof window !== "undefined") {
  const missing = requiredKeys.filter((key) => !process.env[key]);
  if (missing.length) {
    console.warn(`[tethys] Firebase env vars missing: ${missing.join(", ")}`);
  }
}


// --- Authentication Functions ---

// Register a new player
async function registerPlayer(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Registered user:", user.uid);
    // Create a Firestore document for the new player
    await setDoc(doc(db, "players", user.uid), {
      email: user.email,
      createdAt: new Date(),
      // Add any other initial player data here
    });
    return user;
  } catch (error) {
    console.error("Error registering:", error.message);
    throw error;
  }
}

// Login a player
async function loginPlayer(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Logged in user:", user.uid);
    return user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
}

// Logout a player
async function logoutPlayer() {
  await signOut(auth);
  console.log("User logged out.");
}

// Listen for auth state changes (e.g., user logs in/out)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("Auth state changed: User is signed in", user.uid);
    // Fetch player data from Firestore
    fetchPlayerData(user.uid);
  } else {
    // User is signed out
    console.log("Auth state changed: User is signed out");
  }
});

// --- Firestore Functions ---

// Fetch player data
async function fetchPlayerData(userId) {
  const playerDocRef = doc(db, "players", userId);
  const playerDocSnap = await getDoc(playerDocRef);

  if (playerDocSnap.exists()) {
    console.log("Player data:", playerDocSnap.data());
    return playerDocSnap.data();
  } else {
    console.log("No such player document!");
    return null;
  }
}

// Update player data
async function updatePlayerData(userId, data) {
  const playerDocRef = doc(db, "players", userId);
  await setDoc(playerDocRef, data, { merge: true }); // Use merge: true to update fields without overwriting the whole document
  console.log("Player data updated for:", userId);
}


export { app, auth, googleProvider, db, analytics, hasFirebaseConfig, loginPlayer, registerPlayer, logoutPlayer, fetchPlayerData, updatePlayerData };
// World of Tethys || D.C. Barletta
