"use client";

import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, LineChart, Leaf } from "lucide-react";
import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      
      <main className="flex-1 mt-20 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <Bot className="h-12 w-12 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">AI Prediction Tools</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Our AI-powered tools help farmers and investors make data-driven decisions
              to maximize agricultural success and financial returns.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Farmer Loan Approval Tool */}
            <Card className="flex flex-col h-full border-primary/20 hover:border-primary/80 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Loan Approval Prediction
                </CardTitle>
                <CardDescription>
                  Evaluate a farmer's loan eligibility based on various factors
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">
                  Our advanced AI analyzes key farming metrics including experience, land size,
                  crop diversity, and financial history to determine loan eligibility probability.
                  Get instant feedback on approval chances and recommendations to improve eligibility.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Credit Score</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Farm Size</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Experience</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Income</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/tools/farmer-prediction">Try Prediction Tool</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Farm Plan Viability Tool */}
            <Card className="flex flex-col h-full border-primary/20 hover:border-primary/80 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Farm Plan Viability
                </CardTitle>
                <CardDescription>
                  Assess the viability and potential yield of your farming plan
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">
                  This tool analyzes your planned crop type, soil conditions, climate, and land area
                  to predict the viability of your farm plan. Get insights on expected yield and
                  expert recommendations to optimize your agricultural strategy.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Crop Type</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Soil Analysis</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Climate</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Yield Forecast</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/tools/farm-plan-prediction">Try Prediction Tool</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Our AI prediction tools are built using machine learning models trained on thousands of 
              agricultural datasets and financial records to provide accurate, data-driven insights.
            </p>
            <Button variant="outline" asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 