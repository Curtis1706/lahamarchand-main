"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"
import { SidebarProvider } from "@/components/ui/sidebar"

// Function to get role from pathname
function getRoleFromPathname(pathname: string): "pdg" | "representant" | "concepteur" | "auteur" | "partenaire" | "client" | "dga" {
  if (pathname.startsWith("/dashboard/pdg")) return "pdg"
  if (pathname.startsWith("/dashboard/representant")) return "representant"
  if (pathname.startsWith("/dashboard/concepteur")) return "concepteur"
  if (pathname.startsWith("/dashboard/auteur")) return "auteur"
  if (pathname.startsWith("/dashboard/partenaire")) return "partenaire"
  if (pathname.startsWith("/dashboard/client")) return "client"
  if (pathname.startsWith("/dashboard/dga")) return "dga"
  return "client" // default fallback
}

// Function to get discipline from pathname (for concepteur role)
function getDisciplineFromPathname(pathname: string): string | undefined {
  // In a real app, this would come from user data or URL params
  return "Sciences" // Default discipline for concepteur
}

// Function to get user info based on role
function getUserInfo(role: string) {
  const userInfo = {
    pdg: { name: "Jean Dupont", email: "jean.dupont@laha.ga" },
    representant: { name: "Marie Obame", email: "marie.obame@laha.ga" },
    concepteur: { name: "Dr. Pierre Nguema", email: "pierre.nguema@laha.ga" },
    auteur: { name: "Prof. Alice Mba", email: "alice.mba@laha.ga" },
    partenaire: { name: "Librairie Centrale", email: "contact@librairie-centrale.ga" },
    client: { name: "Marie Nzamba", email: "marie.nzamba@email.ga" },
    dga: { name: "Direction Générale des Affaires", email: "dga@laha.ga" },
  }
  return userInfo[role as keyof typeof userInfo] || userInfo.client
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const userRole = getRoleFromPathname(pathname)
  const userDiscipline = getDisciplineFromPathname(pathname)
  const userInfo = getUserInfo(userRole)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar role={userRole} discipline={userDiscipline} />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <AppTopbar role={userRole} userName={userInfo.name} userEmail={userInfo.email} />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 xl:p-8">
            <div className="mx-auto max-w-7xl w-full min-w-0">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
