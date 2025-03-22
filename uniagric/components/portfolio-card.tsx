import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

interface PortfolioCardProps {
  title: string
  timeframe: string
  risk: string
  riskColor: string
  expectedReturn: string
  description: string
  portfolioId: string
}

export function PortfolioCard({
  title,
  timeframe,
  risk,
  riskColor,
  expectedReturn,
  description,
  portfolioId,
}: PortfolioCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge style={{ backgroundColor: riskColor, color: "white" }}>{risk} Risk</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{timeframe}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-[#4CAF50]" />
            <span className="font-medium text-[#4CAF50]">{expectedReturn}</span>
            <span className="text-muted-foreground">expected return</span>
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-[#2196F3] hover:bg-[#2196F3]/90" asChild>
          <Link href={`/investor/portfolios/${portfolioId}`}>View Portfolio</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

