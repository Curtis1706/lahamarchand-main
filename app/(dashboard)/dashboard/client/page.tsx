"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  FileText,
  Truck,
  ShoppingCart,
  Package,
  Eye,
  CreditCard,
  Calendar,
  Bell,
} from "lucide-react"

interface DashboardData {
  stats: {
    totalOrders: number
    pendingOrders: number
    deliveredOrders: number
    totalBooks: number
    totalAmount: number
  }
  recentOrders: any[]
  monthlyData: Record<string, { orders: number; amount: number }>
  user: {
    name: string
    email: string
  }
}

export default function ClientDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        console.log('🔍 Auth state:', { authLoading, isAuthenticated, user })
        
        // Test de session d'abord
        console.log('🔍 Testing session...')
        const sessionResponse = await fetch('/api/session-check', {
          credentials: 'include'
        })
        const sessionData = await sessionResponse.json()
        console.log('🔍 Session check:', sessionData)
        
        if (!sessionData.authenticated) {
          throw new Error('Non authentifié selon l\'API')
        }
        
        console.log('🔍 Fetching dashboard data...')
        const response = await fetch('/api/client/dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        console.log('🔍 Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ API Error:', errorData)
          throw new Error(errorData.error || 'Failed to fetch dashboard data')
        }
        
        const data = await response.json()
        console.log('✅ Dashboard data received:', data)
        setDashboardData(data)
      } catch (err) {
        console.error('❌ Dashboard fetch error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    // Attendre que l'authentification soit chargée
    if (!authLoading) {
      if (isAuthenticated && user) {
        fetchDashboardData()
      } else {
        setLoading(false)
        setError('Non authentifié - Veuillez vous connecter')
      }
    }
  }, [authLoading, isAuthenticated, user])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: {error || 'Données non disponibles'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Mon Espace Client
            </h1>
          <p className="text-muted-foreground">
            Bienvenue, {dashboardData.user.name} • Gérez vos commandes et livraisons
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button size="sm" onClick={() => window.location.href = '/dashboard/client/catalogue'}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Parcourir le catalogue
            </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Mes Commandes"
          value={dashboardData.stats.totalOrders.toString()}
          description="Depuis votre inscription"
          icon={FileText}
          trend={{ 
            value: dashboardData.stats.totalOrders > 0 ? Math.round((dashboardData.stats.totalOrders / 10) * 100) : 0, 
            label: "de votre objectif", 
            type: "positive" 
          }}
        />
        <StatsCard
          title="En Cours"
          value={dashboardData.stats.pendingOrders.toString()}
          description="Commandes actives"
          icon={Package}
          trend={{ 
            value: dashboardData.stats.pendingOrders, 
            label: dashboardData.stats.pendingOrders > 1 ? "commandes" : "commande", 
            type: dashboardData.stats.pendingOrders > 0 ? "positive" : "neutral" 
          }}
        />
        <StatsCard
          title="Livres Achetés"
          value={dashboardData.stats.totalBooks.toString()}
          description="Total de livres"
          icon={Truck}
          trend={{ 
            value: dashboardData.stats.deliveredOrders, 
            label: "livrés", 
            type: "positive" 
          }}
        />
        <StatsCard
          title="Total Dépensé"
          value={`${dashboardData.stats.totalAmount.toLocaleString()} FCFA`}
          description="Montant cumulé"
          icon={CreditCard}
          trend={{ 
            value: Math.round((dashboardData.stats.totalAmount / 100000) * 100), 
            label: "de 100k FCFA", 
            type: "positive" 
          }}
        />
      </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
          <CardTitle>Mes Commandes Récentes</CardTitle>
          <CardDescription>Historique de vos dernières commandes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          {dashboardData.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4" />
              <p>Aucune commande trouvée</p>
              <Button className="mt-4" size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Parcourir le catalogue
              </Button>
            </div>
          ) : (
            dashboardData.recentOrders.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">Commande {order.id.slice(-8)}</h4>
                      <Badge
                        variant={
                          order.status === "DELIVERED"
                            ? "default"
                            : order.status === "VALIDATED"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "VALIDATED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {order.status === "DELIVERED" ? "Livré" : 
                         order.status === "SHIPPED" ? "Expédié" :
                         order.status === "PROCESSING" ? "En préparation" :
                         order.status === "VALIDATED" ? "Validé" : 
                         order.status === "PENDING" ? "En attente" : 
                         order.status === "CANCELLED" ? "Annulé" : order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {order.itemsCount} article{order.itemsCount > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.items.map((item: any) => item.title).join(", ")}
                  </div>
                </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold">{order.total.toLocaleString()} FCFA</p>
                    <Badge variant="outline" className="text-xs">
                      Avec compte
                    </Badge>
                  </div>
                  </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    {order.items.length} livre{order.items.length > 1 ? "s" : ""} commandé{order.items.length > 1 ? "s" : ""}
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-1 h-3 w-3" />
                    Détails
                  </Button>
                  </div>
                </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Catalogue</CardTitle>
            <CardDescription>Parcourir nos livres disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/dashboard/client/catalogue'}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Voir le catalogue
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mes Commandes</CardTitle>
            <CardDescription>Voir toutes vos commandes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard/client/commandes'}>
              <FileText className="mr-2 h-4 w-4" />
              Historique complet
                </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Suivi des livraisons</CardTitle>
            <CardDescription>Suivez vos commandes en temps réel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard/client/livraisons'}>
                    <Truck className="mr-2 h-4 w-4" />
              Suivre mes livraisons
                  </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Statistiques</CardTitle>
            <CardDescription>Analyser vos habitudes d'achat</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard/client/statistiques'}>
              <Calendar className="mr-2 h-4 w-4" />
              Voir les stats
                  </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>Restez informé de vos commandes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard/client/notifications'}>
              <Bell className="mr-2 h-4 w-4" />
              Voir les notifications
                </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
