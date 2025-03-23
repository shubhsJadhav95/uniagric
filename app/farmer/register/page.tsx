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
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FarmerFormProvider, useFarmerForm } from '@/contexts/FarmerFormContext'
import { useState } from 'react'

function FarmerRegistrationForm() {
  const { formData, updateFormData, currentTab, setCurrentTab, isValid } = useFarmerForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const farmerData = {
        ...formData,
        created_at: serverTimestamp(),
        status: 'pending'
      };

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'farmers'), farmerData);
      console.log('Farmer registered with ID:', docRef.id);
      
      // Show success message
      toast.success('Registration successful!');
      
      // Redirect to dashboard
      router.push('/farmer/dashboard');
      
    } catch (error) {
      console.error('Error registering farmer:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentTab === 'personal' && isValid('personal')) {
      setCurrentTab('farm');
    } else if (currentTab === 'farm' && isValid('farm')) {
      setCurrentTab('financial');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    if (currentTab === 'financial') {
      setCurrentTab('farm');
    } else if (currentTab === 'farm') {
      setCurrentTab('personal');
    }
  };

  const handleInputChange = (section: string, field: string, value: string | number) => {
    updateFormData(section as any, { [field]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={currentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="personal" onClick={() => setCurrentTab('personal')}>
            Personal
          </TabsTrigger>
          <TabsTrigger value="farm" onClick={() => setCurrentTab('farm')}>
            Farm Details
          </TabsTrigger>
          <TabsTrigger value="financial" onClick={() => setCurrentTab('financial')}>
            Financial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              value={formData.personal_info.full_name}
              onChange={(e) => handleInputChange('personal_info', 'full_name', e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.personal_info.email}
                onChange={(e) => handleInputChange('personal_info', 'email', e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.personal_info.phone}
                onChange={(e) => handleInputChange('personal_info', 'phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
          </div>

          <div className="border-t pt-4 pb-2">
            <h3 className="font-medium mb-3">Identity Verification</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id-type">ID Type</Label>
                  <Select
                    value={formData.personal_info.id_type}
                    onValueChange={(value) => handleInputChange('personal_info', 'id_type', value)}
                  >
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
                  <Input
                    id="id-number"
                    value={formData.personal_info.id_number}
                    onChange={(e) => handleInputChange('personal_info', 'id_number', e.target.value)}
                    placeholder="ID Number"
                    required
                  />
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
                  <Input name="id-upload" id="id-upload" type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
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
            <Button type="button" onClick={handleNext}>
              Next Step <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="farm" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Farm Name</Label>
            <Input
              id="farm-name"
              value={formData.farm_details.farm_name}
              onChange={(e) => handleInputChange('farm_details', 'farm_name', e.target.value)}
              placeholder="Your farm name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farm-type">Farm Type</Label>
              <Select
                value={formData.farm_details.farm_type}
                onValueChange={(value) => handleInputChange('farm_details', 'farm_type', value)}
              >
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
              <Select
                value={formData.farm_details.ownership_type}
                onValueChange={(value) => handleInputChange('farm_details', 'ownership_type', value)}
              >
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
            <Input
              id="farm-location"
              value={formData.farm_details.farm_location}
              onChange={(e) => handleInputChange('farm_details', 'farm_location', e.target.value)}
              placeholder="Full address of your farm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="land-size">Land Size (acres)</Label>
              <Input
                id="land-size"
                type="number"
                value={formData.farm_details.land_size}
                onChange={(e) => handleInputChange('farm_details', 'land_size', Number(e.target.value))}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years-operation">Years in Operation</Label>
              <Input
                id="years-operation"
                type="number"
                value={formData.farm_details.years_operation}
                onChange={(e) => handleInputChange('farm_details', 'years_operation', Number(e.target.value))}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="main-crops">Main Crops/Products</Label>
            <Input
              id="main-crops"
              value={formData.farm_details.main_crops}
              onChange={(e) => handleInputChange('farm_details', 'main_crops', e.target.value)}
              placeholder="e.g., Corn, Wheat, Vegetables"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm-description">Farm Description</Label>
            <Textarea
              id="farm-description"
              value={formData.farm_details.farm_description}
              onChange={(e) => handleInputChange('farm_details', 'farm_description', e.target.value)}
              placeholder="Describe your farm, its history, current operations, and unique features"
              rows={4}
              required
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
              <Input name="farm-photos" id="farm-photos" type="file" className="hidden" accept=".jpg,.jpeg,.png" multiple />
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
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button type="button" onClick={handleNext}>
              Next Step <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="funding-required">Funding Required ($)</Label>
              <Input
                id="funding-required"
                type="number"
                value={formData.financial_info.funding_required}
                onChange={(e) => handleInputChange('financial_info', 'funding_required', Number(e.target.value))}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funding-purpose">Purpose of Funding</Label>
              <Select
                value={formData.financial_info.funding_purpose}
                onValueChange={(value) => handleInputChange('financial_info', 'funding_purpose', value)}
              >
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
              <Input
                id="monthly-returns"
                type="number"
                value={formData.financial_info.monthly_returns}
                onChange={(e) => handleInputChange('financial_info', 'monthly_returns', Number(e.target.value))}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repayment-time">Repayment Timeframe</Label>
              <Select
                value={formData.financial_info.repayment_time}
                onValueChange={(value) => handleInputChange('financial_info', 'repayment_time', value)}
              >
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
              value={formData.financial_info.funding_description}
              onChange={(e) => handleInputChange('financial_info', 'funding_description', e.target.value)}
              placeholder="Explain how the funds will be used and how they will improve your farm's productivity and returns"
              rows={4}
              required
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
                  <Input
                    id="business-plan"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
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
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit" disabled={loading || !isValid('financial')}>
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}

export default function FarmerRegistrationPage() {
  return (
    <FarmerFormProvider>
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
                    <FarmerRegistrationForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </FarmerFormProvider>
  );
}

