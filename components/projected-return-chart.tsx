"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ReturnData {
  month: string;
  projected: number;
  actual: number;
}

interface ProjectedReturnChartProps {
  data: ReturnData[];
}

export function ProjectedReturnChart({ data }: ProjectedReturnChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="projected" stroke="#8884d8" />
        <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

