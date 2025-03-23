"use client";

import { useState } from "react";
import { 
  FarmPlanPredictionData, 
  predictFarmPlan, 
  PredictionResult 
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Loader2, Leaf } from "lucide-react";

export default function FarmPlanPredictionPage() {
  const [formData, setFormData] = useState<FarmPlanPredictionData>({
    crop_type: "maize",
    soil_type: "loam",
    climate: "tropical",
    area_hectares: 5,
    yield_per_hectare: 5,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === "area_hectares" || name === "yield_per_hectare" 
        ? parseFloat(value) || 0 
        : value,
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await predictFarmPlan(formData);
      setResult(result);
    } catch (error) {
      console.error("Error predicting farm plan approval:", error);
      toast.error("Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cropTypes = [
    "maize", "wheat", "rice", "cotton", "sorghum", 
    "coffee", "tea", "sugarcane", "cassava", "groundnuts",
    "beans", "soybeans", "tomatoes", "potatoes", "oranges",
    "bananas", "avocados", "mango", "pineapple"
  ];
  
  const soilTypes = ["loam", "clay", "sandy"];
  const climateTypes = ["tropical", "temperate", "arid", "mediterranean"];

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Farm Plan Viability Prediction</h1>
        <p className="text-gray-600 mb-8">
          Use our AI-powered tool to predict the viability of your farming plan based on crop, environment, and productivity factors.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Farm Plan Details</CardTitle>
              <CardDescription>
                Provide accurate information for the best prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crop_type">Crop Type</Label>
                  <Select 
                    value={formData.crop_type}
                    onValueChange={(value) => handleSelectChange("crop_type", value)}
                  >
                    <SelectTrigger id="crop_type">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop.charAt(0).toUpperCase() + crop.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soil_type">Soil Type</Label>
                  <Select 
                    value={formData.soil_type}
                    onValueChange={(value) => handleSelectChange("soil_type", value)}
                  >
                    <SelectTrigger id="soil_type">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map((soil) => (
                        <SelectItem key={soil} value={soil}>
                          {soil.charAt(0).toUpperCase() + soil.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="climate">Climate</Label>
                  <Select 
                    value={formData.climate}
                    onValueChange={(value) => handleSelectChange("climate", value)}
                  >
                    <SelectTrigger id="climate">
                      <SelectValue placeholder="Select climate" />
                    </SelectTrigger>
                    <SelectContent>
                      {climateTypes.map((climate) => (
                        <SelectItem key={climate} value={climate}>
                          {climate.charAt(0).toUpperCase() + climate.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area_hectares">Area (hectares)</Label>
                  <Input
                    id="area_hectares"
                    name="area_hectares"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.area_hectares}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yield_per_hectare">Expected Yield (tons per hectare)</Label>
                  <Input
                    id="yield_per_hectare"
                    name="yield_per_hectare"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.yield_per_hectare}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Predict Viability"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {result.prediction ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                      <span>Viable Farm Plan</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
                      <span>Challenging Farm Plan</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  Based on the farming plan you provided
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">
                      Viability Score
                    </span>
                    <span className="text-sm font-semibold">
                      {Math.round(result.probability * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={result.probability * 100}
                    className={
                      result.probability >= 0.7
                        ? "bg-green-200"
                        : result.probability >= 0.4
                        ? "bg-yellow-200"
                        : "bg-red-200"
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span className="font-medium">
                    {formData.crop_type.charAt(0).toUpperCase() + formData.crop_type.slice(1)} in {formData.climate} climate, {formData.soil_type} soil
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Expert Recommendations:</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-500">
                    This prediction is based on AI analysis of your farming plan. Actual
                    results may vary depending on local conditions, farming practices,
                    weather variations, and other factors not considered in this model.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How the Prediction Works</h2>
          <p className="mb-4">
            Our AI model analyzes multiple factors to determine the viability of your farming plan:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Crop-to-soil compatibility in your specified climate</li>
            <li>Expected yield compared to regional benchmarks</li>
            <li>Land area efficiency and economy of scale</li>
            <li>Historical success patterns of similar farming configurations</li>
          </ul>
          <p className="mt-4">
            The model has been trained on data from various agricultural regions and provides
            recommendations based on best practices and successful farming patterns.
          </p>
        </div>
      </div>
    </div>
  );
} 