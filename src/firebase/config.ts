import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider, AppCheck } from 'firebase/app-check';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore,
  initializeFirestore, 
  persistentLocalCache, 
  memoryLocalCache, 
  doc, 
  getDoc,
  Firestore,
  setLogLevel,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv && metaEnv[key]) {
      return metaEnv[key];
    }
  } catch {
    // ignore
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  return defaultValue;
};

const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY", "AIzaSyCST5-Nqzq8GrS-ObLpq4SJ-iUKIOY3C3c"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN", "tk-asy-syifa-tanggul.firebaseapp.com"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID", "tk-asy-syifa-tanggul"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET", "tk-asy-syifa-tanggul.firebasestorage.app"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID", "733867786359"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID", "1:733867786359:web:1efe11a06698d7c1884672")
};

// Database ID: Uses the standard (default) database by default.
// VITE_FIREBASE_DATABASE_ID is only used if explicitly provided.
const configuredDbId = getEnvVar("VITE_FIREBASE_DATABASE_ID", "");
const databaseId = configuredDbId ? configuredDbId : undefined;

export const vapidKey = getEnvVar("VITE_FIREBASE_VAPID_KEY", "");

export const app = initializeApp(firebaseConfig);
setLogLevel('silent');

let firestoreInstance: Firestore;
try {
  firestoreInstance = databaseId
    ? getFirestore(app, databaseId)
    : getFirestore(app);
} catch {
  try {
    firestoreInstance = databaseId
      ? initializeFirestore(app, {}, databaseId)
      : initializeFirestore(app, {});
  } catch {
    firestoreInstance = databaseId
      ? initializeFirestore(app, { localCache: memoryLocalCache() }, databaseId)
      : initializeFirestore(app, { localCache: memoryLocalCache() });
  }
}

const isProd = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') || (import.meta as any)?.env?.PROD === true;

if (!isProd && typeof process !== 'undefined' && process.env && process.env.FIRESTORE_EMULATOR_HOST) {
  const [host, portStr] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
  try {
    connectFirestoreEmulator(firestoreInstance, host || '127.0.0.1', parseInt(portStr || '8080', 10));
  } catch {
    // Emulator might already be connected
  }
}

export let db = firestoreInstance;
export function setFirestoreDb(newDb: Firestore) {
  db = newDb;
}
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Safe, backward-compatible App Check initialization guard
let appCheckInstance: AppCheck | null = null;
if (typeof window !== 'undefined') {
  try {
    const siteKey = getEnvVar("VITE_FIREBASE_APPCHECK_SITE_KEY", "");
    if (siteKey) {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } else if (!isProd) {
      const debugToken = (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN || getEnvVar("VITE_FIREBASE_APPCHECK_DEBUG_TOKEN", "");
      if (debugToken) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
        appCheckInstance = initializeAppCheck(app, {
          provider: new CustomProvider({
            getToken: () => Promise.resolve({ token: typeof debugToken === 'string' ? debugToken : 'DEBUG_TOKEN', expireTimeMillis: Date.now() + 3600000 }),
          }),
          isTokenAutoRefreshEnabled: true,
        });
      }
    }
  } catch (err) {
    console.warn("App Check initialization non-fatal note:", err instanceof Error ? err.message : String(err));
  }
}
export { appCheckInstance };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Info: ', JSON.stringify(errInfo));
  return errInfo;
}

// Validate connection on boot
export async function testConnection() {
  try {
    await getDoc(doc(db, 'tade_settings', 'active_theme'));
    console.log("Firestore connected / local cache ready.");
  } catch (error) {
    if (error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable') || error.message.includes('the client is offline'))) {
      console.warn("Firestore backend offline - operating seamlessly in local mode.");
    } else {
      console.warn("Firestore connection check note:", error instanceof Error ? error.message : String(error));
    }
  }
}

testConnection().catch(() => {});
