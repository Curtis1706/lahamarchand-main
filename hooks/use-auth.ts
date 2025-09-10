"use client"

import { useUser, useAuth } from "@clerk/nextjs"
import { Role } from "@prisma/client"

export function useAuthData() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()

  return {
    user: user ? {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.fullName || user.firstName + " " + user.lastName,
      role: user.publicMetadata?.role as Role || Role.CLIENT,
    } : null,
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn,
  }
}

export function useRole() {
  const { user } = useAuthData()
  
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

