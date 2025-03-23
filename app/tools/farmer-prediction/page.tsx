"use client";

import { useState } from "react";
import { 
  FarmerPredictionData, 
  predictFarmerApproval, 
  PredictionResult 
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function FarmerPredictionPage() {
  const [formData, setFormData] = useState<FarmerPredictionData>({
    years_experience: 0,
    land_size_hectares: 0,
    previous_loans: 0,
    credit_score: 650,
    annual_income: 0,
    crop_diversity: 1,
    has_irrigation: false,
    farm_type: "crop",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      has_irrigation: checked,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      farm_type: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await predictFarmerApproval(formData);
      setResult(result);
    } catch (error) {
      console.error("Error predicting farmer approval:", error);
      toast.error("Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Farmer Loan Approval Prediction</h1>
        <p className="text-gray-600 mb-8">
          Use our AI-powered tool to predict your loan approval probability based on your farm details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Details</CardTitle>
              <CardDescription>
                Provide accurate information for the best prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="years_experience">Years of Experience</Label>
                  <Input
                    id="years_experience"
                    name="years_experience"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="land_size_hectares">Land Size (hectares)</Label>
                  <Input
                    id="land_size_hectares"
                    name="land_size_hectares"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.land_size_hectares}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previous_loans">Number of Previous Loans</Label>
                  <Input
                    id="previous_loans"
                    name="previous_loans"
                    type="number"
                    min="0"
                    value={formData.previous_loans}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit_score">Credit Score (500-850)</Label>
                  <Input
                    id="credit_score"
                    name="credit_score"
                    type="number"
                    min="500"
                    max="850"
                    value={formData.credit_score}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annual_income">Annual Income (USD)</Label>
                  <Input
                    id="annual_income"
                    name="annual_income"
                    type="number"
                    min="0"
                    value={formData.annual_income}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crop_diversity">Crop Diversity (number of crops)</Label>
                  <Input
                    id="crop_diversity"
                    name="crop_diversity"
                    type="number"
                    min="1"
                    value={formData.crop_diversity}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="has_irrigation" 
                    checked={formData.has_irrigation}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="has_irrigation" className="cursor-pointer">
                    Has Irrigation System
                  </Label>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="farm_type">Farm Type</Label>
                  <Select 
                    value={formData.farm_type}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="farm_type">
                      <SelectValue placeholder="Select farm type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop">Crop</SelectItem>
                      <SelectItem value="livestock">Livestock</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Predict Approval"
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
                      <span>Approval Likely</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                      <span>Approval Unlikely</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  Based on the information you provided
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">
                      Approval Probability
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

                <div>
                  <h3 className="font-semibold mb-2">Recommendations:</h3>
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
                    This prediction is based on AI analysis of your farm data. Actual
                    loan approval may depend on additional factors not considered here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 