"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface EarningsData {
  month: string;
  earnings: number;
}

interface FarmerEarningsChartProps {
  data: EarningsData[];
}

export function FarmerEarningsChart({ data }: FarmerEarningsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="earnings" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

