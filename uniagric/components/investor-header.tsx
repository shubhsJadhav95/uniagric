"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bell,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function InvestorHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <div className="md:hidden mr-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        <Link href="/investor/dashboard" className="flex items-center gap-2 mr-6">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#4CAF50]">
            <path
              d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 7L20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 7L4 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-lg">UniAgric</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mr-auto">
          <Link href="/investor/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link
            href="/investor/portfolios"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Portfolios
          </Link>
          <Link
            href="/investor/farms"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Farms
          </Link>
          <Link
            href="/investor/transactions"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Transactions
          </Link>
          <Link
            href="/investor/analytics"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Analytics
          </Link>
        </nav>

        <div className="hidden md:flex ml-auto">
          <div className="relative mr-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-[200px] lg:w-[300px] pl-8" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Michael Johnson</p>
                  <p className="text-xs leading-none text-muted-foreground">michael@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CircleDollarSign className="mr-2 h-4 w-4" />
                  <span>Investments</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto pb-10">
              <div className="container px-4 py-4">
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="w-full pl-8" />
                </div>

                <nav className="flex flex-col space-y-3">
                  <Link
                    href="/investor/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/investor/portfolios"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span>Portfolios</span>
                  </Link>
                  <Link
                    href="/investor/farms"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span>Farms</span>
                  </Link>
                  <Link
                    href="/investor/transactions"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span>Transactions</span>
                  </Link>
                  <Link
                    href="/investor/analytics"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span>Analytics</span>
                  </Link>
                </nav>
              </div>
            </div>

            <div className="border-t py-2">
              <div className="container px-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

