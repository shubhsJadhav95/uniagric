import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Portfolio } from "@/lib/firebase/portfolios";

interface PortfolioDetailsProps {
  portfolio: Portfolio;
}

export function PortfolioDetails({ portfolio }: PortfolioDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{portfolio.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Investment</p>
              <p className="text-2xl font-semibold">${portfolio.totalInvestment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-2xl font-semibold">${portfolio.currentValue.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Return Rate</p>
            <p className={`text-2xl font-semibold ${portfolio.returnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolio.returnRate >= 0 ? '+' : ''}{portfolio.returnRate}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Farms</p>
            <div className="space-y-2">
              {portfolio.farms.map((farm) => (
                <div key={farm.id} className="flex justify-between items-center">
                  <span>{farm.name}</span>
                  <span className="text-muted-foreground">{farm.allocation}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 