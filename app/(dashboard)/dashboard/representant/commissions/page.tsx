"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  Search,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
} from "lucide-react"

interface Commission {
  id: string
  orderDate: string
  orderTotal: number
  commission: number
  status: string
  itemCount: number
  items: Array<{
    work: {
      title: string
      author: string
      discipline: string
    }
    quantity: number
    price: number
    subtotal: number
  }>
}

interface CommissionsResponse {
  summary: {
    totalCommissions: number
    paidCommissions: number
    pendingCommissions: number
    commissionRate: number
    totalOrders: number
    averageCommission: number
  }
  commissions: Commission[]
  chartData: Array<{
    month: string
    commissions: number
    orders: number
  }>
  recentCommissions: Commission[]
}

export default function RepresentantCommissions() {
  const [commissionsData, setCommissionsData] = useState<CommissionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchCommissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/representant/commissions')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commissions')
      }
      
      const data: CommissionsResponse = await response.json()
      setCommissionsData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching commissions:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommissions()
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DELIVERED": return "default"
      case "VALIDATED": return "outline"
      case "PROCESSING": return "outline"
      case "SHIPPED": return "outline"
      default: return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DELIVERED": return "Payée"
      case "VALIDATED": return "En attente"
      case "PROCESSING": return "En attente"
      case "SHIPPED": return "En attente"
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED": return <CheckCircle className="h-4 w-4" />
      case "VALIDATED": return <Clock className="h-4 w-4" />
      case "PROCESSING": return <Package className="h-4 w-4" />
      case "SHIPPED": return <Package className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredCommissions = commissionsData?.commissions.filter(commission => {
    const matchesSearch = commission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.items.some(item => 
                           item.work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.work.author.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === "all" || commission.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

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
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Erreur de chargement</p>
            <Button onClick={fetchCommissions} variant="outline">
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
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Commissions</h1>
        <p className="text-muted-foreground">Suivez vos commissions sur les ventes (10% sur les commandes validées)</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Commissions</p>
                <p className="text-2xl font-bold">
                  {commissionsData?.summary.totalCommissions.toLocaleString() || "0"} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Commissions Payées</p>
                <p className="text-2xl font-bold">
                  {commissionsData?.summary.paidCommissions.toLocaleString() || "0"} FCFA
                </p>
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
                <p className="text-2xl font-bold">
                  {commissionsData?.summary.pendingCommissions.toLocaleString() || "0"} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Taux Commission</p>
                <p className="text-2xl font-bold">{commissionsData?.summary.commissionRate || 10}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des commissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Commissions
          </CardTitle>
          <CardDescription>Commissions des 6 derniers mois</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionsData?.chartData || []} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "commissions" ? `${value.toLocaleString()} FCFA` : value.toString(),
                    name === "commissions" ? "Commissions" : "Commandes",
                  ]}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="commissions" fill="hsl(var(--primary))" name="commissions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par ID de commande, titre d'œuvre ou auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="DELIVERED">Payées</SelectItem>
            <SelectItem value="VALIDATED">En attente</SelectItem>
            <SelectItem value="PROCESSING">En attente</SelectItem>
            <SelectItem value="SHIPPED">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des commissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Commissions ({filteredCommissions.length})
          </CardTitle>
          <CardDescription>Détail de toutes vos commissions</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCommissions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucune commission trouvée</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Créez des commandes pour générer des commissions"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total Commande</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-mono text-sm">
                      {commission.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm">
                          {new Date(commission.orderDate).toLocaleDateString("fr-FR")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(commission.orderDate).toLocaleTimeString("fr-FR", { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{commission.itemCount} article(s)</span>
                        <div className="text-xs text-muted-foreground">
                          {commission.items.slice(0, 2).map(item => item.work.title).join(", ")}
                          {commission.items.length > 2 && ` +${commission.items.length - 2} autres`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {commission.orderTotal.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {commission.commission.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(commission.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(commission.status)}
                        {getStatusLabel(commission.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Commissions récentes */}
      {commissionsData?.recentCommissions.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Commissions Récentes
            </CardTitle>
            <CardDescription>Vos 5 dernières commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commissionsData.recentCommissions.map((commission) => (
                <div key={commission.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">Commande {commission.id.slice(-8)}</h4>
                        <Badge variant={getStatusBadgeVariant(commission.status)} className="flex items-center gap-1">
                          {getStatusIcon(commission.status)}
                          {getStatusLabel(commission.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(commission.orderDate).toLocaleDateString("fr-FR")} • {commission.itemCount} article(s)
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {commission.items.slice(0, 3).map(item => (
                          <span key={item.work.title} className="mr-2">
                            {item.work.title} ({item.quantity}x)
                          </span>
                        ))}
                        {commission.items.length > 3 && `+${commission.items.length - 3} autres`}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{commission.orderTotal.toLocaleString()} FCFA</p>
                      <p className="text-sm text-green-600 font-medium">
                        Commission: {commission.commission.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
