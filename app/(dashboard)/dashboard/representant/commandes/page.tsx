"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Package,
  Plus,
  Eye,
  Search,
  Filter,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
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
    work: {
      id: string
      title: string
      isbn: string
      price: number
      discipline: string
      author: string
    }
    quantity: number
    price: number
  }>
}

interface Work {
  id: string
  title: string
  isbn: string
  price: number
  stock: number
  discipline: {
    id: string
    name: string
  }
  author: {
    id: string
    name: string
    email: string
  } | null
}

interface OrdersResponse {
  orders: Order[]
  summary: {
    total: number
    pending: number
    validated: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
  }
}

interface CatalogResponse {
  works: Work[]
  summary: {
    totalWorks: number
    totalValue: number
    disciplines: number
    authors: number
    averagePrice: number
    totalStock: number
  }
}

export default function RepresentantCommandes() {
  const [orders, setOrders] = useState<Order[]>([])
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedWorks, setSelectedWorks] = useState<Array<{ workId: string; quantity: number; price: number }>>([])
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/representant/orders')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes')
      }
      
      const data: OrdersResponse = await response.json()
      setOrders(data.orders)
      setError(null)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const fetchCatalog = async () => {
    try {
      const response = await fetch('/api/representant/catalog')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du catalogue')
      }
      
      const data: CatalogResponse = await response.json()
      setWorks(data.works)
    } catch (err) {
      console.error('Error fetching catalog:', err)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchCatalog()
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4" />
      case "VALIDATED": return <CheckCircle className="h-4 w-4" />
      case "PROCESSING": return <Package className="h-4 w-4" />
      case "SHIPPED": return <Truck className="h-4 w-4" />
      case "DELIVERED": return <CheckCircle className="h-4 w-4" />
      case "CANCELLED": return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           item.work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.work.author.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const addWorkToOrder = (work: Work) => {
    const existingIndex = selectedWorks.findIndex(item => item.workId === work.id)
    
    if (existingIndex >= 0) {
      // Augmenter la quantité
      const newWorks = [...selectedWorks]
      newWorks[existingIndex].quantity += 1
      setSelectedWorks(newWorks)
    } else {
      // Ajouter un nouvel item
      setSelectedWorks([...selectedWorks, {
        workId: work.id,
        quantity: 1,
        price: work.price
      }])
    }
  }

  const removeWorkFromOrder = (workId: string) => {
    setSelectedWorks(selectedWorks.filter(item => item.workId !== workId))
  }

  const updateWorkQuantity = (workId: string, quantity: number) => {
    if (quantity <= 0) {
      removeWorkFromOrder(workId)
      return
    }
    
    setSelectedWorks(selectedWorks.map(item => 
      item.workId === workId ? { ...item, quantity } : item
    ))
  }

  const createOrder = async () => {
    if (selectedWorks.length === 0) {
      alert("Veuillez sélectionner au moins une œuvre")
      return
    }

    if (!clientInfo.name.trim()) {
      alert("Veuillez saisir le nom du client")
      return
    }

    try {
      const response = await fetch('/api/representant/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedWorks,
          clientName: clientInfo.name,
          clientEmail: clientInfo.email,
          clientPhone: clientInfo.phone,
          notes: clientInfo.notes
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande')
      }

      // Réinitialiser le formulaire
      setSelectedWorks([])
      setClientInfo({ name: "", email: "", phone: "", notes: "" })
      setIsCreateDialogOpen(false)
      
      // Recharger les commandes
      fetchOrders()
      
      alert("Commande créée avec succès !")
    } catch (err) {
      console.error('Error creating order:', err)
      alert(err instanceof Error ? err.message : 'Erreur lors de la création')
    }
  }

  const getTotalOrderValue = () => {
    return selectedWorks.reduce((sum, item) => sum + (item.price * item.quantity), 0)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Gestion des Commandes</h1>
          <p className="text-muted-foreground">Créer et suivre les commandes de vos clients</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle commande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle commande</DialogTitle>
              <DialogDescription>
                Sélectionnez les œuvres et renseignez les informations du client
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Catalogue des œuvres */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Catalogue des œuvres</h3>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {works.map((work) => (
                    <div key={work.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{work.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {work.author?.name || "Auteur inconnu"} • {work.discipline.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ISBN: {work.isbn} • Stock: {work.stock} • Prix: {work.price.toLocaleString()} FCFA
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addWorkToOrder(work)}
                          disabled={work.stock === 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panier et informations client */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Commande</h3>
                
                {/* Panier */}
                <div className="space-y-2">
                  <h4 className="font-medium">Articles sélectionnés</h4>
                  {selectedWorks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun article sélectionné</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedWorks.map((item) => {
                        const work = works.find(w => w.id === item.workId)
                        if (!work) return null
                        
                        return (
                          <div key={item.workId} className="p-2 border rounded flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{work.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {work.price.toLocaleString()} FCFA × {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateWorkQuantity(item.workId, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="text-sm w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateWorkQuantity(item.workId, item.quantity + 1)}
                                disabled={item.quantity >= work.stock}
                              >
                                +
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeWorkFromOrder(item.workId)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  
                  {selectedWorks.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">{getTotalOrderValue().toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Commission (10%):</span>
                        <span>{(getTotalOrderValue() * 0.1).toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informations client */}
                <div className="space-y-3">
                  <h4 className="font-medium">Informations client</h4>
                  <div>
                    <Label htmlFor="clientName">Nom du client *</Label>
                    <Input
                      id="clientName"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      placeholder="Nom du client"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Téléphone</Label>
                    <Input
                      id="clientPhone"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      placeholder="+241 XX XX XX XX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                      placeholder="Informations supplémentaires..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={createOrder} disabled={selectedWorks.length === 0}>
                Créer la commande
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="VALIDATED">Validée</SelectItem>
            <SelectItem value="PROCESSING">En préparation</SelectItem>
            <SelectItem value="SHIPPED">Expédiée</SelectItem>
            <SelectItem value="DELIVERED">Livrée</SelectItem>
            <SelectItem value="CANCELLED">Annulée</SelectItem>
          </SelectContent>
        </Select>
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
                  : "Créez votre première commande pour commencer"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{order.itemCount} article(s)</span>
                        <div className="text-xs text-muted-foreground">
                          {order.items.slice(0, 2).map(item => item.work.title).join(", ")}
                          {order.items.length > 2 && ` +${order.items.length - 2} autres`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.total.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString("fr-FR", { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </span>
                      </div>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}