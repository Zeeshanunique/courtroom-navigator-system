import { app, db, storage, firebaseError } from './client';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Simple test function to verify Firestore is working correctly
 */
export const testFirestore = async (): Promise<{ success: boolean; message: string }> => {
  console.log('Testing Firestore connection...');

  // Check for Firebase initialization errors, but ignore Storage-related errors
  if (firebaseError && !firebaseError.includes('Storage')) {
    console.error('Firebase initialization error found:', firebaseError);
    return { success: false, message: firebaseError };
  }

  // Check if Firestore database instance exists
  if (!db) {
    const message = 'Firestore database instance not found';
    console.error(message);
    return { success: false, message };
  }

  // Log a warning if Storage is not available
  if (!storage) {
    console.warn('Storage service is not available - some features will be limited');
  }

  try {
    // Try to access a collection (even if empty) to verify Firestore is working
    const testCollection = collection(db, 'test_collection');
    const snapshot = await getDocs(testCollection);
    
    console.log(`Firestore test successful! Found ${snapshot.size} documents in test collection.`);
    return { 
      success: true, 
      message: `Firestore connection successful. Found ${snapshot.size} documents in test collection.${!storage ? ' (Note: Storage service is not available)' : ''}` 
    };
  } catch (error) {
    const message = `Firestore test failed: ${error.message}`;
    console.error(message, error);
    return { success: false, message };
  }
}; 