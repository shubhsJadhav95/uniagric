import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, CloudSun, Sprout, User } from "lucide-react"

interface FarmCardProps {
  name: string
  location: string
  cropType: string
  riskLevel: string
  riskColor: string
  expectedRoi: string
  weatherScore: number
  soilQuality: number
  farmerScore: number
}

export function FarmCard({
  name,
  location,
  cropType,
  riskLevel,
  riskColor,
  expectedRoi,
  weatherScore,
  soilQuality,
  farmerScore,
}: FarmCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  <span>{location}</span>
                </div>
              </div>
              <Badge style={{ backgroundColor: riskColor, color: "white" }}>{riskLevel} Risk</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Crop Type</p>
                <p className="font-medium">{cropType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expected ROI</p>
                <p className="font-medium text-[#4CAF50]">{expectedRoi}</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <CloudSun className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Weather</span>
                  <span className="text-xs font-medium ml-auto">{weatherScore}%</span>
                </div>
                <Progress value={weatherScore} className="h-1.5" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sprout className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">Soil Quality</span>
                  <span className="text-xs font-medium ml-auto">{soilQuality}%</span>
                </div>
                <Progress value={soilQuality} className="h-1.5" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Farmer Score</span>
                  <span className="text-xs font-medium ml-auto">{farmerScore}%</span>
                </div>
                <Progress value={farmerScore} className="h-1.5" />
              </div>
            </div>
          </div>

          <div className="md:w-24 flex md:flex-col gap-2 md:gap-3 md:items-center">
            <Button size="sm" variant="outline" className="flex-1 md:w-full">
              Details
            </Button>
            <Button size="sm" className="flex-1 md:w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90">
              Invest
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

