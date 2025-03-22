import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface Portfolio {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'completed';
  totalInvestment: number;
  currentValue: number;
  returnRate: number;
  farms: Array<{
    id: string;
    name: string;
    allocation: number;
    status: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export async function getPortfolioById(id: string): Promise<Portfolio | null> {
  try {
    const portfolioRef = doc(db, 'portfolios', id);
    const portfolioSnap = await getDoc(portfolioRef);

    if (!portfolioSnap.exists()) {
      return null;
    }

    const data = portfolioSnap.data();
    return {
      id: portfolioSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
} 