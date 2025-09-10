"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Toujours afficher le menu déroulant, même pendant l'hydratation
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent transition-colors hover:bg-accent/10">
          {mounted ? (
            <>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </>
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Basculer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className="cursor-pointer"
          disabled={!mounted}
        >
          <Sun className="mr-2 h-4 w-4" />
          Clair
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="cursor-pointer"
          disabled={!mounted}
        >
          <Moon className="mr-2 h-4 w-4" />
          Sombre
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className="cursor-pointer"
          disabled={!mounted}
        >
          <Monitor className="mr-2 h-4 w-4" />
          Système
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
