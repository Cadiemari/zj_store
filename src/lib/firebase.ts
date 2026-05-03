// ============================================================
// Firebase Configuration
// ============================================================
// INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Go to Project Settings > General > Your apps > Web app
// 4. Copy the firebaseConfig object and paste below
// 5. Enable Authentication: Authentication > Sign-in method
//    - Enable Email/Password
//    - Enable Google (optional)
// 6. Create Firestore Database: Firestore Database > Create database
// ============================================================

// NOTE: Firebase SDK is optional. The app works with SQLite/Prisma by default.
// Uncomment the imports below and add your config to enable Firebase.

// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// 🔑 INSERT YOUR FIREBASE CONFIGURATION BELOW
/*
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
*/

// Placeholder exports when Firebase is not configured
export const app = null as unknown as ReturnType<typeof import('firebase/app').initializeApp>;
export const auth = null as unknown as ReturnType<typeof import('firebase/auth').getAuth>;
export const db = null as unknown as ReturnType<typeof import('firebase/firestore').getFirestore>;

// ============================================================
// FIRESTORE COLLECTIONS STRUCTURE (when Firebase is enabled):
// ============================================================
// users/{userId}
//   - name, email, role, avatar, phone, shopImage, shopName, bio, currency, createdAt
//
// products/{productId}
//   - title, description, price, priceUSD, image, images, categoryId, condition,
//     sellerId, status, views, createdAt, updatedAt
//
// services/{serviceId}
//   - title, description, price, priceUSD, image, categoryId, serviceType,
//     speed, connectionType, provider, contact, sellerId, status, views, createdAt
//
// orders/{orderId}
//   - buyerId, productId, quantity, total, totalUSD, status, createdAt, updatedAt
//
// messages/{messageId}
//   - senderId, receiverId, senderName, senderEmail, subject, content,
//     isRead, parentId, createdAt
//
// notifications/{notificationId}
//   - userId, title, message, type, read, link, createdAt
// ============================================================
