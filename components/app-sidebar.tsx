"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/logo"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  FileText,
  DollarSign,
  BarChart3,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  UserCheck,
  Truck,
  AlertCircle,
  GraduationCap,
  CheckCircle,
  Clock,
  Menu,
  X,
  Percent,
  School,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  role: "pdg" | "representant" | "concepteur" | "auteur" | "partenaire" | "client" | "dga"
  discipline?: string
}

const menuItems = {
  pdg: [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard/pdg", badge: null },
    { icon: FileText, label: "Validation Projets", href: "/dashboard/pdg/projets", badge: null },
    { icon: Users, label: "Gestion Utilisateurs", href: "/dashboard/pdg/utilisateurs", badge: 3 },
    { icon: Package, label: "Gestion Stock", href: "/dashboard/pdg/stock", badge: null },
    { icon: ShoppingCart, label: "Ventes Directes", href: "/dashboard/pdg/ventes", badge: null },
    { icon: Warehouse, label: "Dépôts Partenaires", href: "/dashboard/pdg/depots", badge: null },
    { icon: Truck, label: "Commandes", href: "/dashboard/pdg/commandes", badge: 8 },
    { icon: GraduationCap, label: "Concepteurs", href: "/dashboard/pdg/concepteurs", badge: 5 },
    { icon: DollarSign, label: "Droits d'Auteur", href: "/dashboard/pdg/droits", badge: null },
    { icon: Percent, label: "Remises", href: "/dashboard/pdg/remises", badge: null },
    { icon: BarChart3, label: "Rapports & Stats", href: "/dashboard/pdg/rapports", badge: null },
    { icon: Bell, label: "Notifications", href: "/dashboard/pdg/notifications", badge: 12 },
    { icon: Settings, label: "Paramètres", href: "/dashboard/pdg/parametres", badge: null },
  ],
  representant: [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard/representant", badge: null },
    { icon: Package, label: "Consultation Stock", href: "/dashboard/representant/stock", badge: null, readonly: true },
    {
      icon: ShoppingCart,
      label: "Suivi Opérations",
      href: "/dashboard/representant/operations",
      badge: null,
      readonly: true,
    },
    { icon: UserCheck, label: "Gestion Partenaires", href: "/dashboard/representant/partenaires", badge: null },
    { icon: FileText, label: "Bons de Commande", href: "/dashboard/representant/bons-commande", badge: null },
    { icon: BarChart3, label: "Statistiques", href: "/dashboard/representant/statistiques", badge: null },
    { icon: Bell, label: "Notifications", href: "/dashboard/representant/notifications", badge: 5 },
  ],
  concepteur: [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard/concepteur", badge: null },
    { icon: BookOpen, label: "Mes Œuvres", href: "/dashboard/concepteur/oeuvres", badge: null },
    { icon: FileText, label: "Projets Soumis", href: "/dashboard/concepteur/projets", badge: 2 },
    { icon: Clock, label: "En Validation", href: "/dashboard/concepteur/validations", badge: 1 },
    { icon: BarChart3, label: "Statistiques", href: "/dashboard/concepteur/statistiques", badge: null },
    { icon: Bell, label: "Notifications", href: "/dashboard/concepteur/notifications", badge: 7 },
  ],
  auteur: [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard/auteur", badge: null },
    { icon: ShoppingCart, label: "Suivi Ventes", href: "/dashboard/auteur/ventes", badge: null },
    { icon: DollarSign, label: "Mes Paiements", href: "/dashboard/auteur/paiements", badge: null },
    { icon: BarChart3, label: "Mes Statistiques", href: "/dashboard/auteur/statistiques", badge: null },
    { icon: Bell, label: "Notifications", href: "/dashboard/auteur/notifications", badge: 3 },
  ],
  partenaire: [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard/partenaire", badge: null },
    { icon: School, label: "Gestion Écoles", href: "/dashboard/partenaire/ecoles", badge: null },
    { icon: ShoppingCart, label: "Commandes Écoles", href: "/dashboard/partenaire/commandes-ecoles", badge: null },
    { icon: Percent, label: "Ristournes", href: "/dashboard/partenaire/ristournes", badge: null },
    { icon: Package, label: "Stock Alloué", href: "/dashboard/partenaire/stock-alloue", badge: null },
    { icon: BarChart3, label: "Mes Ventes", href: "/dashboard/partenaire/ventes", badge: null },
    { icon: BarChart3, label: "Statistiques", href: "/dashboard/partenaire/statistiques", badge: null },
    { icon: Bell, label: "Notifications", href: "/dashboard/partenaire/notifications", badge: 2 },
  ],
  client: [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard/client", badge: null },
    { icon: ShoppingCart, label: "Catalogue", href: "/dashboard/client/catalogue", badge: null },
    { icon: FileText, label: "Mes Commandes", href: "/dashboard/client/commandes", badge: null },
    { icon: Truck, label: "Suivi Livraisons", href: "/dashboard/client/livraisons", badge: 1 },
    { icon: Bell, label: "Notifications", href: "/dashboard/client/notifications", badge: 1 },
  ],
          dga: [
            { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard/dga", badge: null },
            { icon: Building2, label: "Gestion Grossistes", href: "/dashboard/dga/grossistes", badge: null },
            { icon: ShoppingCart, label: "Commandes Grossistes", href: "/dashboard/dga/commandes-grossistes", badge: null },
            { icon: DollarSign, label: "Grille Tarifaire", href: "/dashboard/dga/grille-tarifaire", badge: null },
            { icon: BarChart3, label: "Statistiques", href: "/dashboard/dga/statistiques", badge: null },
            { icon: Bell, label: "Notifications", href: "/dashboard/dga/notifications", badge: 3 },
          ],
}

export function AppSidebar({ role, discipline }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const items = menuItems[role] || []

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden text-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div
        className={cn(
          "flex flex-col bg-background border-r border-border transition-all duration-300 z-50",
          "fixed lg:relative h-full lg:h-auto",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <div>
                <h2 className="font-semibold text-foreground">LAHA Gabon</h2>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0 hidden lg:flex text-foreground hover:bg-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {role === "concepteur" && discipline && !collapsed && (
          <div className="p-4 border-b border-border">
            <div className="text-xs font-medium text-muted-foreground mb-2">Discipline</div>
            <Badge
              variant="secondary"
              className="w-full justify-center bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground"
            >
              {discipline}
            </Badge>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 text-sm text-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center px-2",
                    isActive && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <div className="flex items-center gap-1">
                        {item.readonly && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0 border-muted-foreground/30 text-muted-foreground"
                          >
                            Lecture
                          </Badge>
                        )}
                        {item.badge && (
                          <Badge
                            variant="destructive"
                            className="text-xs px-1 py-0 min-w-[1.25rem] h-5 bg-destructive text-destructive-foreground"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>Plateforme Gabon v1.0</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
