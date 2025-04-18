import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Import specific Storage package
import '@firebase/storage';

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

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const placeholders = ['your-api-key', 'your-project', 'your-project-id', 'your-sender-id', 'your-app-id'];
  const issues = [];
  
  for (const [key, value] of Object.entries(firebaseConfig)) {
    if (!value) {
      issues.push(`Missing ${key}`);
    } else if (placeholders.some(placeholder => String(value).includes(placeholder))) {
      issues.push(`${key} contains placeholder value: ${value}`);
    }
  }
  
  if (issues.length > 0) {
    console.error('Firebase configuration issues:', issues);
    return issues;
  }
  
  return null;
};

// Variables to export
let app;
let auth;
let db;
let storage = null;
let firebaseError = null;

// Function to initialize Firebase services separately
const initializeFirebaseServices = async () => {
  if (!app) {
    return false;
  }

  let success = true;

  // Initialize Auth service
  try {
    auth = getAuth(app);
    console.log('Firebase auth initialized');
  } catch (authError) {
    console.error('Failed to initialize Auth:', authError);
    firebaseError = `Error initializing Auth: ${authError.message}`;
    success = false;
  }
  
  // Initialize Firestore service
  if (success) {
    try {
      // Initialize Firestore
      db = getFirestore(app);
      console.log('Firebase Firestore initialized');
      
      // Enable offline persistence if in a browser environment
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
        try {
          await enableIndexedDbPersistence(db);
          console.log('Firebase Firestore persistence enabled');
        } catch (err) {
          console.warn('Firebase Firestore persistence could not be enabled:', err.message);
          // This is not a critical error, so we continue
        }
      }
    } catch (firestoreError) {
      console.error('Failed to initialize Firestore:', firestoreError);
      firebaseError = `Error initializing Firestore: ${firestoreError.message}`;
      success = false;
    }
  }
  
  // Initialize Storage service - make this optional
  if (success) {
    try {
      storage = getStorage(app);
      console.log('Firebase storage initialized');
    } catch (storageError) {
      console.error('Failed to initialize Storage:', storageError);
      // We'll set a warning but not fail the entire initialization
      console.warn('Storage service will not be available - continuing without it');
      // Don't set firebaseError for Storage failures, making it optional
    }
  }
  
  return success;
};

// Initialize Firebase only if configuration is valid
try {
  const configIssues = validateFirebaseConfig();
  
  if (configIssues) {
    firebaseError = `Firebase configuration error: ${configIssues.join(', ')}. Please update your .env file with valid Firebase credentials.`;
    console.error(firebaseError);
  } else {
    // Check if Firebase is already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log('Firebase already initialized, reusing existing app');
      app = existingApps[0];
    } else {
      // Initialize Firebase app first
      console.log('Initializing Firebase with project ID:', firebaseConfig.projectId);
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized');
    }
    
    // Initialize services
    initializeFirebaseServices().then(success => {
      if (success) {
        console.log('All required Firebase services successfully initialized');
      } else {
        console.error('Failed to initialize some required Firebase services');
      }
    });
  }
} catch (error) {
  firebaseError = `Error initializing Firebase: ${error.message}`;
  console.error(firebaseError, error);
}

// Connect to emulators if in development mode and Firebase is initialized
if (app && import.meta.env.DEV) {
  // Uncomment these lines if you're using Firebase emulators
  // import { connectFirestoreEmulator } from 'firebase/firestore';
  // import { connectStorageEmulator } from 'firebase/storage';
  // if (db) connectFirestoreEmulator(db, 'localhost', 8080);
  // if (storage) connectStorageEmulator(storage, 'localhost', 9199);
}

export { app, auth, db, storage, firebaseError };
