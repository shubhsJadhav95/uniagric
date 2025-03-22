"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "@/components/ui/chart"

const data = [
  { name: "Q1", actual: 5.2, projected: 5.2 },
  { name: "Q2", actual: 5.8, projected: 5.8 },
  { name: "Q3", actual: 6.5, projected: 6.5 },
  { name: "Q4", actual: 7.2, projected: 7.2 },
  { name: "Q5", projected: 7.8 },
  { name: "Q6", projected: 8.3 },
  { name: "Q7", projected: 8.6 },
  { name: "Q8", projected: 8.9 },
  { name: "Q9", projected: 9.1 },
  { name: "Q10", projected: 9.2 },
  { name: "Q11", projected: 9.3 },
  { name: "Q12", projected: 9.4 },
]

export function ProjectedReturnChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value}%`, "Return"]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#4CAF50"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Actual Return"
        />
        <Line
          type="monotone"
          dataKey="projected"
          stroke="#2196F3"
          strokeDasharray="5 5"
          strokeWidth={2}
          name="Projected Return"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

