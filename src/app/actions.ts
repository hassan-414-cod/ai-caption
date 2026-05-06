"use server";

import { adminDb, adminAuth } from '../lib/firebaseAdmin';
import { generateCaptions, describeImageContext, CaptionGenerationParams } from '../lib/gemini';
import { FieldValue } from 'firebase-admin/firestore';

// Helper to verify ID Token
export async function verifyUser(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    throw new Error('Unauthorized');
  }
}

export async function getUserProfile(idToken: string) {
  const user = await verifyUser(idToken);
  const userDocRef = adminDb.collection('users').doc(user.uid);
  const doc = await userDocRef.get();
  
  if (doc.exists) {
    const data = doc.data() as any;
    return {
      plan: data?.plan || 'free',
      ...data,
      createdAt: data?.createdAt ? data.createdAt.toDate().toISOString() : null,
      updatedAt: data?.updatedAt ? data.updatedAt.toDate().toISOString() : null,
    };
  } else {
    const now = new Date();
    const newProfile = {
      plan: 'free',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    await userDocRef.set({
      plan: 'free',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return newProfile;
  }
}

export async function getUserDashboardStats(idToken: string) {
  const user = await verifyUser(idToken);
  
  const querySnapshot = await adminDb.collection('generations')
    .where('userId', '==', user.uid)
    .get();
    
  let todayCount = 0;
  const nowString = new Date().toDateString();
  
  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.createdAt) {
      const date = data.createdAt.toDate();
      if (date.toDateString() === nowString) {
        todayCount++;
      }
    }
  });
  
  return {
    totalGenerations: querySnapshot.size,
    generationsToday: todayCount
  };
}

export async function generateAndSaveCaptionAction(idToken: string, params: CaptionGenerationParams, base64Image?: string, mimeType?: string) {
  const user = await verifyUser(idToken);
  
  // Check rate limits for free tier
  const stats = await getUserDashboardStats(idToken);
  const profile = await getUserProfile(idToken);
  if (profile?.plan === 'free' && stats.generationsToday >= 5) {
    throw new Error("You've reached your daily limit of 5 generations on the free plan.");
  }
  
  // Optional Image processing
  if (base64Image && mimeType) {
    params.imageDescription = await describeImageContext(base64Image, mimeType);
  }
  
  // Call Gemini (Vertex AI via service account)
  const result = await generateCaptions(params);
  
  // Save to Firestore
  const newRef = adminDb.collection('generations').doc();
  await newRef.set({
    userId: user.uid,
    prompt: params.description,
    platform: params.platform,
    variants: Object.values(result.variants),
    hashtags: result.hashtags,
    createdAt: FieldValue.serverTimestamp()
  });
  
  return { id: newRef.id, variants: Object.values(result.variants), hashtags: result.hashtags };
}

export async function getLibraryGenerations(idToken: string) {
  const user = await verifyUser(idToken);
  const querySnapshot = await adminDb.collection('generations')
    .where('userId', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .get();
    
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null
    };
  });
}

export async function deleteCaptionAction(idToken: string, id: string) {
  const user = await verifyUser(idToken);
  const docRef = adminDb.collection('generations').doc(id);
  const doc = await docRef.get();
  
  if (doc.exists && doc.data()?.userId === user.uid) {
    await docRef.delete();
    return true;
  }
  throw new Error('Unauthorized or not found');
}

export async function clearGenerationsAction(idToken: string) {
  const user = await verifyUser(idToken);
  const querySnapshot = await adminDb.collection('generations')
    .where('userId', '==', user.uid)
    .get();
    
  const batch = adminDb.batch();
  querySnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  return true;
}
