'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Farm {
  id: string;
  farmName: string;
  location: string;
  size: number;
  investmentNeeded: number;
  riskCategory: string;
  description: string;
  cropType: string;
  expectedYield: number;
  returnRate: number;
  status: 'available' | 'invested';
  createdAt: Date;
  farmerId: string;
}

interface Investment {
  id: string;
  farmId: string;
  investorId: string;
  amount: number;
  date: Date;
  status: 'active' | 'completed';
  returns: number;
}

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available farms
  useEffect(() => {
    const farmsQuery = query(
      collection(db, 'farmListings'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(farmsQuery, (snapshot) => {
      const farmsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Farm[];
      setFarms(farmsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Add new farm listing
  const addFarm = async (farmData: Omit<Farm, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'farmListings'), {
        ...farmData,
        status: 'available',
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };

  // Invest in a farm
  const investInFarm = async (farmId: string, amount: number, investorId: string) => {
    try {
      // Update farm status
      const farmRef = doc(db, 'farmListings', farmId);
      await updateDoc(farmRef, {
        status: 'invested',
        investedAt: new Date(),
        investorId
      });

      // Create investment record
      const investmentRef = await addDoc(collection(db, 'investments'), {
        farmId,
        investorId,
        amount,
        date: new Date(),
        status: 'active',
        returns: 0
      });

      // Create profit distribution record
      await addDoc(collection(db, 'profitDistributions'), {
        farmId,
        investorId,
        amount: 0,
        date: new Date(),
        status: 'pending'
      });

      return investmentRef.id;
    } catch (error) {
      throw error;
    }
  };

  // Fetch user's investments
  const fetchUserInvestments = async (userId: string) => {
    try {
      const investmentsQuery = query(
        collection(db, 'investments'),
        where('investorId', '==', userId),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(investmentsQuery);
      const investmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Investment[];
      
      setInvestments(investmentsData);
      return investmentsData;
    } catch (error) {
      throw error;
    }
  };

  return {
    farms,
    investments,
    loading,
    addFarm,
    investInFarm,
    fetchUserInvestments
  };
} 