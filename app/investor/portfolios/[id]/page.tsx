import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortfolioDetails } from '@/components/investor/portfolio/PortfolioDetails';
import { PortfolioPerformance } from '@/components/investor/portfolio/PortfolioPerformance';
import { PortfolioTransactions } from '@/components/investor/portfolio/PortfolioTransactions';

export const metadata: Metadata = {
  title: 'Portfolio Details | UniAgric',
  description: 'View detailed information about your investment portfolio',
};

// Sample portfolio data for static generation
const samplePortfolios = {
  'portfolio-1': {
    id: 'portfolio-1',
    title: 'Sustainable Growth Portfolio',
    status: 'active' as const,
    totalInvestment: 50000,
    currentValue: 52500,
    returnRate: 5,
    farms: [
      { id: 'farm-1', name: 'Green Valley Farm', allocation: 40, status: 'active' },
      { id: 'farm-2', name: 'Sunrise Orchard', allocation: 30, status: 'active' },
      { id: 'farm-3', name: 'Pacific Coast Berries', allocation: 30, status: 'active' },
    ],
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 2, 15),
  },
  'portfolio-2': {
    id: 'portfolio-2',
    title: 'High Yield Portfolio',
    status: 'active' as const,
    totalInvestment: 75000,
    currentValue: 78750,
    returnRate: 5,
    farms: [
      { id: 'farm-4', name: 'Midwest Grains', allocation: 50, status: 'active' },
      { id: 'farm-5', name: 'Southern Heritage', allocation: 50, status: 'active' },
    ],
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 2, 15),
  },
  'portfolio-3': {
    id: 'portfolio-3',
    title: 'Balanced Growth Portfolio',
    status: 'pending' as const,
    totalInvestment: 100000,
    currentValue: 100000,
    returnRate: 0,
    farms: [
      { id: 'farm-6', name: 'Organic Valley', allocation: 40, status: 'pending' },
      { id: 'farm-7', name: 'Mountain View Ranch', allocation: 30, status: 'pending' },
      { id: 'farm-8', name: 'Coastal Farm', allocation: 30, status: 'pending' },
    ],
    createdAt: new Date(2024, 1, 1),
    updatedAt: new Date(2024, 2, 15),
  },
  'portfolio-4': {
    id: 'portfolio-4',
    title: 'Premium Farms Portfolio',
    status: 'active' as const,
    totalInvestment: 150000,
    currentValue: 157500,
    returnRate: 5,
    farms: [
      { id: 'farm-9', name: 'Elite Orchard', allocation: 60, status: 'active' },
      { id: 'farm-10', name: 'Premium Vineyard', allocation: 40, status: 'active' },
    ],
    createdAt: new Date(2024, 1, 15),
    updatedAt: new Date(2024, 2, 15),
  },
  'portfolio-5': {
    id: 'portfolio-5',
    title: 'Diversified Growth Portfolio',
    status: 'completed' as const,
    totalInvestment: 200000,
    currentValue: 220000,
    returnRate: 10,
    farms: [
      { id: 'farm-11', name: 'Mixed Crops Farm', allocation: 40, status: 'completed' },
      { id: 'farm-12', name: 'Livestock Ranch', allocation: 30, status: 'completed' },
      { id: 'farm-13', name: 'Specialty Crops', allocation: 30, status: 'completed' },
    ],
    createdAt: new Date(2023, 11, 1),
    updatedAt: new Date(2024, 2, 15),
  },
};

export async function generateStaticParams() {
  return Object.keys(samplePortfolios).map((id) => ({ id }));
}

type Props = {
  params: {
    id: string;
  };
};

export default async function PortfolioPage({ params }: Props) {
  // During build time, use sample data
  const portfolio = samplePortfolios[params.id as keyof typeof samplePortfolios];

  if (!portfolio) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Portfolio Details</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          portfolio.status === 'active' ? 'bg-green-100 text-green-800' :
          portfolio.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {portfolio.status.charAt(0).toUpperCase() + portfolio.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioDetails portfolio={portfolio} />
        <PortfolioPerformance portfolio={portfolio} />
      </div>

      <PortfolioTransactions portfolio={portfolio} />
    </div>
  );
}

