import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Leaf, LineChart, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { LandingHeader } from "@/components/landing-header"
import { Testimonial } from "@/components/testimonial"
import { MetricsCard } from "@/components/metrics-card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] w-full flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Agricultural landscape"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
          </div>

          <div className="container flex flex-col items-center z-10 gap-8 px-4 md:px-6">
            <Image
              src="/placeholder.jpg"
              alt="Agricultural growth"
              width={500}
              height={300}
              className="rounded-lg shadow-lg mb-6 border-2 border-white/10"
              priority
            />
            <div className="max-w-3xl text-white space-y-6 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Connecting Investors with Farmers for Sustainable Growth
              </h1>
              <p className="text-lg md:text-xl opacity-90 mx-auto">
                UniAgric bridges the gap between agricultural innovation and financial investment, creating
                opportunities for growth while supporting sustainable farming practices.
              </p>
              <div className="max-w-2xl mx-auto">
                <p className="text-white/80 leading-relaxed">
                  Our platform uses AI-driven risk assessment to match investors with vetted agricultural projects.
                  Farmers gain access to capital without traditional banking constraints, while investors diversify
                  their portfolios with sustainable, high-yield opportunities in the agricultural sector.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="#get-started">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                  asChild
                >
                  <Link href="#learn-more">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Action Cards Section */}
        <section id="get-started" className="py-20 bg-[#F5F5F5]">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Choose Your Path</h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-[#4CAF50]/20 hover:border-[#4CAF50] transition-all duration-300 shadow-md hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mb-4">
                    <LineChart className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <CardTitle className="text-2xl">For Investors</CardTitle>
                  <CardDescription>Diversify your portfolio with sustainable agricultural investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                      <span>Access risk-categorized investment portfolios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                      <span>Track performance with real-time analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                      <span>Invest based on AI-driven risk assessments</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90" asChild>
                    <Link href="/investor/dashboard">
                      Investor Dashboard <ChevronRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-[#8D6E63]/20 hover:border-[#8D6E63] transition-all duration-300 shadow-md hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-[#8D6E63]" />
                  </div>
                  <CardTitle className="text-2xl">For Farmers</CardTitle>
                  <CardDescription>Secure funding and grow your agricultural business</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#8D6E63] shrink-0 mt-0.5" />
                      <span>Access capital without traditional banking constraints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#8D6E63] shrink-0 mt-0.5" />
                      <span>Receive AI-driven recommendations for optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#8D6E63] shrink-0 mt-0.5" />
                      <span>Connect with investors who value sustainable agriculture</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#8D6E63] hover:bg-[#8D6E63]/90" asChild>
                    <Link href="/farmer/register">
                      Register Farm <ChevronRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Historical Data & Metrics Section */}
        <section id="learn-more" className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-muted-foreground text-lg">
                UniAgric has connected investors with farmers across the globe, creating sustainable growth and
                profitable returns.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <MetricsCard
                title="Average ROI"
                value="14.2%"
                description="Higher than traditional investment vehicles"
                icon={<LineChart className="w-5 h-5" />}
              />
              <MetricsCard
                title="Farms Funded"
                value="1,230+"
                description="Across 24 countries worldwide"
                icon={<Leaf className="w-5 h-5" />}
              />
              <MetricsCard
                title="Success Rate"
                value="97.8%"
                description="Of farms meeting or exceeding projections"
                icon={<ShieldCheck className="w-5 h-5" />}
              />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">Success Stories</h3>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Testimonial
                name="Olivia Johnson"
                role="Investor"
                image="/placeholder.svg?height=200&width=200"
                quote="UniAgric has transformed my investment strategy. The risk-based portfolios allowed me to diversify with confidence, and my agricultural investments have outperformed my tech stocks for the past year."
              />
              <Testimonial
                name="Carlos Rodriguez"
                role="Farmer"
                image="/placeholder.svg?height=200&width=200"
                quote="As a third-generation farmer, finding capital was always challenging. UniAgric connected me with investors who believed in my vision, and now my organic farm has expanded to three times its original size."
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-[#2E2E2E] text-white">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="mb-6 text-white/80">
                  Our team is ready to help you navigate the world of agricultural investment. Contact us today to learn
                  more about how UniAgric can help you grow.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4CAF50]/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span>contact@uniagric.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4CAF50]/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-medium mb-4">Send Us a Message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="First Name"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <textarea
                      className="w-full min-h-[120px] rounded-md border bg-white/5 border-white/10 p-3 text-white placeholder:text-white/50"
                      placeholder="Your Message"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#2E2E2E] border-t border-white/10 py-6 text-white/70">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} UniAgric. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

