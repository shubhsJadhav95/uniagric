"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    earnings: 5000,
    investors: 1500,
    amt: 6500,
  },
  {
    name: "Feb",
    earnings: 5200,
    investors: 1560,
    amt: 6760,
  },
  {
    name: "Mar",
    earnings: 5800,
    investors: 1740,
    amt: 7540,
  },
  {
    name: "Apr",
    earnings: 6300,
    investors: 1890,
    amt: 8190,
  },
  {
    name: "May",
    earnings: 7100,
    investors: 2130,
    amt: 9230,
  },
  {
    name: "Jun",
    earnings: 7800,
    investors: 2340,
    amt: 10140,
  },
]

export function FarmerEarningsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
        <Legend />
        <Bar dataKey="investors" name="Investor Share" stackId="a" fill="#8D6E63" />
        <Bar dataKey="earnings" name="Your Earnings" stackId="a" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  )
}

