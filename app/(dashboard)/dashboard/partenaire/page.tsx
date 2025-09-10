"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Building2,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  BarChart3,
  Eye,
} from "lucide-react"

interface Partner {
  id: string
  name: string
  type: string
  address: string | null
  phone: string | null
  email: string | null
  contact: string | null
  website: string | null
  description: string | null
  representant: {
    id: string
    name: string
    email: string
  } | null
}

interface Order {
  id: string
  status: string
  total: number
  itemCount: number
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    amount: number
    work: {
      id: string
      title: string
      isbn: string
      discipline: string
      author: string
    }
  }>
}

interface ChartData {
  month: string
  commandes: number
  montant: number
}

interface TopWork {
  work: {
    id: string
    title: string
    isbn: string
    discipline: string
    author: string
  }
  totalQuantity: number
  totalValue: number
  orderCount: number
}

interface DashboardData {
  partner: Partner
  summary: {
    totalOrders: number
    pendingOrders: number
    validatedOrders: number
    deliveredOrders: number
    totalValue: number
    averageOrderValue: number
  }
  recentOrders: Order[]
  chartData: ChartData[]
  topWorks: TopWork[]
}

export default function PartenaireDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/partenaire/dashboard')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données du tableau de bord')
      }
      
      const data: DashboardData = await response.json()
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
      case "PROCESSING": return "default"
      case "SHIPPED": return "default"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4" />
      case "VALIDATED": return <CheckCircle className="h-4 w-4" />
      case "PROCESSING": return <Package className="h-4 w-4" />
      case "SHIPPED": return <Truck className="h-4 w-4" />
      case "DELIVERED": return <CheckCircle className="h-4 w-4" />
      case "CANCELLED": return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
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
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                {dashboardData?.partner.name}
              </h1>
              <p className="text-muted-foreground">
                {dashboardData?.partner.type} • Partenaire institutionnel
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/partenaire/catalogue'}>
            <Package className="mr-2 h-4 w-4" />
            Consulter le catalogue
          </Button>
          <Button onClick={() => window.location.href = '/dashboard/partenaire/commandes'}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nouvelle commande
          </Button>
        </div>
      </div>

      {/* Informations du partenaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations de l'Organisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Type d'organisation</h4>
              <p className="text-sm text-muted-foreground">{dashboardData?.partner.type}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Personne de contact</h4>
              <p className="text-sm text-muted-foreground">
                {dashboardData?.partner.contact || "Non spécifié"}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Téléphone</h4>
              <p className="text-sm text-muted-foreground">
                {dashboardData?.partner.phone || "Non spécifié"}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Email</h4>
              <p className="text-sm text-muted-foreground">
                {dashboardData?.partner.email || "Non spécifié"}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Site web</h4>
              <p className="text-sm text-muted-foreground">
                {dashboardData?.partner.website ? (
                  <a href={dashboardData.partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {dashboardData.partner.website}
                  </a>
                ) : "Non spécifié"}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Représentant assigné</h4>
              <p className="text-sm text-muted-foreground">
                {dashboardData?.partner.representant ? (
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {dashboardData.partner.representant.name}
                  </span>
                ) : "Aucun représentant assigné"}
              </p>
            </div>
          </div>
          {dashboardData?.partner.description && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{dashboardData.partner.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Commandes</p>
                <p className="text-2xl font-bold">{dashboardData?.summary.totalOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En Attente</p>
                <p className="text-2xl font-bold">{dashboardData?.summary.pendingOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Livrées</p>
                <p className="text-2xl font-bold">{dashboardData?.summary.deliveredOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valeur Totale</p>
                <p className="text-2xl font-bold">
                  {dashboardData?.summary.totalValue.toLocaleString() || "0"} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commandes récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Commandes Récentes
          </CardTitle>
          <CardDescription>Vos 5 dernières commandes</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData?.recentOrders.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.itemCount} article(s)</TableCell>
                    <TableCell>{order.total.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucune commande récente</p>
              <p className="text-sm text-muted-foreground">
                Vos commandes apparaîtront ici une fois créées
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top œuvres commandées */}
      {dashboardData?.topWorks.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Œuvres Commandées
            </CardTitle>
            <CardDescription>Vos œuvres les plus commandées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topWorks.map((item, index) => (
                <div key={item.work.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <h4 className="font-medium">{item.work.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.work.author} • {item.work.discipline}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.totalQuantity} exemplaires</p>
                    <p className="text-sm text-muted-foreground">
                      {item.totalValue.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Graphique des commandes */}
      {dashboardData?.chartData.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Évolution des Commandes
            </CardTitle>
            <CardDescription>Vos commandes des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.chartData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="font-medium">{data.month}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Commandes</p>
                      <p className="font-medium">{data.commandes}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Montant</p>
                      <p className="font-medium">{data.montant.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Notice d'accès partenaire */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Building2 className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Accès Partenaire Institutionnel
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                En tant que partenaire institutionnel, vous bénéficiez d'un accès privilégié à notre catalogue 
                et pouvez passer des commandes groupées pour votre organisation.
              </p>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="mb-1">✅ Commandes groupées pour vos membres</p>
                <p className="mb-1">✅ Suivi détaillé de vos commandes</p>
                <p className="mb-1">✅ Accès au catalogue complet</p>
                <p>✅ Support dédié via votre représentant</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}