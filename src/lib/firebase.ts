// Firebase configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  addDoc,
  Firestore,
  enableIndexedDbPersistence,
  limit
} from 'firebase/firestore';
import { Profile } from './dualite';

// Check if we have the required Firebase configuration
const hasValidConfig = 
  typeof process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'string' && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 0;

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase conditionally
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

// Only initialize Firebase if we're in the browser and have valid config
const isBrowser = typeof window !== 'undefined';
if (isBrowser && hasValidConfig) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    
    // Initialize Firestore with retry mechanism
    const initFirestore = async (retryCount = 0, maxRetries = 3) => {
      try {
        // Make sure app is defined before proceeding
        if (!app) {
          console.error('Firebase app is undefined');
          return;
        }
        
        const firestore = getFirestore(app);
        
        // Enable offline persistence with better error handling
        try {
          await enableIndexedDbPersistence(firestore);
          console.log('Firebase persistence enabled successfully');
        } catch (err: any) {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.warn('Firebase persistence failed: Multiple tabs open');
          } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the features required to enable persistence
            console.warn('Firebase persistence not supported in this browser');
          } else {
            console.error('Error enabling Firebase persistence:', err);
          }
        }
        
        // Test connection with a simple query to validate Firestore is working
        try {
          const testRef = collection(firestore, 'system_check');
          await getDocs(query(testRef, limit(1)));
          console.log('Firestore connection successful');
        } catch (connErr) {
          console.warn('Firestore connection test failed:', connErr);
          
          // If we haven't reached max retries, try again with exponential backoff
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s, etc.
            console.log(`Retrying Firestore connection in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            
            setTimeout(() => {
              initFirestore(retryCount + 1, maxRetries);
            }, delay);
            
            return;
          }
        }
        
        // If we got here, assign db
        db = firestore;
      } catch (error) {
        console.error('Failed to initialize Firestore:', error);
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying Firestore initialization in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
          
          setTimeout(() => {
            initFirestore(retryCount + 1, maxRetries);
          }, delay);
        }
      }
    };
    
    // Start the initialization process
    initFirestore();
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

// User Interface
export interface FirebaseUser extends User {
  // Any additional fields you want to include
}

// Profile interfaces
export interface FirebaseProfile extends Omit<Profile, 'id'> {
  userId: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// Chat interfaces
export interface ChatMessage {
  id?: string;
  text: string;
  senderId: string;
  recipientId: string;
  status: 'sending' | 'sent' | 'error' | 'read';
  timestamp: Timestamp | null;
}

export interface ChatConversation {
  id?: string;
  participants: string[];
  lastMessage?: ChatMessage;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// Helper to check if Firebase is initialized
const isFirebaseInitialized = () => {
  return !!app && !!db && !!auth;
};

// ============== AUTH FUNCTIONS ==============
// Sign up
export const signUp = async (email: string, password: string, name: string): Promise<{success: boolean, user: FirebaseUser | null, error?: string}> => {
  if (!isFirebaseInitialized() || !auth) {
    console.warn('Firebase not initialized or running in SSR context');
    return {success: false, user: null, error: 'Firebase not initialized'};
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's profile with their name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      return {success: true, user: userCredential.user as FirebaseUser};
    }
    return {success: false, user: null, error: 'Failed to create user'};
  } catch (error: any) {
    console.error('Error signing up:', error);
    return {success: false, user: null, error: error.message || 'Sign up failed'};
  }
};

// Sign in
export const signIn = async (email: string, password: string): Promise<{success: boolean, user: FirebaseUser | null, error?: string}> => {
  if (!isFirebaseInitialized() || !auth) {
    console.warn('Firebase not initialized or running in SSR context');
    return {success: false, user: null, error: 'Firebase not initialized'};
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {success: true, user: userCredential.user as FirebaseUser};
  } catch (error: any) {
    console.error('Error signing in:', error);
    return {success: false, user: null, error: error.message || 'Sign in failed'};
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  if (!isFirebaseInitialized() || !auth) {
    console.warn('Firebase not initialized or running in SSR context');
    return;
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Auth state change listener
export const onAuthChange = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  if (!isFirebaseInitialized() || !auth) {
    console.warn('Firebase not initialized or running in SSR context');
    // Return a no-op function
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    callback(user as FirebaseUser | null);
  });
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  if (!isFirebaseInitialized() || !auth) return null;
  return auth.currentUser as FirebaseUser | null;
};

// ============== PROFILE FUNCTIONS ==============
// Create or update a profile
export const createOrUpdateProfile = async (profile: Omit<FirebaseProfile, 'createdAt' | 'updatedAt'>): Promise<string | null> => {
  if (!isFirebaseInitialized() || !db) {
    console.warn('Firebase not initialized or running in SSR context');
    return null;
  }

  try {
    const { userId, ...profileData } = profile;
    const userRef = doc(db, 'profiles', userId);
    
    // Check if profile already exists
    const profileDoc = await getDoc(userRef);
    
    if (profileDoc.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new profile
      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return userId;
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    throw error;
  }
};

// Get a profile by user ID
export const getProfileByUserId = async (userId: string): Promise<FirebaseProfile | null> => {
  if (!isFirebaseInitialized() || !db) {
    console.warn('Firebase not initialized or running in SSR context');
    return null;
  }

  try {
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    
    if (profileDoc.exists()) {
      return { 
        userId,
        ...profileDoc.data() 
      } as FirebaseProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

// Get all profiles
export const getAllProfiles = async (): Promise<Profile[]> => {
  if (!isFirebaseInitialized() || !db) {
    console.warn('Firebase not initialized or running in SSR context');
    return [];
  }

  try {
    const profilesSnapshot = await getDocs(collection(db, 'profiles'));
    
    return profilesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created: doc.data().createdAt?.toMillis() || Date.now()
    })) as Profile[];
  } catch (error) {
    console.error('Error getting all profiles:', error);
    throw error;
  }
};

// ============== CHAT FUNCTIONS ==============
// Get or create a conversation between two users
export const getOrCreateConversation = async (userId1: string, userId2: string): Promise<string> => {
  if (!isFirebaseInitialized() || !db) {
    console.warn('Firebase not initialized or running in SSR context');
    throw new Error('Firebase not initialized');
  }

  try {
    // Sort IDs to ensure consistent conversation doc IDs
    const participants = [userId1, userId2].sort();
    
    // Query for existing conversation
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef, 
      where('participants', '==', participants)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Return existing conversation
      return querySnapshot.docs[0].id;
    }
    
    // Create new conversation
    const newConversationRef = await addDoc(conversationsRef, {
      participants,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return newConversationRef.id;
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error;
  }
};

// Send a message in a conversation
export const sendMessage = async (
  conversationId: string, 
  senderId: string, 
  recipientId: string, 
  text: string
): Promise<string> => {
  if (!isFirebaseInitialized() || !db) {
    console.warn('Firebase not initialized or running in SSR context');
    throw new Error('Firebase not initialized');
  }

  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    
    const newMessageRef = await addDoc(messagesRef, {
      text,
      senderId,
      recipientId,
      status: 'sent',
      timestamp: serverTimestamp()
    });
    
    // Update the conversation's last message and timestamp
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: {
        text,
        senderId,
        timestamp: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });
    
    return newMessageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Listen to messages in a conversation
export const listenToMessages = (
  conversationId: string, 
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  if (!isFirebaseInitialized() || !db) {
    console.warn('Firebase not initialized or running in SSR context');
    return () => {};
  }

  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    
    callback(messages);
  });
  
  return unsubscribe;
};

// Get user's conversations
export const getUserConversations = (
  userId: string, 
  callback: (conversations: ChatConversation[]) => void
): (() => void) => {
  if (!isFirebaseInitialized() || !db) {
    console.warn('Firebase not initialized or running in SSR context');
    return () => {};
  }

  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatConversation[];
    
    callback(conversations);
  });
  
  return unsubscribe;
};

export default { app, db, auth }; 