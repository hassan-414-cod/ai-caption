import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import firebaseConfig from '../../firebase-applet-config.json';

let firebaseAdminApp: App;

if (!getApps().length) {
  const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
  firebaseAdminApp = initializeApp({
    credential: cert(serviceAccountPath),
  });
} else {
  firebaseAdminApp = getApp();
}

// Pass the database ID from config to getFirestore
export const adminDb = getFirestore(firebaseAdminApp, firebaseConfig.firestoreDatabaseId);
export const adminAuth = getAuth(firebaseAdminApp);
export { firebaseAdminApp as admin };
