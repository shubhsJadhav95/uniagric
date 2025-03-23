"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useFirebase } from "@/contexts/FirebaseContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface LoginFormProps {
  defaultTab?: "login" | "signup"
}

export function LoginForm({ defaultTab = "login" }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle } = useFirebase()
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Signup form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [userType, setUserType] = useState<"farmer" | "investor" | null>(null)
  
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter both email and password")
      return
    }
    
    setIsLoading(true)
    
    try {
      await signIn(loginEmail, loginPassword)
      toast.success("Login successful!")
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)
      let errorMessage = "Login failed. Please try again."
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please check your email."
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again."
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid credentials. Please check your email and password."
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!firstName || !lastName || !signupEmail || !signupPassword) {
      toast.error("Please fill in all required fields")
      return
    }
    
    if (!userType) {
      toast.error("Please select whether you are a farmer or investor")
      return
    }
    
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }
    
    setIsLoading(true)
    
    try {
      const fullName = `${firstName} ${lastName}`
      await signUp(signupEmail, signupPassword, fullName, userType)
      toast.success("Account created successfully!")
      
      // Redirect based on user type
      if (userType === "farmer") {
        router.push("/farmer/dashboard")
      } else {
        router.push("/investor/dashboard")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      let errorMessage = "Signup failed. Please try again."
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use. Please use another email or login."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check your email."
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    try {
      await signInWithGoogle()
      toast.success("Login with Google successful!")
      router.push("/")
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast.error("Google sign-in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Log In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
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
          <Button 
            type="submit" 
            className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
      </TabsContent>

      <TabsContent value="signup" className="space-y-4">
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input 
                id="first-name" 
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input 
                id="last-name" 
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input 
              id="signup-email" 
              type="email" 
              placeholder="your@email.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input 
                id="signup-password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
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
              <Button 
                type="button"
                variant="outline" 
                className={userType === "investor" 
                  ? "bg-[#2196F3]/10 border-[#2196F3] text-[#2196F3]" 
                  : "border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3]/10"}
                onClick={() => setUserType("investor")}
              >
                Investor
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className={userType === "farmer" 
                  ? "bg-[#8D6E63]/10 border-[#8D6E63] text-[#8D6E63]" 
                  : "border-[#8D6E63] text-[#8D6E63] hover:bg-[#8D6E63]/10"}
                onClick={() => setUserType("farmer")}
              >
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
          <Button 
            type="submit" 
            className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}

