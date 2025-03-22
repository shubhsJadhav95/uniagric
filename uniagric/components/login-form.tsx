"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface LoginFormProps {
  defaultTab?: "login" | "signup"
}

export function LoginForm({ defaultTab = "login" }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Log In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="remember" className="rounded border-gray-300" />
            <label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-[#4CAF50] hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90">Log In</Button>
      </TabsContent>

      <TabsContent value="signup" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" type="text" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" type="text" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" placeholder="your@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="account-type">I am a</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3]/10">
              Investor
            </Button>
            <Button variant="outline" className="border-[#8D6E63] text-[#8D6E63] hover:bg-[#8D6E63]/10">
              Farmer
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-[#4CAF50] hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#4CAF50] hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
        <Button className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90">Create Account</Button>
      </TabsContent>
    </Tabs>
  )
}

