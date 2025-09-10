"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  Eye,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface DeliveryItem {
  id: string
  work: {
    id: string
    title: string
    discipline: string
    author: string
  }
  quantity: number
  price: number
}

interface DeliveryStep {
  id: string
  title: string
  description: string
  completed: boolean
  date: Date | null
  icon: string
}

interface Delivery {
  id: string
  orderNumber: string
  status: string
  deliveryStatus: {
    current: string
    progress: number
    color: string
    icon: string
  }
  deliverySteps: DeliveryStep[]
  createdAt: Date
  totalAmount: number
  totalItems: number
  items: DeliveryItem[]
  user: {
    name: string
    email: string
  }
}

interface DeliveriesResponse {
  deliveries: Delivery[]
  summary: {
    total: number
    pending: number
    validated: number
    processing: number
    shipped: number
    delivered: number
  }
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [summary, setSummary] = useState<DeliveriesResponse["summary"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDeliveries = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/client/deliveries")
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des livraisons")
      }
      
      const data: DeliveriesResponse = await response.json()
      setDeliveries(data.deliveries)
      setSummary(data.summary)
      setError(null)
    } catch (err) {
      console.error("Error fetching deliveries:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const getStatusColor = (color: string) => {
    switch (color) {
      case "green": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      case "blue": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      case "yellow": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      case "red": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF"
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMMM yyyy 'à' HH:mm", { locale: fr })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suivi des livraisons</h1>
            <p className="text-muted-foreground">Suivez l'état de vos commandes en temps réel</p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suivi des livraisons</h1>
            <p className="text-muted-foreground">Suivez l'état de vos commandes en temps réel</p>
          </div>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <Package className="h-5 w-5" />
              <p className="font-medium">Erreur de chargement</p>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
            <Button 
              onClick={fetchDeliveries} 
              variant="outline" 
              className="mt-4"
              disabled={refreshing}
            >
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
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi des livraisons</h1>
          <p className="text-muted-foreground">Suivez l'état de vos commandes en temps réel</p>
        </div>
        <Button 
          onClick={fetchDeliveries} 
          variant="outline" 
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Actualisation...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des commandes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">Commandes actives</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
              <p className="text-xs text-muted-foreground">Validation en cours</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.validated}</div>
              <p className="text-xs text-muted-foreground">Paiement confirmé</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En préparation</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.processing}</div>
              <p className="text-xs text-muted-foreground">Préparation en cours</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expédiées</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.shipped}</div>
              <p className="text-xs text-muted-foreground">En route</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livrées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.delivered}</div>
              <p className="text-xs text-muted-foreground">Commandes terminées</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deliveries List */}
      <div className="space-y-4">
        {deliveries.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Aucune livraison</h3>
                <p className="text-muted-foreground mt-2">
                  Vous n'avez pas encore de commandes à suivre.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          deliveries.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{delivery.orderNumber}</CardTitle>
                    <CardDescription>
                      Commandée le {formatDate(delivery.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(delivery.deliveryStatus.color)}>
                      <span className="mr-1">{delivery.deliveryStatus.icon}</span>
                      {delivery.deliveryStatus.current}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedDelivery(delivery)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails de la commande {delivery.orderNumber}</DialogTitle>
                          <DialogDescription>
                            Suivi complet de votre commande
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Tabs defaultValue="timeline" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="items">Articles</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="timeline" className="space-y-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Progression de la livraison</h3>
                                <Badge className={getStatusColor(delivery.deliveryStatus.color)}>
                                  <span className="mr-1">{delivery.deliveryStatus.icon}</span>
                                  {delivery.deliveryStatus.current}
                                </Badge>
                              </div>
                              
                              <Progress value={delivery.deliveryStatus.progress} className="h-2" />
                              
                              <div className="space-y-3">
                                {delivery.deliverySteps.map((step, index) => (
                                  <div key={step.id} className="flex items-start space-x-3">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                      step.completed 
                                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                                        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                                    }`}>
                                      {step.completed ? "✓" : index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className={`text-sm font-medium ${
                                          step.completed ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                                        }`}>
                                          {step.title}
                                        </p>
                                        {step.date && (
                                          <p className="text-xs text-muted-foreground">
                                            {formatDate(step.date)}
                                          </p>
                                        )}
                                      </div>
                                      <p className={`text-xs ${
                                        step.completed ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"
                                      }`}>
                                        {step.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="items" className="space-y-4">
                            <div className="space-y-3">
                              <h3 className="text-lg font-semibold">Articles commandés</h3>
                              {delivery.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex-1">
                                    <p className="font-medium">{item.work.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.work.author} • {item.work.discipline}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{item.quantity}x</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatCurrency(item.price * item.quantity)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              
                              <Separator />
                              
                              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                  <p className="font-semibold">Total ({delivery.totalItems} articles)</p>
                                  <p className="text-sm text-muted-foreground">
                                    Livraison incluse
                                  </p>
                                </div>
                                <p className="text-lg font-bold">
                                  {formatCurrency(delivery.totalAmount)}
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Articles</p>
                    <p className="text-2xl font-bold">{delivery.totalItems}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Montant total</p>
                    <p className="text-2xl font-bold">{formatCurrency(delivery.totalAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Progression</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={delivery.deliveryStatus.progress} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{delivery.deliveryStatus.progress}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}