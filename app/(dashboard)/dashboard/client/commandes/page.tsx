"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Order {
  id: string
  date: string
  status: string
  total: number
  itemsCount: number
  items: Array<{
    id: string
    title: string
    author?: string
    discipline: string
    quantity: number
    unitPrice: number
    totalPrice: number
    isbn?: string
  }>
}

export default function CommandesPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Charger les commandes
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/client/orders', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      
      const data = await response.json()
      setOrders(data.orders)
    } catch (err) {
      console.error('Orders fetch error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  // Annuler une commande
  const cancelOrder = async (orderId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/client/orders', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          action: 'cancel'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel order')
      }

      // Recharger les commandes
      await fetchOrders()
      alert('Commande annulée avec succès!')

    } catch (error) {
      console.error('Cancel order error:', error)
      alert(`Erreur lors de l'annulation: ${error instanceof Error ? error.message : error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Afficher les détails d'une commande
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  // Appliquer le filtre de statut
  const filteredOrders = orders.filter((order: Order) => {
    return statusFilter === "all" || order.status === statusFilter
  })

  // Statistiques
  const stats = {
    total: orders.length,
    pending: orders.filter((o: Order) => o.status === "PENDING").length,
    validated: orders.filter((o: Order) => o.status === "VALIDATED").length,
    processing: orders.filter((o: Order) => o.status === "PROCESSING").length,
    shipped: orders.filter((o: Order) => o.status === "SHIPPED").length,
    delivered: orders.filter((o: Order) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o: Order) => o.status === "CANCELLED").length,
  }

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING": return "secondary"
      case "VALIDATED": return "default"
      case "PROCESSING": return "default"
      case "SHIPPED": return "default"
      case "DELIVERED": return "default"
      case "CANCELLED": return "destructive"
      default: return "outline"
    }
  }

  // Obtenir l'icône selon le statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return Clock
      case "VALIDATED": return CheckCircle
      case "PROCESSING": return Package
      case "SHIPPED": return Truck
      case "DELIVERED": return CheckCircle
      case "CANCELLED": return XCircle
      default: return AlertCircle
    }
  }

  // Obtenir le libellé français du statut
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground lg:text-3xl break-words">
            Mes Commandes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Suivez l'état de vos commandes
          </p>
        </div>
        
        <Button onClick={() => fetchOrders()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
            <CardTitle className="text-sm font-medium">Livrées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.delivered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annulées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer par statut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="VALIDATED">Validées</SelectItem>
                <SelectItem value="DELIVERED">Livrées</SelectItem>
                <SelectItem value="CANCELLED">Annulées</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des commandes */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {orders.length === 0 
                ? "Vous n'avez pas encore passé de commande" 
                : "Aucune commande trouvée avec ce filtre"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: Order) => {
            const StatusIcon = getStatusIcon(order.status)
            
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
                            <Calendar className="h-3 w-3" />
                            {new Date(order.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {order.itemsCount} article{order.itemsCount > 1 ? 's' : ''}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {order.total.toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Articles commandés:</div>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.discipline}</p>
                          {item.author && (
                            <p className="text-xs text-muted-foreground">Par {item.author}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Quantité: {item.quantity}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.unitPrice.toLocaleString()} FCFA × {item.quantity} = {item.totalPrice.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => showOrderDetails(order)}
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          Détails
                        </Button>
                        {order.status === "PENDING" && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => cancelOrder(order.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Annulation..." : "Annuler"}
                          </Button>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">Total: {order.total.toLocaleString()} FCFA</p>
                        <p className="text-xs text-muted-foreground">
                          Commande du {new Date(order.date).toLocaleDateString('fr-FR')}
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

      {/* Modal de détails */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails de la commande #{selectedOrder?.id.slice(-8).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur votre commande
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Date de commande</h4>
                  <p className="font-semibold">{new Date(selectedOrder.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Statut</h4>
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Nombre d'articles</h4>
                  <p className="font-semibold">{selectedOrder.itemsCount} article{selectedOrder.itemsCount > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Total</h4>
                  <p className="font-semibold text-lg text-green-600">{selectedOrder.total.toLocaleString()} FCFA</p>
                </div>
              </div>

              {/* Articles détaillés */}
              <div>
                <h4 className="font-semibold mb-3">Articles commandés</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-lg">{item.title}</h5>
                          <div className="space-y-1 mt-2">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Discipline:</span> {item.discipline}
                            </p>
                            {item.author && (
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Auteur:</span> {item.author}
                              </p>
                            )}
                            {item.isbn && (
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">ISBN:</span> {item.isbn}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Prix unitaire</p>
                            <p className="font-medium">{item.unitPrice.toLocaleString()} FCFA</p>
                            <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                            <p className="font-bold text-lg">{item.totalPrice.toLocaleString()} FCFA</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  {selectedOrder.status === "PENDING" && (
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        setIsDetailModalOpen(false)
                        cancelOrder(selectedOrder.id)
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Annulation..." : "Annuler cette commande"}
                    </Button>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    Total: {selectedOrder.total.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}