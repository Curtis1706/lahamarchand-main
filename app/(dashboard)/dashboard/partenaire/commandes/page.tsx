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
  ShoppingCart,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Package,
  Truck,
  AlertTriangle,
  Eye,
  Plus,
} from "lucide-react"

interface Order {
  id: string
  status: string
  total: number
  itemCount: number
  createdAt: string
  updatedAt: string
  items: Array<{
    id: string
    quantity: number
    amount: number
    work: {
      id: string
      title: string
      isbn: string
      price: number
      discipline: string
      author: string
    }
  }>
}

export default function PartenaireCommandes() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      
      const response = await fetch(`/api/partenaire/orders?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes')
      }
      
      const data = await response.json()
      setOrders(data.orders)
      setError(null)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           item.work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.work.isbn.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    
    return matchesSearch
  })

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
            <Button onClick={fetchOrders} variant="outline">
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
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Mes Commandes</h1>
          <p className="text-muted-foreground">Suivi de toutes vos commandes institutionnelles</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/partenaire/catalogue'}>
            <Package className="mr-2 h-4 w-4" />
            Consulter le catalogue
          </Button>
          <Button onClick={() => window.location.href = '/dashboard/partenaire/catalogue'}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle commande
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par numéro de commande, titre ou ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="VALIDATED">Validée</SelectItem>
            <SelectItem value="PROCESSING">En préparation</SelectItem>
            <SelectItem value="SHIPPED">Expédiée</SelectItem>
            <SelectItem value="DELIVERED">Livrée</SelectItem>
            <SelectItem value="CANCELLED">Annulée</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtres avancés
        </Button>
      </div>

      {/* Liste des commandes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Commandes ({filteredOrders.length})
          </CardTitle>
          <CardDescription>Liste de toutes vos commandes</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucune commande trouvée</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Vous n'avez pas encore passé de commandes"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">Commande #{order.id.slice(-8)}</h4>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground md:grid-cols-3">
                        <div>Articles: {order.itemCount}</div>
                        <div>Montant: {order.total.toLocaleString()} FCFA</div>
                        <div>Date: {new Date(order.createdAt).toLocaleDateString("fr-FR")}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Articles de la commande */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Articles commandés:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h6 className="font-medium text-sm">{item.work.title}</h6>
                              <p className="text-xs text-muted-foreground">
                                {item.work.author} • {item.work.discipline}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ISBN: {item.work.isbn}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{item.quantity} exemplaires</p>
                              <p className="text-sm text-muted-foreground">
                                {item.amount.toLocaleString()} FCFA
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Commandes</p>
                <p className="text-2xl font-bold">{orders.length}</p>
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
                  {orders.filter(o => o.status === "PENDING").length}
                </p>
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
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === "DELIVERED").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valeur Totale</p>
                <p className="text-2xl font-bold">
                  {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
