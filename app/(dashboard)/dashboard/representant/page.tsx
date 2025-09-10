"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Lock,
  UserCheck,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ShoppingCart,
  DollarSign,
  BookOpen,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useData } from "@/hooks/use-data"


interface DashboardData {
  summary: {
    totalOrders: number
    pendingOrders: number
    validatedOrders: number
    deliveredOrders: number
    totalSales: number
    totalCommissions: number
    averageOrderValue: number
  }
  recentOrders: Array<{
    id: string
    status: string
    total: number
    itemCount: number
    createdAt: string
    items: Array<{
      work: {
        title: string
        discipline: string
        author: string
      }
      quantity: number
      price: number
    }>
  }>
  chartData: Array<{
    month: string
    commandes: number
    ventes: number
    commissions: number
  }>
  topWorks: Array<{
    work: any
    totalSold: number
    orderCount: number
    revenue: number
  }>
}

export default function RepresentantDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/representant/dashboard')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données')
      }
      
      const data = await response.json()
      setDashboardData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING": return "secondary"
      case "VALIDATED": return "default"
      case "PROCESSING": return "outline"
      case "SHIPPED": return "outline"
      case "DELIVERED": return "default"
      case "CANCELLED": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "En attente"
      case "VALIDATED": return "Validée"
      case "PROCESSING": return "En préparation"
      case "SHIPPED": return "Expédiée"
      case "DELIVERED": return "Livrée"
      case "CANCELLED": return "Annulée"
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Erreur de chargement</p>
            <Button onClick={fetchDashboardData} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Tableau de bord Représentant</h1>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <TrendingUp className="mr-1 h-3 w-3" />
              Commercial
            </Badge>
          </div>
          <p className="text-muted-foreground">Gestion des clients, commandes et suivi des commissions</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Commission: 10% sur les ventes validées</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button size="sm" onClick={() => window.location.href = '/dashboard/representant/clients'}>
            <UserCheck className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nouveau client</span>
            <span className="sm:hidden">Client</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/representant/commandes'}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle commande</span>
            <span className="sm:hidden">Commande</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Commandes Total"
          value={dashboardData?.summary.totalOrders.toString() || "0"}
          description="Toutes commandes"
          icon={Package}
          trend={{ value: 0, label: "ce mois", type: "positive" }}
        />
        <StatsCard
          title="Commandes En Attente"
          value={dashboardData?.summary.pendingOrders.toString() || "0"}
          description="En attente de validation"
          icon={Clock}
          trend={{ value: 0, label: "urgent", type: "neutral" }}
        />
        <StatsCard
          title="Commandes Validées"
          value={dashboardData?.summary.validatedOrders.toString() || "0"}
          description="Validées par le PDG"
          icon={CheckCircle}
          trend={{ value: 0, label: "ce mois", type: "positive" }}
        />
        <StatsCard
          title="Commissions Total"
          value={`${dashboardData?.summary.totalCommissions.toLocaleString() || "0"} FCFA`}
          description="10% sur les ventes"
          icon={DollarSign}
          trend={{ value: 0, label: "vs mois dernier", type: "positive" }}
        />
      </div>

      {/* Commercial Access Notice */}
      <Card className="border-l-4 border-l-green-500 bg-green-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Accès Commercial</h3>
              <p className="text-sm text-green-700">
                Vous pouvez créer des commandes pour vos clients, gérer votre portefeuille client et suivre vos commissions. 
                Les commandes sont validées par le PDG avant traitement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Évolution des Ventes
            </CardTitle>
            <CardDescription>Commandes et commissions des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData?.chartData || []} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString()} FCFA`,
                      name === "ventes" ? "Ventes" : name === "commissions" ? "Commissions" : "Commandes",
                    ]}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="ventes" fill="hsl(var(--primary))" name="ventes" />
                  <Bar dataKey="commissions" fill="hsl(var(--accent))" name="commissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Commandes Récentes
            </CardTitle>
            <CardDescription>Vos dernières commandes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.recentOrders.length ? (
              dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <div>
                      <p className="font-medium">Commande {order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">{order.total.toLocaleString()} FCFA</p>
                      <p className="text-xs text-muted-foreground">{order.itemCount} article(s)</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard/representant/commandes'}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <p>Aucune commande récente</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.href = '/dashboard/representant/commandes'}
                >
                  Créer une commande
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Top Œuvres Vendues
          </CardTitle>
          <CardDescription>Vos œuvres les plus vendues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboardData?.topWorks.length ? (
            dashboardData.topWorks.map((item, index) => (
              <div key={item.work.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <h4 className="font-medium">{item.work.title}</h4>
                      <Badge variant="secondary">{item.work.discipline.name}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground md:grid-cols-4">
                      <div>Auteur: {item.work.author?.name || "Inconnu"}</div>
                      <div>ISBN: {item.work.isbn}</div>
                      <div>Prix: {item.work.price.toLocaleString()} FCFA</div>
                      <div>Stock: {item.work.stock} exemplaires</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.totalSold} vendus</p>
                    <p className="text-sm text-muted-foreground">{item.orderCount} commande(s)</p>
                    <p className="text-xs text-green-600">{item.revenue.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p>Aucune vente enregistrée</p>
              <p className="text-sm">Créez des commandes pour voir les statistiques</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
