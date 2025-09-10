"use client"

import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
  }
}

export function useRole() {
  const { user } = useAuth()
  
  return {
    role: user?.role,
    isPDG: user?.role === Role.PDG,
    isRepresentant: user?.role === Role.REPRESENTANT,
    isConcepteur: user?.role === Role.CONCEPTEUR,
    isAuteur: user?.role === Role.AUTEUR,
    isPartenaire: user?.role === Role.PARTENAIRE,
    isClient: user?.role === Role.CLIENT,
  }
}

export function usePermissions() {
  const { role } = useRole()
  
  return {
    canManageUsers: role === Role.PDG,
    canManageWorks: role === Role.CONCEPTEUR || role === Role.PDG,
    canViewAllOrders: role === Role.PDG || role === Role.REPRESENTANT,
    canCreateOrders: true, // Tous les utilisateurs peuvent créer des commandes
    canManageStock: role === Role.PDG,
    canViewReports: role === Role.PDG || role === Role.REPRESENTANT,
  }
}

