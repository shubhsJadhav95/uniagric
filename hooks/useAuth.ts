'use client';

import { useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'farmer' | 'investor' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch user type from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
        }
      } else {
        setUser(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkUserExists = async (uid: string, requiredType?: 'farmer' | 'investor') => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        return { exists: false, correctType: false };
      }
      
      const userType = userDoc.data().userType;
      if (requiredType && userType !== requiredType) {
        return { exists: true, correctType: false, currentType: userType };
      }
      
      return { exists: true, correctType: true, currentType: userType };
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { exists: false, correctType: false, error };
    }
  };

  const signUp = async (email: string, password: string, name: string, userType: 'farmer' | 'investor') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        userType,
        createdAt: new Date()
      });
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async (specificUserType?: 'farmer' | 'investor') => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // If this is a new user, create a document with the specified or default user type
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          userType: specificUserType || 'investor', // Use specified type or default to investor
          createdAt: new Date()
        });
      } else if (specificUserType) {
        // If a specific user type was requested and the user already exists, update their type
        await setDoc(doc(db, 'users', user.uid), {
          userType: specificUserType
        }, { merge: true });
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      const appVerifier = new RecaptchaVerifier(auth, 'phone-sign-in', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return confirmationResult;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    userType,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    logout,
    checkUserExists
  };
} 