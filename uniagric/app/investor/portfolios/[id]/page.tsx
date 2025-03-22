import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight, ChevronLeft, Clock } from "lucide-react"
import Link from "next/link"
import { InvestorHeader } from "@/components/investor-header"
import { DetailedFarmCard } from "@/components/detailed-farm-card"
import { PortfolioAllocationChart } from "@/components/portfolio-allocation-chart"
import { ProjectedReturnChart } from "@/components/projected-return-chart"

export default function PortfolioBreakdown({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the portfolio data based on the ID
  const portfolioId = params.id

  // Sample portfolio details
  const portfolio = {
    title: "Sustainable Growth",
    timeframe: "1-3 years",
    risk: "Low",
    riskColor: "#4CAF50",
    expectedReturn: "6-9%",
    description:
      "Established farms with proven track records focusing on sustainable and environmentally-friendly farming practices. This portfolio offers stable returns with minimal risk exposure.",
    totalInvestment: "$50,000",
    minInvestment: "$5,000",
    investorsCount: 27,
    fundingCompletion: 82,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <InvestorHeader />

      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/investor/dashboard">
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <h1 className="text-3xl font-bold">Portfolio Breakdown</h1>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{portfolio.title}</CardTitle>
                        <Badge style={{ backgroundColor: portfolio.riskColor, color: "white" }}>
                          {portfolio.risk} Risk
                        </Badge>
                      </div>
                      <CardDescription className="max-w-3xl">{portfolio.description}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-muted-foreground">Expected ROI</div>
                      <div className="text-3xl font-bold text-[#4CAF50]">{portfolio.expectedReturn}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{portfolio.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Investment</p>
                      <p className="text-xl font-semibold">{portfolio.totalInvestment}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Minimum Investment</p>
                      <p className="text-xl font-semibold">{portfolio.minInvestment}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Current Investors</p>
                      <p className="text-xl font-semibold">{portfolio.investorsCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Funding Completion</p>
                      <p className="text-xl font-semibold">{portfolio.fundingCompletion}%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col md:flex-row gap-4">
                  <Button className="w-full md:w-auto" size="lg" asChild>
                    <Link href={`/investor/portfolios/${portfolioId}/invest`}>Invest Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto" size="lg">
                    Download Portfolio Report
                  </Button>
                </CardFooter>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Farm Listings</CardTitle>
                    <CardDescription>Selected farms in this portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <DetailedFarmCard
                        name="Green Valley Organics"
                        location="California, USA"
                        cropType="Mixed Vegetables"
                        allocation="25%"
                        riskLevel="Low"
                        riskColor="#4CAF50"
                        expectedRoi="7.5%"
                        weatherScore={95}
                        soilQuality={92}
                        farmerScore={98}
                        description="Established organic vegetable farm with diverse crop rotation and efficient irrigation systems. Weather conditions are favorable year-round with consistent soil quality maintenance."
                      />

                      <DetailedFarmCard
                        name="Sunrise Orchard"
                        location="Washington, USA"
                        cropType="Apples & Pears"
                        allocation="20%"
                        riskLevel="Low"
                        riskColor="#4CAF50"
                        expectedRoi="6.8%"
                        weatherScore={90}
                        soilQuality={95}
                        farmerScore={97}
                        description="Multi-generational family-owned orchard with advanced cold storage facilities to extend selling season. Consistently produces premium quality fruits with established market channels."
                      />

                      <DetailedFarmCard
                        name="Pacific Coast Berries"
                        location="Oregon, USA"
                        cropType="Berries"
                        allocation="15%"
                        riskLevel="Low"
                        riskColor="#4CAF50"
                        expectedRoi="7.2%"
                        weatherScore={88}
                        soilQuality={90}
                        farmerScore={93}
                        description="Specialized in premium berries with both fresh market and processing contracts. Uses tunnel technology to extend growing season and protect crops from adverse weather."
                      />

                      <DetailedFarmCard
                        name="Midwest Grains Cooperative"
                        location="Iowa, USA"
                        cropType="Corn & Soybeans"
                        allocation="30%"
                        riskLevel="Low"
                        riskColor="#4CAF50"
                        expectedRoi="6.5%"
                        weatherScore={85}
                        soilQuality={98}
                        farmerScore={96}
                        description="Large-scale cooperative with advanced machinery and efficient operations. Implements precision agriculture techniques and has excellent grain storage facilities."
                      />

                      <DetailedFarmCard
                        name="Southern Heritage Farm"
                        location="Georgia, USA"
                        cropType="Pecans & Specialty Crops"
                        allocation="10%"
                        riskLevel="Low"
                        riskColor="#4CAF50"
                        expectedRoi="8.1%"
                        weatherScore={92}
                        soilQuality={88}
                        farmerScore={90}
                        description="Diversified operation with established pecan orchards and rotating specialty crops. Strong local market presence and developing export channels."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Allocation</CardTitle>
                    <CardDescription>Distribution of investment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <PortfolioAllocationChart />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projected ROI</CardTitle>
                    <CardDescription>Expected returns over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ProjectedReturnChart />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>Key risk factors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Weather Patterns</p>
                        <p className="text-sm text-muted-foreground">
                          Low risk - Portfolio farms are in diverse climate regions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Market Stability</p>
                        <p className="text-sm text-muted-foreground">
                          Low risk - Established contracts and diverse market channels
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Resource Management</p>
                        <p className="text-sm text-muted-foreground">
                          Medium risk - Water access challenges in some regions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mt-4">
              <div className="flex justify-center">
                <Button size="lg" className="bg-[#4CAF50] hover:bg-[#4CAF50]/90" asChild>
                  <Link href={`/investor/portfolios/${portfolioId}/invest`}>
                    Invest Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

