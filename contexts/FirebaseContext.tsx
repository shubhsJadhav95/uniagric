'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFarms } from '@/hooks/useFarms';

interface FirebaseContextType {
  user: any;
  userType: 'farmer' | 'investor' | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, userType: 'farmer' | 'investor') => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: (specificUserType?: 'farmer' | 'investor') => Promise<any>;
  signInWithPhone: (phoneNumber: string) => Promise<any>;
  logout: () => Promise<void>;
  checkUserExists: (uid: string, requiredType?: 'farmer' | 'investor') => Promise<{
    exists: boolean;
    correctType: boolean;
    currentType?: string;
    error?: any;
  }>;
  farms: any[];
  investments: any[];
  addFarm: (farmData: any) => Promise<string>;
  investInFarm: (farmId: string, amount: number, investorId: string) => Promise<string>;
  fetchUserInvestments: (userId: string) => Promise<any[]>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const farms = useFarms();

  const value = {
    ...auth,
    ...farms
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
} 