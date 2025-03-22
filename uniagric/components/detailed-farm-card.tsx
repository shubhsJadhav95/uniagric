"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, ArrowRight, CloudSun, Sprout, User, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface DetailedFarmCardProps {
  name: string
  location: string
  cropType: string
  allocation: string
  riskLevel: string
  riskColor: string
  expectedRoi: string
  weatherScore: number
  soilQuality: number
  farmerScore: number
  description: string
}

export function DetailedFarmCard({
  name,
  location,
  cropType,
  allocation,
  riskLevel,
  riskColor,
  expectedRoi,
  weatherScore,
  soilQuality,
  farmerScore,
  description,
}: DetailedFarmCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>{location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge style={{ backgroundColor: riskColor, color: "white" }}>{riskLevel} Risk</Badge>
                  <Badge variant="outline" className="font-medium">
                    {allocation}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-right mr-4">
                <p className="text-sm text-muted-foreground">Expected ROI</p>
                <p className="font-bold text-lg text-[#4CAF50]">{expectedRoi}</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Crop Type</p>
              <p className="font-medium">{cropType}</p>
            </div>

            <div className="col-span-3 md:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <CloudSun className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Weather</span>
                <span className="text-xs font-medium ml-auto">{weatherScore}%</span>
              </div>
              <Progress value={weatherScore} className="h-1.5" />
            </div>
            <div className="col-span-3 md:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <Sprout className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Soil Quality</span>
                <span className="text-xs font-medium ml-auto">{soilQuality}%</span>
              </div>
              <Progress value={soilQuality} className="h-1.5" />
            </div>
          </div>

          {expanded && (
            <div className="pt-3 border-t mt-3 space-y-4">
              <p className="text-sm text-muted-foreground">{description}</p>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h4 className="font-medium mb-2">Farmer Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-amber-500" />
                      <span className="text-xs text-muted-foreground">Farmer Score</span>
                      <span className="text-xs font-medium ml-auto">{farmerScore}%</span>
                    </div>
                    <Progress value={farmerScore} className="h-1.5" />

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                        <p className="text-sm">15+ years</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Certification</p>
                        <p className="text-sm">Organic Certified</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Farm Analytics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Land Size</p>
                      <p className="text-sm">120 acres</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Water Source</p>
                      <p className="text-sm">Natural + Irrigation</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Technology Level</p>
                      <p className="text-sm">Advanced</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Market Access</p>
                      <p className="text-sm">Regional + Export</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="#">
                    Farm Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

