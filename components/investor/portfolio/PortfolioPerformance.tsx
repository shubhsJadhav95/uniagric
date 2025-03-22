import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Portfolio {
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

interface PortfolioPerformanceProps {
  portfolio: Portfolio;
}

export function PortfolioPerformance({ portfolio }: PortfolioPerformanceProps) {
  // Generate sample performance data
  const performanceData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
    value: portfolio.currentValue * (1 + (i * portfolio.returnRate / 100)),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4CAF50"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 