import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Portfolio } from "@/lib/firebase/portfolios";

interface PortfolioTransactionsProps {
  portfolio: Portfolio;
}

export function PortfolioTransactions({ portfolio }: PortfolioTransactionsProps) {
  // Sample transaction data
  const transactions = [
    {
      id: 1,
      date: new Date(2024, 2, 15),
      type: 'investment',
      amount: portfolio.totalInvestment,
      status: 'completed',
    },
    {
      id: 2,
      date: new Date(2024, 2, 20),
      type: 'distribution',
      amount: portfolio.totalInvestment * 0.05,
      status: 'completed',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div>
                <p className="font-medium capitalize">{transaction.type}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.date.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'investment' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'investment' ? '-' : '+'}${transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground capitalize">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 