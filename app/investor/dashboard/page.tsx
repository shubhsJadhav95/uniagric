'use client';

import { useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { InvestorPieChart } from '@/components/investor-pie-chart';
import { PortfolioAllocationChart } from '@/components/portfolio-allocation-chart';
import { ProjectedReturnChart } from '@/components/projected-return-chart';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ChevronRight } from "lucide-react"
import { InvestorHeader } from "@/components/investor-header"
import { FarmCard } from "@/components/farm-card"
import { PortfolioCard } from "@/components/portfolio-card"

const defaultPieData = [
  { name: 'Low Risk', value: 40 },
  { name: 'Medium Risk', value: 35 },
  { name: 'High Risk', value: 25 }
];

const defaultAllocationData = [
  { name: 'Green Valley Organics', value: 25 },
  { name: 'Sunrise Orchard', value: 20 },
  { name: 'Pacific Coast Berries', value: 15 },
  { name: 'Midwest Grains', value: 30 },
  { name: 'Southern Heritage', value: 10 }
];

const defaultReturnData = [
  { month: 'Jan', projected: 5.2, actual: 5.2 },
  { month: 'Feb', projected: 5.8, actual: 5.8 },
  { month: 'Mar', projected: 6.5, actual: 6.5 },
  { month: 'Apr', projected: 7.2, actual: 7.2 },
  { month: 'May', projected: 7.8, actual: null },
  { month: 'Jun', projected: 8.3, actual: null }
];

export default function InvestorDashboard() {
  const { user, userType, loading, investments, fetchUserInvestments } = useFirebase();

  useEffect(() => {
    if (user) {
      fetchUserInvestments(user.uid);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || userType !== 'investor') {
    return <div>Access denied. Please login as an investor.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <InvestorHeader />

      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            <section>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Michael</h1>
              <p className="text-muted-foreground mb-6">
                Explore personalized investment opportunities tailored to your risk profile and investment timeline.
              </p>
            </section>

            <section className="grid gap-6">
              <h2 className="text-2xl font-bold">Portfolio Application</h2>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Portfolios</TabsTrigger>
                  <TabsTrigger value="short-term">Short-Term</TabsTrigger>
                  <TabsTrigger value="medium-term">Medium-Term</TabsTrigger>
                  <TabsTrigger value="long-term">Long-Term</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PortfolioCard
                      title="Short-Term Growth"
                      timeframe="3-6 months"
                      risk="High"
                      riskColor="#ef4444"
                      expectedReturn="12-15%"
                      description="Seasonal crops with quick harvest cycles"
                      portfolioId="st001"
                    />

                    <PortfolioCard
                      title="Balanced Harvest"
                      timeframe="6-12 months"
                      risk="Medium"
                      riskColor="#f59e0b"
                      expectedReturn="8-12%"
                      description="Mix of seasonal and multi-harvest farms"
                      portfolioId="mt001"
                    />

                    <PortfolioCard
                      title="Sustainable Growth"
                      timeframe="1-3 years"
                      risk="Low"
                      riskColor="#4CAF50"
                      expectedReturn="6-9%"
                      description="Established farms with proven track records"
                      portfolioId="lt001"
                    />

                    <PortfolioCard
                      title="Innovation Fund"
                      timeframe="6-12 months"
                      risk="High"
                      riskColor="#ef4444"
                      expectedReturn="14-18%"
                      description="AgriTech farms utilizing cutting-edge technology"
                      portfolioId="mt002"
                    />

                    <PortfolioCard
                      title="Organic Expansion"
                      timeframe="1-3 years"
                      risk="Medium"
                      riskColor="#f59e0b"
                      expectedReturn="7-11%"
                      description="Certified organic farms with premium produce"
                      portfolioId="lt002"
                    />

                    <PortfolioCard
                      title="Global Diversity"
                      timeframe="2-5 years"
                      risk="Low"
                      riskColor="#4CAF50"
                      expectedReturn="5-8%"
                      description="Diversified farms across multiple regions"
                      portfolioId="lt003"
                    />
                  </div>
                </TabsContent>

                {/* Other tabs content would be similar */}
                <TabsContent value="short-term" className="space-y-6">
                  {/* Short-term portfolios */}
                </TabsContent>

                <TabsContent value="medium-term" className="space-y-6">
                  {/* Medium-term portfolios */}
                </TabsContent>

                <TabsContent value="long-term" className="space-y-6">
                  {/* Long-term portfolios */}
                </TabsContent>
              </Tabs>
            </section>

            <section className="grid gap-6 lg:grid-cols-3 mt-6">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Allocation</CardTitle>
                    <CardDescription>Current investment distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <InvestorPieChart data={defaultPieData} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>AI-generated insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Market Volatility</p>
                        <p className="text-sm text-muted-foreground">
                          Grain prices showing 12% fluctuation in the past month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Weather Conditions</p>
                        <p className="text-sm text-muted-foreground">
                          Favorable forecasts for all current portfolio regions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Diversification Score</p>
                        <p className="text-sm text-muted-foreground">
                          Your portfolio is well-diversified across 3 risk categories
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Farms</CardTitle>
                    <CardDescription>Based on your investment preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <FarmCard
                        name="Green Valley Organics"
                        location="California, USA"
                        cropType="Mixed Vegetables"
                        riskLevel="Low"
                        riskColor="#4CAF50"
                        expectedRoi="7.5%"
                        weatherScore={95}
                        soilQuality={92}
                        farmerScore={98}
                      />

                      <FarmCard
                        name="Sunshine Rice Paddy"
                        location="Thailand"
                        cropType="Rice"
                        riskLevel="Medium"
                        riskColor="#f59e0b"
                        expectedRoi="10.2%"
                        weatherScore={87}
                        soilQuality={90}
                        farmerScore={85}
                      />

                      <FarmCard
                        name="TechGrow Hydroponics"
                        location="Netherlands"
                        cropType="Leafy Greens"
                        riskLevel="High"
                        riskColor="#ef4444"
                        expectedRoi="15.8%"
                        weatherScore={99}
                        soilQuality={98}
                        farmerScore={92}
                      />

                      <FarmCard
                        name="Highland Coffee Estate"
                        location="Colombia"
                        cropType="Coffee"
                        riskLevel="Medium"
                        riskColor="#f59e0b"
                        expectedRoi="9.6%"
                        weatherScore={85}
                        soilQuality={95}
                        farmerScore={90}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Farms <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

