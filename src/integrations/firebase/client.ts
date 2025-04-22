import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration before initializing
const validateFirebaseConfig = () => {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Required Firebase configuration is missing');
    return false;
  }
  
  return true;
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let analytics;
let firebaseError = null;

try {
  // Validate config first
  if (validateFirebaseConfig()) {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Initialize analytics if in browser environment
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn('Analytics initialization failed:', err);
      }
    }
    
    console.log('Firebase services successfully initialized');
  } else {
    firebaseError = 'Invalid Firebase configuration';
  }
} catch (error) {
  firebaseError = `Error initializing Firebase: ${error.message}`;
  console.error(firebaseError, error);
}

// Populate Firebase with sample data if needed (for development only)
const populateSampleData = async () => {
  if (import.meta.env.DEV && db) {
    console.log('Development environment detected. You can add code here to populate sample data.');
    // Add sample data population logic if needed
  }
};

// Export initialized services
export { app, auth, db, storage, analytics, firebaseError, populateSampleData };
