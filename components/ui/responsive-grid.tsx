import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 4,
}: ResponsiveGridProps) {
  const gridClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gap}`,
  ]
    .filter(Boolean)
    .join(" ")

  return <div className={cn("grid", gridClasses, className)}>{children}</div>
}
