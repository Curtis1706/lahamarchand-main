"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type LucideIcon, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DataCardProps {
  title: string
  description?: string
  status?: {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
  metadata?: Array<{
    label: string
    value: string
  }>
  actions?: Array<{
    label: string
    onClick: () => void
    icon?: LucideIcon
  }>
  className?: string
  children?: React.ReactNode
}

export function DataCard({ title, description, status, metadata, actions, className, children }: DataCardProps) {
  return (
    <Card className={cn("transition-smooth hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription className="text-sm">{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {status && <Badge variant={status.variant}>{status.label}</Badge>}
            {actions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick} className="flex items-center gap-2">
                      {action.icon && <action.icon className="h-4 w-4" />}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      {(metadata || children) && (
        <CardContent className="pt-0">
          {metadata && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {metadata.map((item, index) => (
                <div key={index}>
                  <span className="text-muted-foreground">{item.label}:</span>
                  <span className="ml-1 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  )
}
