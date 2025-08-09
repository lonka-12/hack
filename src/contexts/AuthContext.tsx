import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getAdditionalUserInfo,
} from "firebase/auth";
import { doc, setDoc, getDoc, getDocFromCache } from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase";
import type { ChatConversation } from "../types";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
  treatmentFormData?: {
    selectedState: string;
    cancerType: string;
    stage: string;
    insuranceType: string;
  };
  chatConversations?: ChatConversation[];
  lastUpdated?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateTreatmentFormData: (data: {
    selectedState: string;
    cancerType: string;
    stage: string;
    insuranceType: string;
  }) => Promise<void>;
  updateChatConversation: (conversation: ChatConversation) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Cache helpers to reduce Firestore calls
  const USER_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
  const getUserCacheKey = (uid: string) => `userData:${uid}`;

  const loadUserDataFromCache = (uid: string): UserData | null => {
    try {
      const raw = localStorage.getItem(getUserCacheKey(uid));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { data: UserData; cachedAt: number };
      const isFresh = Date.now() - parsed.cachedAt < USER_CACHE_TTL_MS;
      return isFresh ? parsed.data : null;
    } catch {
      return null;
    }
  };

  const saveUserDataToCache = (data: UserData) => {
    try {
      localStorage.setItem(
        getUserCacheKey(data.uid),
        JSON.stringify({ data, cachedAt: Date.now() })
      );
    } catch {
      // ignore
    }
  };

  const saveUserToDatabase = async (
    user: User,
    displayName?: string,
    options?: { skipExistenceCheck?: boolean }
  ) => {
    const { skipExistenceCheck = false } = options ?? {};
    // 0) If cache has it, avoid writes
    const cached = loadUserDataFromCache(user.uid);
    if (cached) {
      setUserData(cached);
      return;
    }

    // 1) Try Firestore cache first
    try {
      const cachedSnap = await getDocFromCache(doc(db, "users", user.uid));
      if (cachedSnap.exists()) {
        const data = cachedSnap.data() as UserData;
        setUserData(data);
        saveUserDataToCache(data);
        return;
      }
    } catch {
      // ignore
    }

    // 2) Optionally check server if doc exists to avoid unnecessary writes
    if (!skipExistenceCheck) {
      const existing = await getDoc(doc(db, "users", user.uid));
      if (existing.exists()) {
        const data = existing.data() as UserData;
        setUserData(data);
        saveUserDataToCache(data);
        return;
      }
    }

    // 3) Create only if missing
    const newUserData: UserData = {
      uid: user.uid,
      email: user.email || "",
      displayName: displayName || user.displayName || "User",
      photoURL: user.photoURL || "",
      createdAt: new Date(),
    };
    await setDoc(doc(db, "users", user.uid), newUserData, { merge: true });
    setUserData(newUserData);
    saveUserDataToCache(newUserData);
  };

  const fetchUserData = async (
    uid: string,
    options?: { forceServer?: boolean }
  ) => {
    const { forceServer = false } = options ?? {};

    // 1) In-memory short-circuit
    if (userData && userData.uid === uid && !forceServer) {
      return;
    }

    // 2) LocalStorage cache
    const cached = loadUserDataFromCache(uid);
    if (cached && !forceServer) {
      setUserData(cached);
      return;
    }

    // 3) Firestore cache (IndexedDB) without hitting network if available
    try {
      if (!forceServer) {
        const cachedSnap = await getDocFromCache(doc(db, "users", uid));
        if (cachedSnap.exists()) {
          const data = cachedSnap.data() as UserData;
          setUserData(data);
          saveUserDataToCache(data);
          return;
        }
      }
    } catch {
      // cache miss or not available
    }

    // 4) Server fetch as last resort
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      setUserData(data);
      saveUserDataToCache(data);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToDatabase(result.user, displayName, {
      skipExistenceCheck: true,
    });
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const info = getAdditionalUserInfo(result);
    const isNew = Boolean(info?.isNewUser);
    await saveUserToDatabase(result.user, undefined, {
      skipExistenceCheck: isNew,
    });
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const updateTreatmentFormData = async (data: {
    selectedState: string;
    cancerType: string;
    stage: string;
    insuranceType: string;
  }) => {
    if (!currentUser || !userData) return;

    const updatedUserData: UserData = {
      ...userData,
      treatmentFormData: data,
      lastUpdated: new Date().toISOString(),
    };

    // Update local state immediately
    setUserData(updatedUserData);

    // Update cache
    saveUserDataToCache(updatedUserData);

    // Update sessionStorage for immediate access
    try {
      sessionStorage.setItem(
        `user_${currentUser.uid}_treatmentForm`,
        JSON.stringify({ uid: currentUser.uid, treatmentFormData: data })
      );
    } catch (error) {
      console.warn("Failed to update sessionStorage:", error);
    }
  };

  const updateChatConversation = async (conversation: ChatConversation) => {
    if (!currentUser || !userData) return;

    const existingConversations = userData.chatConversations || [];
    const conversationIndex = existingConversations.findIndex(
      (conv) => conv.id === conversation.id
    );

    let updatedConversations: ChatConversation[];
    if (conversationIndex >= 0) {
      // Update existing conversation
      updatedConversations = [...existingConversations];
      updatedConversations[conversationIndex] = conversation;
    } else {
      // Add new conversation
      updatedConversations = [...existingConversations, conversation];
    }

    const updatedUserData: UserData = {
      ...userData,
      chatConversations: updatedConversations,
      lastUpdated: new Date().toISOString(),
    };

    // Update local state immediately
    setUserData(updatedUserData);

    // Update cache
    saveUserDataToCache(updatedUserData);

    // Update sessionStorage for immediate access
    try {
      sessionStorage.setItem(
        `user_${currentUser.uid}_chatConversations`,
        JSON.stringify({
          uid: currentUser.uid,
          chatConversations: updatedConversations,
        })
      );
    } catch (error) {
      console.warn("Failed to update sessionStorage:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Try cache-first; only hit server if nothing cached
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateTreatmentFormData,
    updateChatConversation,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
