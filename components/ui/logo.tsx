import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
}

const sizeClasses = {
  sm: "h-6 w-auto",
  md: "h-8 w-auto",
  lg: "h-12 w-auto",
  xl: "h-16 w-auto",
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/images/laha-logo.png"
        alt="LAHA Marchand"
        width={64}
        height={64}
        className={cn(sizeClasses[size], "object-contain")}
        priority
      />
    </div>
  )
}
