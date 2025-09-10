"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, Settings, LogOut, Clock, Globe, Filter } from "lucide-react"
import { NotificationBell } from "@/components/ui/notification-bell"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface TopbarProps {
  role: "pdg" | "representant" | "concepteur" | "auteur" | "partenaire" | "client" | "dga"
  userName?: string
  userEmail?: string
}

export function AppTopbar({ role, userName = "Utilisateur", userEmail = "user@example.com" }: TopbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedLanguage, setSelectedLanguage] = useState("fr")

  // Update time every minute
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  })

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Libreville",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Africa/Libreville",
    })
  }

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-background border-b border-border">
      {/* Left section - Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-10 pr-4 text-sm sm:text-base" />
        </div>

        {/* Quick filters for concepteur */}
        {role === "concepteur" && (
          <Select defaultValue="all">
            <SelectTrigger className="w-32 sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes disciplines</SelectItem>
              <SelectItem value="sciences">Sciences</SelectItem>
              <SelectItem value="litterature">Littérature</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="philosophie">Philosophie</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Time and Date */}
        <div className="hidden md:flex flex-col items-end text-sm">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Clock className="h-4 w-4" />
            {formatTime(currentTime)}
          </div>
          <div className="text-xs text-muted-foreground">{formatDate(currentTime)}</div>
        </div>

        {/* Language Selector */}
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-16 sm:w-20">
            <Globe className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">FR</SelectItem>
            <SelectItem value="en">EN</SelectItem>
          </SelectContent>
        </Select>

        <ThemeToggle />

        <NotificationBell role={role} />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                <Badge variant="outline" className="w-fit text-xs capitalize">
                  {role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Préférences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
