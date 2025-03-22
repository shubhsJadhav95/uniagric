import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { ReactNode } from "react"

interface MetricsCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
}

export function MetricsCard({ title, value, description, icon }: MetricsCardProps) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="font-medium text-muted-foreground">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

