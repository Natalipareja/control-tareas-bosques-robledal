import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';

// Default configuration key for localStorage
const FIREBASE_CONFIG_STORAGE_KEY = 'bosques_robledal_firebase_config';

export function getStoredFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading stored firebase config:', e);
  }
  // Check for environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }
  return null;
}

export function saveStoredFirebaseConfig(config) {
  try {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.location.reload();
  } catch (e) {
    console.error('Error saving firebase config:', e);
  }
}

export function removeStoredFirebaseConfig() {
  try {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
    window.location.reload();
  } catch (e) {
    console.error('Error clearing firebase config:', e);
  }
}

let app = null;
let db = null;

const activeConfig = getStoredFirebaseConfig();

if (activeConfig && activeConfig.apiKey && activeConfig.projectId) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
    db = getFirestore(app);
  } catch (e) {
    console.error('Error initializing Firebase:', e);
  }
}

// Clean object for Firestore (removes undefined)
const cleanForFirestore = (obj) => JSON.parse(JSON.stringify(obj));

export async function saveTaskToCloud(task) {
  if (!db || !task?.id) return;
  try {
    await setDoc(doc(db, 'tasks', String(task.id)), cleanForFirestore(task));
  } catch (err) {
    console.warn('Error saving task to Firebase:', err);
  }
}

export async function deleteTaskFromCloud(taskId) {
  if (!db || !taskId) return;
  try {
    await deleteDoc(doc(db, 'tasks', String(taskId)));
  } catch (err) {
    console.warn('Error deleting task from Firebase:', err);
  }
}

export async function saveUserToCloud(user) {
  if (!db || !user?.id) return;
  try {
    await setDoc(doc(db, 'consejeros', String(user.id)), cleanForFirestore(user));
  } catch (err) {
    console.warn('Error saving consejero to Firebase:', err);
  }
}

export async function bulkUploadToCloud(tasks = [], users = []) {
  if (!db) return false;
  try {
    const batch = writeBatch(db);
    tasks.forEach(t => {
      const ref = doc(db, 'tasks', String(t.id));
      batch.set(ref, cleanForFirestore(t));
    });
    users.forEach(u => {
      const ref = doc(db, 'consejeros', String(u.id));
      batch.set(ref, cleanForFirestore(u));
    });
    await batch.commit();
    return true;
  } catch (err) {
    console.error('Error uploading batch to Firebase:', err);
    throw err;
  }
}

export { app, db };

