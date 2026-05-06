import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import firebaseConfig from '../../firebase-applet-config.json';

let firebaseAdminApp: App;

if (!getApps().length) {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccountVar) {
    try {
      const serviceAccount = JSON.parse(serviceAccountVar);
      firebaseAdminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", e);
      throw e;
    }
  } else {
    // Fallback to local file for development
    const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
    firebaseAdminApp = initializeApp({
      credential: cert(serviceAccountPath),
    });
  }
} else {
  firebaseAdminApp = getApp();
}

// Pass the database ID from config to getFirestore
export const adminDb = getFirestore(firebaseAdminApp, firebaseConfig.firestoreDatabaseId);
export const adminAuth = getAuth(firebaseAdminApp);
export { firebaseAdminApp as admin };
