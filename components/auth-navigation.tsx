"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ArrowLeft, Home } from "lucide-react"

interface AuthNavigationProps {
  showBackButton?: boolean
  backHref?: string
  showHomeButton?: boolean
}

export function AuthNavigation({ 
  showBackButton = false, 
  backHref = "/select-account",
  showHomeButton = true 
}: AuthNavigationProps) {
  return (
    <nav className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={backHref}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
        )}
        <Logo size="sm" />
      </div>
      
      <div className="flex items-center gap-2">
        {showHomeButton && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/select-account">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Link>
          </Button>
        )}
        <ThemeToggle />
      </div>
    </nav>
  )
}



