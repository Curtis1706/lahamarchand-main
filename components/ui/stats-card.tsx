import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    type: "positive" | "negative" | "neutral"
  }
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  const getTrendColor = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "bg-success/10 text-success border-success/20"
      case "negative":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className={cn("transition-smooth hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center justify-between mt-2">
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <Badge variant="outline" className={getTrendColor(trend.type)}>
              {trend.type === "positive" ? "+" : trend.type === "negative" ? "-" : ""}
              {Math.abs(trend.value)}% {trend.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
