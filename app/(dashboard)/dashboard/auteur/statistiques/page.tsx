"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Eye, 
  Users, 
  Award,
  RefreshCw
} from "lucide-react"

interface AuthorStats {
  overview: {
    totalWorks: number
    publishedWorks: number
    totalSales: number
    totalRevenue: number
    totalRoyalties: number
    paidRoyalties: number
    pendingRoyalties: number
  }
  monthlyData: Array<{
    month: string
    sales: number
    revenue: number
    royalties: number
  }>
  topWorksBySales: Array<{
    id: string
    title: string
    sales: number
    revenue: number
    royalties: number
    status: string
  }>
  comparisons: {
    sales: {
      current: number
      previous: number
      change: number
    }
    revenue: {
      current: number
      previous: number
      change: number
    }
    royalties: {
      current: number
      previous: number
      change: number
    }
  }
  performanceMetrics: {
    averageSalesPerWork: number
    averageRevenuePerWork: number
    averageRoyaltiesPerWork: number
    royaltyRate: number
    conversionRate: number
  }
}

export default function AuteurStatistiques() {
  const [stats, setStats] = useState<AuthorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/author/stats", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch stats data")
      }
      
      const data: AuthorStats = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      console.error("❌ Stats fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF"
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON_SALE":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">En vente</Badge>
      case "ACCEPTED":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Accepté</Badge>
      case "SUBMITTED":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Soumis</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: {error || 'Données non disponibles'}</p>
        <Button onClick={fetchStats} className="mt-4" disabled={refreshing}>
          {refreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Rechargement...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </>
          )}
        </Button>
      </div>
    )
  }

  // Préparer les données pour les graphiques
  const salesChartData = stats.monthlyData.map(item => ({
    month: item.month,
    ventes: item.sales,
    revenus: item.revenue,
    droits: item.royalties
  }))

  const royaltyChartData = stats.monthlyData.map(item => ({
    month: item.month,
    générés: item.royalties,
    versés: Math.round(item.royalties * 0.7), // Simuler les paiements
    en_attente: Math.round(item.royalties * 0.3) // Simuler les en attente
  }))

  const worksPerformanceData = stats.topWorksBySales.map(work => ({
    name: work.title.length > 20 ? work.title.substring(0, 20) + "..." : work.title,
    ventes: work.sales,
    droits: work.royalties
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Statistiques</h1>
          <p className="text-muted-foreground">Analyse des performances de vos œuvres et revenus générés</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchStats} variant="outline" disabled={refreshing}>
            {refreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Actualiser
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exporter le rapport
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Œuvres Publiées</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalWorks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overview.publishedWorks} en vente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.comparisons.sales.change > 0 ? "+" : ""}{stats.comparisons.sales.change}% vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Droits Générés</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.overview.totalRoyalties)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.comparisons.royalties.change > 0 ? "+" : ""}{stats.comparisons.royalties.change}% vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.overview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.comparisons.revenue.change > 0 ? "+" : ""}{stats.comparisons.revenue.change}% vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="oeuvres">Mes Œuvres</TabsTrigger>
          <TabsTrigger value="royalties">Royalties</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Ventes et Revenus</CardTitle>
                <CardDescription>Suivi mensuel de vos performances</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventes" fill="#8884d8" name="Ventes" />
                    <Bar dataKey="revenus" fill="#82ca9d" name="Revenus (FCFA)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance par Œuvre</CardTitle>
                <CardDescription>Ventes et droits par publication</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={worksPerformanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="ventes" fill="#8884d8" name="Ventes" />
                    <Bar dataKey="droits" fill="#82ca9d" name="Droits (FCFA)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="oeuvres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Œuvre</CardTitle>
              <CardDescription>Analyse détaillée de chaque publication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topWorksBySales.map((work, index) => (
                  <div key={work.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{work.title}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(work.status)}
                        <span className="text-sm text-muted-foreground">
                          {work.sales} ventes • {formatCurrency(work.revenue)} • {formatCurrency(work.royalties)} droits
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="royalties" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Royalties</CardTitle>
                <CardDescription>Suivi des droits générés et versés</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={royaltyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="générés" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="versés" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="en_attente" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Royalties</CardTitle>
                <CardDescription>État actuel de vos droits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total généré</span>
                      <span className="font-medium">{formatCurrency(stats.overview.totalRoyalties)}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Versé</span>
                      <span className="font-medium text-green-600">{formatCurrency(stats.overview.paidRoyalties)}</span>
                    </div>
                    <Progress value={(stats.overview.paidRoyalties / stats.overview.totalRoyalties) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>En attente</span>
                      <span className="font-medium text-blue-600">{formatCurrency(stats.overview.pendingRoyalties)}</span>
                    </div>
                    <Progress value={(stats.overview.pendingRoyalties / stats.overview.totalRoyalties) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="objectifs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs 2024</CardTitle>
                <CardDescription>Progression vers vos objectifs annuels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nouvelles publications</span>
                    <span>{stats.overview.totalWorks}/15</span>
                  </div>
                  <Progress value={(stats.overview.totalWorks / 15) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ventes totales</span>
                    <span>{stats.overview.totalSales.toLocaleString()}/5,000</span>
                  </div>
                  <Progress value={(stats.overview.totalSales / 5000) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Revenus droits</span>
                    <span>{formatCurrency(stats.overview.totalRoyalties)}/500,000 FCFA</span>
                  </div>
                  <Progress value={(stats.overview.totalRoyalties / 500000) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moyennes par Œuvre</CardTitle>
                <CardDescription>Performances moyennes de vos publications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ventes moyennes par œuvre</span>
                    <span className="font-medium">{Math.round(stats.performanceMetrics.averageSalesPerWork)}</span>
                  </div>
                  <Progress value={Math.min((stats.performanceMetrics.averageSalesPerWork / 100) * 100, 100)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Royalties moyennes par œuvre</span>
                    <span className="font-medium">{formatCurrency(stats.performanceMetrics.averageRoyaltiesPerWork)}</span>
                  </div>
                  <Progress value={Math.min((stats.performanceMetrics.averageRoyaltiesPerWork / 10000) * 100, 100)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taux de publication</span>
                    <span className="font-medium">{Math.round((stats.overview.publishedWorks / stats.overview.totalWorks) * 100)}%</span>
                  </div>
                  <Progress value={(stats.overview.publishedWorks / stats.overview.totalWorks) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}