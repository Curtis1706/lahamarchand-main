"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  DollarSign,
  Eye,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  User,
  Mail,
  Shield,
  Edit,
} from "lucide-react"
import { usePDGOrders } from "@/hooks/use-data"
import { apiClient } from "@/lib/api-client"
import { OrderStatus } from "@prisma/client"

interface Order {
  id: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    work: {
      id: string
      title: string
      isbn?: string
      price: number
      discipline?: {
        id: string
        name: string
      }
    }
  }>
}

export default function CommandesPDGPage() {
  const { orders, loading, error, refetch } = usePDGOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Appliquer les filtres
  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.work.title.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesUser = userFilter === "all" || order.user.role === userFilter
    
    return matchesSearch && matchesStatus && matchesUser
  })

  // Statistiques
  const stats = {
    total: orders.length,
    pending: orders.filter((o: Order) => o.status === OrderStatus.PENDING).length,
    validated: orders.filter((o: Order) => o.status === OrderStatus.VALIDATED).length,
    processing: orders.filter((o: Order) => o.status === OrderStatus.PROCESSING).length,
    shipped: orders.filter((o: Order) => o.status === OrderStatus.SHIPPED).length,
    delivered: orders.filter((o: Order) => o.status === OrderStatus.DELIVERED).length,
    cancelled: orders.filter((o: Order) => o.status === OrderStatus.CANCELLED).length,
  }

  // Calculer le total d'une commande
  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Calculer le chiffre d'affaires total
  const totalRevenue = orders
    .filter(order => order.status !== OrderStatus.CANCELLED)
    .reduce((total, order) => total + calculateOrderTotal(order), 0)

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(orderId)
    
    try {
      console.log(`👑 Updating order ${orderId} to status:`, newStatus)
      
      const result = await apiClient.updateOrderStatus(orderId, newStatus)
      
      if (result.error) {
        console.error("❌ Order update error:", result.error)
        alert(`Erreur: ${result.error}`)
        return
      }

      console.log("✅ Order updated successfully:", result.data)
      alert(`Commande mise à jour vers: ${getStatusLabel(newStatus)}`)
      refetch()
    } catch (error: any) {
      console.error("❌ Order update error:", error)
      alert(`Erreur lors de la mise à jour de la commande: ${error.message || 'Erreur inconnue'}`)
    } finally {
      setIsUpdating(null)
    }
  }

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return "secondary"
      case OrderStatus.VALIDATED: return "default"
      case OrderStatus.PROCESSING: return "default"
      case OrderStatus.SHIPPED: return "default"
      case OrderStatus.DELIVERED: return "default"
      case OrderStatus.CANCELLED: return "destructive"
      default: return "outline"
    }
  }

  // Obtenir l'icône selon le statut
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return Clock
      case OrderStatus.VALIDATED: return CheckCircle
      case OrderStatus.PROCESSING: return Package
      case OrderStatus.SHIPPED: return Truck
      case OrderStatus.DELIVERED: return CheckCircle
      case OrderStatus.CANCELLED: return XCircle
      default: return AlertCircle
    }
  }

  // Obtenir le libellé français du statut
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return "En attente"
      case OrderStatus.VALIDATED: return "Validée"
      case OrderStatus.PROCESSING: return "En préparation"
      case OrderStatus.SHIPPED: return "Expédiée"
      case OrderStatus.DELIVERED: return "Livrée"
      case OrderStatus.CANCELLED: return "Annulée"
      default: return status
    }
  }

  // Obtenir les actions possibles selon le statut
  const getAvailableActions = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return [
          { status: OrderStatus.VALIDATED, label: "Valider", variant: "default" as const },
          { status: OrderStatus.CANCELLED, label: "Annuler", variant: "destructive" as const }
        ]
      case OrderStatus.VALIDATED:
        return [
          { status: OrderStatus.PROCESSING, label: "Mettre en préparation", variant: "default" as const }
        ]
      case OrderStatus.PROCESSING:
        return [
          { status: OrderStatus.SHIPPED, label: "Marquer comme expédiée", variant: "default" as const }
        ]
      case OrderStatus.SHIPPED:
        return [
          { status: OrderStatus.DELIVERED, label: "Marquer comme livrée", variant: "default" as const }
        ]
      default:
        return []
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des commandes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground lg:text-3xl break-words">
              Gestion des Commandes
            </h1>
            <Badge variant="destructive" className="text-xs w-fit">
              <Shield className="mr-1 h-3 w-3" />
              PDG
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérer toutes les commandes de la plateforme
          </p>
        </div>
        
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 lg:grid-cols-7">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Validées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.validated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En préparation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expédiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Livrées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.delivered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CA Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">{totalRevenue.toLocaleString()} FCFA</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par client, email, ID commande ou œuvre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value={OrderStatus.PENDING}>En attente</SelectItem>
                <SelectItem value={OrderStatus.VALIDATED}>Validées</SelectItem>
                <SelectItem value={OrderStatus.PROCESSING}>En préparation</SelectItem>
                <SelectItem value={OrderStatus.SHIPPED}>Expédiées</SelectItem>
                <SelectItem value={OrderStatus.DELIVERED}>Livrées</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Annulées</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="CLIENT">Clients</SelectItem>
                <SelectItem value="PARTENAIRE">Partenaires</SelectItem>
                <SelectItem value="REPRESENTANT">Représentants</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Liste des commandes */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune commande trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: Order) => {
            const StatusIcon = getStatusIcon(order.status)
            const orderTotal = calculateOrderTotal(order)
            const availableActions = getAvailableActions(order.status)
            
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <StatusIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Commande #{order.id.slice(-8).toUpperCase()}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.user.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {order.user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {order.user.role}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm font-medium">Articles commandés:</div>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.work.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.work.discipline?.name || "Discipline non spécifiée"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Quantité: {item.quantity}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.price.toLocaleString()} FCFA × {item.quantity} = {(item.price * item.quantity).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-3 w-3" />
                          Détails
                        </Button>
                        {availableActions.map((action) => (
                          <AlertDialog key={action.status}>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant={action.variant}
                                disabled={isUpdating === order.id}
                              >
                                {isUpdating === order.id ? (
                                  <>
                                    <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                    Mise à jour...
                                  </>
                                ) : (
                                  <>
                                    <Edit className="mr-2 h-3 w-3" />
                                    {action.label}
                                  </>
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer l'action</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir {action.label.toLowerCase()} cette commande ?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => updateOrderStatus(order.id, action.status)}
                                >
                                  Confirmer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">Total: {orderTotal.toLocaleString()} FCFA</p>
                        <p className="text-xs text-muted-foreground">
                          Dernière mise à jour: {new Date(order.updatedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}