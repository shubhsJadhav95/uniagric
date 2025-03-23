'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, Leaf, Sprout } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const FarmVisualizationPage = () => {
  // State for basic farm layout form
  const [basicFormData, setBasicFormData] = useState({
    cropName: '',
    cropType: '',
    areaAcres: '',
    soilType: '',
    state: '',
    irrigationType: 'drip',
  })

  // State for mixed farming form
  const [mixedFormData, setMixedFormData] = useState({
    cropName: '',
    cropType: '',
    areaAcres: '',
    soilType: '',
    state: '',
    irrigationType: 'drip',
  })

  // State for loading and results
  const [isBasicLoading, setIsBasicLoading] = useState(false)
  const [isMixedLoading, setIsMixedLoading] = useState(false)
  const [basicLayoutResult, setBasicLayoutResult] = useState<string | null>(null)
  const [mixedLayoutResult, setMixedLayoutResult] = useState<string | null>(null)
  const [companionCrops, setCompanionCrops] = useState<any>(null)
  const [plantingMethod, setPlantingMethod] = useState<any>(null)

  // Handle input change for basic layout form
  const handleBasicInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBasicFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle select change for basic layout form
  const handleBasicSelectChange = (name: string, value: string) => {
    setBasicFormData(prev => ({ ...prev, [name]: value }))

    // If the crop name, soil type or state has changed, fetch companion crops
    if (['cropName', 'soilType', 'state'].includes(name) && 
        basicFormData.cropName && 
        basicFormData.soilType && 
        basicFormData.state) {
      fetchCompanionCrops()
    }

    // If crop type, soil type or area has changed, fetch planting method
    if (['cropType', 'soilType', 'areaAcres'].includes(name) && 
        basicFormData.cropType && 
        basicFormData.soilType && 
        basicFormData.areaAcres && 
        basicFormData.cropName) {
      fetchPlantingMethod()
    }
  }

  // Handle input change for mixed farming form
  const handleMixedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMixedFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle select change for mixed farming form
  const handleMixedSelectChange = (name: string, value: string) => {
    setMixedFormData(prev => ({ ...prev, [name]: value }))
  }

  // Fetch companion crops based on selected crop, soil type, and state
  const fetchCompanionCrops = async () => {
    try {
      const { cropName, soilType, state } = basicFormData
      const response = await fetch(`/api/farm-visualization/companion-crops?crop=${cropName}&state=${state}&soilType=${soilType}`)
      const data = await response.json()
      if (data.status === 'success') {
        setCompanionCrops(data)
      } else {
        console.error('Error fetching companion crops:', data.message)
      }
    } catch (error) {
      console.error('Error fetching companion crops:', error)
    }
  }

  // Fetch planting method based on crop type, soil type, area and primary crop
  const fetchPlantingMethod = async () => {
    try {
      const { cropType, soilType, areaAcres, cropName } = basicFormData
      const response = await fetch(`/api/farm-visualization/planting-method?cropType=${cropType}&soilType=${soilType}&areaAcres=${areaAcres}&primaryCrop=${cropName}`)
      const data = await response.json()
      if (data.status === 'success') {
        setPlantingMethod(data)
      } else {
        console.error('Error fetching planting method:', data.message)
      }
    } catch (error) {
      console.error('Error fetching planting method:', error)
    }
  }

  // Generate basic farm layout
  const generateBasicLayout = async () => {
    setIsBasicLoading(true)
    try {
      const response = await fetch('/api/farm-visualization/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basicFormData),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setBasicLayoutResult(data.imageUrl)
      } else {
        console.error('Error generating layout:', data.message)
      }
    } catch (error) {
      console.error('Error generating layout:', error)
    } finally {
      setIsBasicLoading(false)
    }
  }

  // Generate mixed farming layout
  const generateMixedLayout = async () => {
    setIsMixedLoading(true)
    try {
      // First ensure we have companion crops and planting method
      if (!companionCrops) {
        await fetchCompanionCrops()
      }
      if (!plantingMethod) {
        await fetchPlantingMethod()
      }

      const response = await fetch('/api/farm-visualization/mixed-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...mixedFormData,
          companionCrops: JSON.stringify(companionCrops || {}),
          plantingMethod: JSON.stringify(plantingMethod || {})
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setMixedLayoutResult(data.imageUrl)
      } else {
        console.error('Error generating mixed layout:', data.message)
      }
    } catch (error) {
      console.error('Error generating mixed layout:', error)
    } finally {
      setIsMixedLoading(false)
    }
  }

  const soilTypes = ['Clay', 'Sandy', 'Loam', 'Black', 'Red', 'Laterite']
  const cropTypes = ['cereal', 'vegetable', 'fruit', 'pulse', 'oilseed']
  const states = [
    'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Gujarat', 
    'Rajasthan', 'Madhya Pradesh', 'Andhra Pradesh', 'Tamil Nadu', 
    'Karnataka', 'Bihar', 'West Bengal', 'Odisha', 'Assam', 'Kerala'
  ]
  const irrigationTypes = ['drip', 'sprinkler', 'flood', 'furrow', 'none']

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Farm Visualization Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" />
              Farm Layout Generator
            </CardTitle>
            <CardDescription>
              Create a visual layout for your farm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Generate a customized layout for your farm based on crop, soil type, and area.</p>
          </CardContent>
          <CardFooter>
            <Link href="#farm-layout" className="w-full">
              <Button className="w-full">Start</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Companion Crop Finder
            </CardTitle>
            <CardDescription>
              Discover the best companion crops
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Find the ideal companion crops based on your main crop, soil type, and location.</p>
          </CardContent>
          <CardFooter>
            <Link href="#companion-crops" className="w-full">
              <Button className="w-full">Start</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Planting Method Advisor
            </CardTitle>
            <CardDescription>
              Get recommended planting methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Receive expert recommendations on the best planting methods for your specific conditions.</p>
          </CardContent>
          <CardFooter>
            <Link href="#planting-method" className="w-full">
              <Button className="w-full">Start</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Farm Layout</TabsTrigger>
          <TabsTrigger value="mixed">Mixed Farming Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" id="farm-layout">
          <Card>
            <CardHeader>
              <CardTitle>Basic Farm Layout Generator</CardTitle>
              <CardDescription>
                Create a visual layout of your farm based on your specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cropName">Crop Name</Label>
                  <Input 
                    id="cropName" 
                    name="cropName" 
                    placeholder="e.g., Rice, Wheat, Maize" 
                    value={basicFormData.cropName}
                    onChange={handleBasicInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Select 
                    value={basicFormData.cropType}
                    onValueChange={(value) => handleBasicSelectChange('cropType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map(type => (
                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="areaAcres">Area (acres)</Label>
                  <Input 
                    id="areaAcres" 
                    name="areaAcres" 
                    type="number" 
                    placeholder="e.g., 5.5" 
                    value={basicFormData.areaAcres}
                    onChange={handleBasicInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select 
                    value={basicFormData.soilType}
                    onValueChange={(value) => handleBasicSelectChange('soilType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={basicFormData.state}
                    onValueChange={(value) => handleBasicSelectChange('state', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="irrigationType">Irrigation Type</Label>
                  <Select 
                    value={basicFormData.irrigationType}
                    onValueChange={(value) => handleBasicSelectChange('irrigationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select irrigation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationTypes.map(type => (
                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateBasicLayout} 
                disabled={isBasicLoading || !basicFormData.cropName || !basicFormData.cropType || !basicFormData.areaAcres || !basicFormData.soilType || !basicFormData.state}
                className="w-full"
              >
                {isBasicLoading ? 'Generating...' : 'Generate Farm Layout'}
              </Button>
            </CardFooter>
          </Card>

          {basicLayoutResult && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Farm Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Image 
                    src={basicLayoutResult}
                    alt="Farm Layout"
                    width={800}
                    height={600}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.open(basicLayoutResult, '_blank')}>
                  Open in New Tab
                </Button>
                <Button onClick={() => setBasicLayoutResult(null)}>
                  Generate Another Layout
                </Button>
              </CardFooter>
            </Card>
          )}

          {companionCrops && (
            <Card className="mt-8" id="companion-crops">
              <CardHeader>
                <CardTitle>Recommended Companion Crops</CardTitle>
                <CardDescription>
                  Based on your crop, soil type, and state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Recommended Mix:</h3>
                    <ul className="list-disc pl-5 mt-2">
                      {companionCrops.recommended_mix.map((crop: string) => (
                        <li key={crop} className="mb-1">
                          <span className="font-medium">{crop}</span>
                          {companionCrops.benefits[crop] && (
                            <span className="text-gray-500 text-sm ml-2">- {companionCrops.benefits[crop]}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {companionCrops.avoid && (
                    <div>
                      <h3 className="font-semibold">Avoid Planting Together:</h3>
                      <ul className="list-disc pl-5 mt-2">
                        {companionCrops.avoid.map((crop: string) => (
                          <li key={crop}>{crop}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {companionCrops.notes && (
                    <div>
                      <h3 className="font-semibold">Notes:</h3>
                      <p className="mt-1">{companionCrops.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {plantingMethod && (
            <Card className="mt-8" id="planting-method">
              <CardHeader>
                <CardTitle>Recommended Planting Method</CardTitle>
                <CardDescription>
                  Based on your crop, soil type, and area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{plantingMethod.recommended}</h3>
                    <p className="mt-1">{plantingMethod.details.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Advantages:</h3>
                      <ul className="list-disc pl-5 mt-2">
                        {plantingMethod.details.advantages.map((advantage: string) => (
                          <li key={advantage}>{advantage}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold">Disadvantages:</h3>
                      <ul className="list-disc pl-5 mt-2">
                        {plantingMethod.details.disadvantages.map((disadvantage: string) => (
                          <li key={disadvantage}>{disadvantage}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {plantingMethod.alternatives && plantingMethod.alternatives.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Alternative Methods:</h3>
                      <ul className="list-disc pl-5 mt-2">
                        {plantingMethod.alternatives.map((method: string) => (
                          <li key={method}>{method}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plantingMethod.crop_specific_notes && (
                    <div>
                      <h3 className="font-semibold">Specific Notes for {basicFormData.cropName}:</h3>
                      <p className="mt-1">{plantingMethod.crop_specific_notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mixed">
          <Card>
            <CardHeader>
              <CardTitle>Mixed Farming Layout Generator</CardTitle>
              <CardDescription>
                Create a visual layout for your mixed farming plan with companion crops
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mixedCropName">Primary Crop</Label>
                  <Input 
                    id="mixedCropName" 
                    name="cropName" 
                    placeholder="e.g., Rice, Wheat, Maize" 
                    value={mixedFormData.cropName}
                    onChange={handleMixedInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mixedCropType">Crop Type</Label>
                  <Select 
                    value={mixedFormData.cropType}
                    onValueChange={(value) => handleMixedSelectChange('cropType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map(type => (
                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mixedAreaAcres">Area (acres)</Label>
                  <Input 
                    id="mixedAreaAcres" 
                    name="areaAcres" 
                    type="number" 
                    placeholder="e.g., 5.5" 
                    value={mixedFormData.areaAcres}
                    onChange={handleMixedInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mixedSoilType">Soil Type</Label>
                  <Select 
                    value={mixedFormData.soilType}
                    onValueChange={(value) => handleMixedSelectChange('soilType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mixedState">State</Label>
                  <Select 
                    value={mixedFormData.state}
                    onValueChange={(value) => handleMixedSelectChange('state', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mixedIrrigationType">Irrigation Type</Label>
                  <Select 
                    value={mixedFormData.irrigationType}
                    onValueChange={(value) => handleMixedSelectChange('irrigationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select irrigation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationTypes.map(type => (
                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">
                  The mixed farming layout will automatically incorporate companion crops and optimal planting methods based on your inputs. Fill in all fields above and click Generate to create your layout.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateMixedLayout} 
                disabled={isMixedLoading || !mixedFormData.cropName || !mixedFormData.cropType || !mixedFormData.areaAcres || !mixedFormData.soilType || !mixedFormData.state}
                className="w-full"
              >
                {isMixedLoading ? 'Generating...' : 'Generate Mixed Farming Layout'}
              </Button>
            </CardFooter>
          </Card>

          {mixedLayoutResult && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Mixed Farming Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Image 
                    src={mixedLayoutResult}
                    alt="Mixed Farming Layout"
                    width={800}
                    height={600}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.open(mixedLayoutResult, '_blank')}>
                  Open in New Tab
                </Button>
                <Button onClick={() => setMixedLayoutResult(null)}>
                  Generate Another Layout
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FarmVisualizationPage 