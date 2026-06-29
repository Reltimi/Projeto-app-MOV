import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";

// Config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyA-RP1RLKhwrmhMoIb_EtDQlcbjs4Ai8C8",
  authDomain: "sharp-density-d5xj8.firebaseapp.com",
  projectId: "sharp-density-d5xj8",
  storageBucket: "sharp-density-d5xj8.firebasestorage.app",
  messagingSenderId: "775370658599",
  appId: "1:775370658599:web:b43ebeee75e2cfc8198f02"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore using the custom database ID provided in config
const db = getFirestore(app, "ai-studio-movmercadodeorgn-740f8af8-9834-411e-a695-1815b2f6c729");

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Registration {
  id?: string;
  fullName: string;
  email: string;
  role: 'buyer' | 'seller';
  farmName?: string;
  taxId?: string;
  createdAt?: string; // ISO string for easy displaying or Date
}

/**
 * Saves a new user registration to the Firestore database
 */
export async function saveRegistration(registration: Omit<Registration, 'id' | 'createdAt'>): Promise<string> {
  const path = "registrations";
  try {
    const docRef = await addDoc(collection(db, path), {
      ...registration,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Fetches all registered users from the Firestore database, ordered by creation date desc
 */
export async function getRegistrations(): Promise<Registration[]> {
  const path = "registrations";
  try {
    const q = query(collection(db, path), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results: Registration[] = [];
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data()
      } as Registration);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

/**
 * Deletes a user registration from Firestore
 */
export async function deleteRegistration(id: string): Promise<void> {
  const path = `registrations/${id}`;
  try {
    const docRef = doc(db, "registrations", id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}


