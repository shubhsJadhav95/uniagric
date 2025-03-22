import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowUpRight, Clock, Leaf, LineChart, PenSquare, ShieldCheck, Sprout } from "lucide-react"
import Link from "next/link"
import { FarmerHeader } from "@/components/farmer-header"
import { FarmerEarningsChart } from "@/components/farmer-earnings-chart"
import { FarmerMetricsCard } from "@/components/farmer-metrics-card"
import { Badge } from "@/components/ui/badge"

export default function FarmerDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <FarmerHeader />

      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            <section>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, Maria</h1>
                  <p className="text-muted-foreground">Track your farm's performance and funding status</p>
                </div>
                <Button className="bg-[#8D6E63] hover:bg-[#8D6E63]/90 w-full md:w-auto" asChild>
                  <Link href="/farmer/applications/new">
                    <PenSquare className="mr-2 h-4 w-4" />
                    New Funding Application
                  </Link>
                </Button>
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
              <FarmerMetricsCard
                title="Total Funding"
                value="$75,000"
                trend="+12.5% from last month"
                trendDirection="up"
                icon={<LineChart className="w-5 h-5" />}
              />
              <FarmerMetricsCard
                title="Active Investors"
                value="17"
                trend="+3 new this month"
                trendDirection="up"
                icon={<Leaf className="w-5 h-5" />}
              />
              <FarmerMetricsCard
                title="Farm Rating"
                value="94/100"
                trend="+2 points improvement"
                trendDirection="up"
                icon={<ShieldCheck className="w-5 h-5" />}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Farm Status Overview</CardTitle>
                  <CardDescription>Current funding and application status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Current Funding Status</h3>
                      <Badge className="bg-green-500">Funded</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Funding Target: $100,000</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Funding Received</p>
                        <p className="font-medium">$75,000</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Remaining Goal</p>
                        <p className="font-medium">$25,000</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Funding Deadline</p>
                        <p className="font-medium">45 days</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Pending Applications</h3>
                    <div className="space-y-3">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">Equipment Upgrade</h4>
                            <p className="text-sm text-muted-foreground">$15,000 - Irrigation Systems</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                          >
                            Under Review
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Submitted 3 days ago</span>
                        </div>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">Storage Facility</h4>
                            <p className="text-sm text-muted-foreground">$30,000 - Cold Storage</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                          >
                            Additional Info Needed
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Submitted 7 days ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/farmer/applications">View All Applications</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Earnings & Payout</CardTitle>
                  <CardDescription>Monthly earnings and investor payouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <FarmerEarningsChart />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Average</p>
                      <p className="font-medium">$8,750</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Investor Share</p>
                      <p className="font-medium">$2,625</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Your Earnings</p>
                      <p className="font-medium">$6,125</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Personalized insights for your farm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Sprout className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Optimize Crop Rotation</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on soil analysis and market trends, consider rotating from corn to soybeans in the
                          eastern field for the next growing season. This could increase yield by approximately 15% and
                          improve soil health.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-green-600" size="sm">
                          Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Weather Alert: Prepare for Dry Period</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Long-range forecasts predict lower than average rainfall over the next 8 weeks. Consider
                          adjusting irrigation schedules and implementing water conservation measures to mitigate
                          potential impact on crop yield.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-blue-600" size="sm">
                          View detailed forecast <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <LineChart className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Market Opportunity: Organic Certification</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your current farming practices are 85% aligned with organic certification requirements.
                          Completing the transition could increase crop value by 30-40% in current market conditions.
                          Estimated investment for certification: $12,000.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-amber-600" size="sm">
                          Explore certification process <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Estimations</CardTitle>
                  <CardDescription>Projections for the next quarter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Revenue Forecast</h3>
                      <span className="text-sm text-green-600">↑ 8.5%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Current Quarter</p>
                        <p className="text-lg font-bold">$94,500</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Next Quarter</p>
                        <p className="text-lg font-bold">$102,500</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Key Metrics Projection</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span>Crop Yield</span>
                          <span className="font-medium">+12%</span>
                        </div>
                        <Progress value={62} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span>Operational Costs</span>
                          <span className="font-medium">-5%</span>
                        </div>
                        <Progress value={45} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span>Market Demand</span>
                          <span className="font-medium">+15%</span>
                        </div>
                        <Progress value={75} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/farmer/financial">Full Financial Report</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

