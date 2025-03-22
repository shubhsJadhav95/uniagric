import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { ReactNode } from "react"

interface FarmerMetricsCardProps {
  title: string
  value: string
  trend: string
  trendDirection: "up" | "down" | "neutral"
  icon: ReactNode
}

export function FarmerMetricsCard({ title, value, trend, trendDirection, icon }: FarmerMetricsCardProps) {
  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      case "neutral":
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="font-medium text-muted-foreground">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-[#8D6E63]/10 flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold">{value}</div>
        <p className={`text-sm mt-1 ${getTrendColor()}`}>{trend}</p>
      </CardContent>
    </Card>
  )
}

