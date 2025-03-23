"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useFirebase } from "@/contexts/FirebaseContext"
import { UserProfile } from "@/components/user-profile"
import { toast } from "sonner"
import { LogOut } from "lucide-react"

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading } = useFirebase()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-[#4CAF50]"
              >
                <path
                  d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M4 7L20 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 7L4 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-xl text-white">UniAgric</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#get-started" className="text-white/80 hover:text-white transition-colors">
              Get Started
            </Link>
            <Link href="/#learn-more" className="text-white/80 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
              Contact
            </Link>
            <div className="relative group">
              <button className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
                AI Tools
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-[#2E2E2E] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link href="/tools/farmer-prediction" className="block px-4 py-2 text-white hover:bg-white/10">
                  Loan Approval Prediction
                </Link>
                <Link href="/tools/farm-plan-prediction" className="block px-4 py-2 text-white hover:bg-white/10">
                  Farm Plan Viability
                </Link>
              </div>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
            ) : user ? (
              <UserProfile />
            ) : (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Log In
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Account Access</DialogTitle>
                      <DialogDescription>Log in to your account or create a new one</DialogDescription>
                    </DialogHeader>
                    <LoginForm />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">Sign Up</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Account</DialogTitle>
                      <DialogDescription>Join UniAgric to connect with investors or farmers</DialogDescription>
                    </DialogHeader>
                    <LoginForm defaultTab="signup" />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#2E2E2E] text-white">
          <nav className="flex flex-col py-4">
            <Link href="/#get-started" className="px-6 py-2 hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Get Started
            </Link>
            <Link href="/#learn-more" className="px-6 py-2 hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              How It Works
            </Link>
            <Link href="/about" className="px-6 py-2 hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/contact" className="px-6 py-2 hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="px-6 py-2 border-t border-white/10">
              <div className="font-medium py-1">AI Tools</div>
              <Link href="/tools/farmer-prediction" className="block pl-4 py-2 hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                Loan Approval Prediction
              </Link>
              <Link href="/tools/farm-plan-prediction" className="block pl-4 py-2 hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                Farm Plan Viability
              </Link>
            </div>
            
            <div className="flex flex-col gap-2 px-6 py-4 border-t border-white/10 mt-2">
              {loading ? (
                <div className="w-8 h-8 mx-auto rounded-full bg-white/10 animate-pulse"></div>
              ) : user ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-center mb-2">
                    <p className="font-medium">{user.displayName || user.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-white/70">{user.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={async () => {
                      try {
                        await useFirebase().logout();
                        setIsMenuOpen(false);
                        toast.success("Logged out successfully");
                      } catch (error) {
                        console.error("Logout error:", error);
                        toast.error("Failed to log out");
                      }
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-white/20 text-white w-full justify-center">
                        Log In
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Account Access</DialogTitle>
                        <DialogDescription>Log in to your account or create a new one</DialogDescription>
                      </DialogHeader>
                      <LoginForm />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 w-full justify-center">Sign Up</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create Account</DialogTitle>
                        <DialogDescription>Join UniAgric to connect with investors or farmers</DialogDescription>
                      </DialogHeader>
                      <LoginForm defaultTab="signup" />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

