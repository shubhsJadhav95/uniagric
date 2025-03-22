"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, ClipboardCheck, FileText, Upload } from "lucide-react"
import Image from "next/image"
import { FarmerRegistrationHeader } from "@/components/farmer-registration-header"

export default function FarmerRegistration() {
  return (
    <div className="flex flex-col min-h-screen">
      <FarmerRegistrationHeader />

      <main className="flex-1 py-10 bg-[#F5F5F5]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Farmer Registration</h1>
                <p className="text-muted-foreground">
                  Complete your farm profile to connect with investors and access funding opportunities.
                </p>
              </div>

              <div className="relative hidden lg:block">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Farmer with tablet"
                  width={600}
                  height={500}
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="text-white font-bold text-lg mb-1">Join 1,200+ Farmers Worldwide</h3>
                  <p className="text-white/90 text-sm">
                    UniAgric has helped farmers across 24 countries access over $50M in funding
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Farm Registration Form</CardTitle>
                  <CardDescription>All applications are verified and assessed by our AI system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="farm">Farm Details</TabsTrigger>
                      <TabsTrigger value="financial">Financial</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" placeholder="Your full name" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="you@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>

                      <div className="border-t pt-4 pb-2">
                        <h3 className="font-medium mb-3">Identity Verification</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="id-type">ID Type</Label>
                              <Select>
                                <SelectTrigger id="id-type">
                                  <SelectValue placeholder="Select ID Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="passport">Passport</SelectItem>
                                  <SelectItem value="drivers-license">Driver's License</SelectItem>
                                  <SelectItem value="national-id">National ID</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="id-number">ID Number</Label>
                              <Input id="id-number" placeholder="ID Number" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="id-upload">Upload ID Document</Label>
                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                              <p className="text-xs text-muted-foreground">
                                Supported formats: JPG, PNG, PDF (Max 5MB)
                              </p>
                              <Input id="id-upload" type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => document.getElementById("id-upload")?.click()}
                              >
                                Select File
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button>
                          Next Step <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="farm" className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="farm-name">Farm Name</Label>
                        <Input id="farm-name" placeholder="Your farm name" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="farm-type">Farm Type</Label>
                          <Select>
                            <SelectTrigger id="farm-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="crop">Crops</SelectItem>
                              <SelectItem value="livestock">Livestock</SelectItem>
                              <SelectItem value="mixed">Mixed</SelectItem>
                              <SelectItem value="specialty">Specialty</SelectItem>
                              <SelectItem value="aquaculture">Aquaculture</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ownership">Ownership Type</Label>
                          <Select>
                            <SelectTrigger id="ownership">
                              <SelectValue placeholder="Select ownership" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="corporation">Corporation</SelectItem>
                              <SelectItem value="cooperative">Cooperative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farm-location">Farm Location</Label>
                        <Input id="farm-location" placeholder="Full address of your farm" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="land-size">Land Size (acres)</Label>
                          <Input id="land-size" type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="years-operation">Years in Operation</Label>
                          <Input id="years-operation" type="number" placeholder="0" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="main-crops">Main Crops/Products</Label>
                        <Input id="main-crops" placeholder="e.g., Corn, Wheat, Vegetables" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farm-description">Farm Description</Label>
                        <Textarea
                          id="farm-description"
                          placeholder="Describe your farm, its history, current operations, and unique features"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farm-photos">Farm Photos</Label>
                        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">Upload photos of your farm</p>
                          <p className="text-xs text-muted-foreground">
                            Upload at least 5 photos showing different aspects of your farm
                          </p>
                          <Input id="farm-photos" type="file" className="hidden" accept=".jpg,.jpeg,.png" multiple />
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => document.getElementById("farm-photos")?.click()}
                          >
                            Select Files
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline">Back</Button>
                        <Button>
                          Next Step <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="financial" className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="funding-required">Funding Required ($)</Label>
                          <Input id="funding-required" type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="funding-purpose">Purpose of Funding</Label>
                          <Select>
                            <SelectTrigger id="funding-purpose">
                              <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="expansion">Farm Expansion</SelectItem>
                              <SelectItem value="equipment">Equipment Purchase</SelectItem>
                              <SelectItem value="technology">Technology Upgrade</SelectItem>
                              <SelectItem value="operations">Operations Capital</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="monthly-returns">Expected Monthly Returns ($)</Label>
                          <Input id="monthly-returns" type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="repayment-time">Repayment Timeframe</Label>
                          <Select>
                            <SelectTrigger id="repayment-time">
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3-6">3-6 months</SelectItem>
                              <SelectItem value="6-12">6-12 months</SelectItem>
                              <SelectItem value="12-24">1-2 years</SelectItem>
                              <SelectItem value="24-36">2-3 years</SelectItem>
                              <SelectItem value="36+">3+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="funding-description">Detailed Funding Request</Label>
                        <Textarea
                          id="funding-description"
                          placeholder="Explain how the funds will be used and how they will improve your farm's productivity and returns"
                          rows={4}
                        />
                      </div>

                      <div className="border-t pt-4 pb-2">
                        <h3 className="font-medium mb-3">Financial Documentation</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="financial-statements">Financial Statements</Label>
                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">Upload financial documents</p>
                              <p className="text-xs text-muted-foreground">
                                Income statements, balance sheets, cash flow statements (last 2 years)
                              </p>
                              <Input
                                id="financial-statements"
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                multiple
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => document.getElementById("financial-statements")?.click()}
                              >
                                Select Files
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="business-plan">Business Plan</Label>
                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">Upload your business plan</p>
                              <p className="text-xs text-muted-foreground">
                                Include projections for how the funding will improve your operations
                              </p>
                              <Input id="business-plan" type="file" className="hidden" accept=".pdf,.doc,.docx" />
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => document.getElementById("business-plan")?.click()}
                              >
                                Select File
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-4 bg-amber-50 border-amber-200 flex items-start gap-3">
                        <ClipboardCheck className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-amber-800">AI-Driven Evaluation</p>
                          <p className="text-sm text-amber-700">
                            Your application will be evaluated by our AI system to assess feasibility and risk. You'll
                            receive feedback within 48 hours of submission.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline">Back</Button>
                        <Button className="bg-[#8D6E63] hover:bg-[#8D6E63]/90">Submit Application</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

