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

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          </nav>

          <div className="hidden md:flex items-center gap-4">
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
            <div className="flex flex-col gap-2 px-6 py-4 border-t border-white/10 mt-2">
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
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

