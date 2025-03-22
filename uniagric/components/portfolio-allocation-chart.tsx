"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "@/components/ui/chart"

const data = [
  { name: "Green Valley Organics", value: 25, color: "#10b981" },
  { name: "Sunrise Orchard", value: 20, color: "#f59e0b" },
  { name: "Pacific Coast Berries", value: 15, color: "#ec4899" },
  { name: "Midwest Grains Cooperative", value: 30, color: "#6366f1" },
  { name: "Southern Heritage Farm", value: 10, color: "#8b5cf6" },
]

export function PortfolioAllocationChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  )
}

