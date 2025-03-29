// Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
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
  addDoc
} from 'firebase/firestore';
import { Profile } from './dualite';

// Firebase configuration - replace with your own config from Firebase console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase - only if no apps exist (prevents re-initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

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

// ============== AUTH FUNCTIONS ==============
// Sign up
export const signUp = async (email: string, password: string, name: string): Promise<FirebaseUser | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's profile with their name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      return userCredential.user as FirebaseUser;
    }
    return null;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in
export const signIn = async (email: string, password: string): Promise<FirebaseUser | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user as FirebaseUser;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Auth state change listener
export const onAuthChange = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user as FirebaseUser | null);
  });
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser as FirebaseUser | null;
};

// ============== PROFILE FUNCTIONS ==============
// Create or update a profile
export const createOrUpdateProfile = async (profile: Omit<FirebaseProfile, 'createdAt' | 'updatedAt'>): Promise<string> => {
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