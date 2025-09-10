"use client"

import type { ReactNode } from "react"

interface RoleGateProps {
  allowedRoles: string[]
  userRole?: string
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGate({ allowedRoles, userRole = "client", children, fallback = null }: RoleGateProps) {
  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
