"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { 
  Bell, 
  CheckCircle, 
  DollarSign, 
  Settings, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  BookOpen,
  RefreshCw
} from "lucide-react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  createdAt: string
  read: boolean
  priority: string
  amount?: number
  link?: string
  icon: string
}

interface NotificationsResponse {
  notifications: Notification[]
  summary: {
    total: number
    unread: number
    highPriority: number
    byType: {
      order: number
      delivery: number
      catalog: number
      system: number
    }
  }
}

export default function NotificationsAuteurPage() {
  const [filterType, setFilterType] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationsResponse["summary"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNotifications = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/author/notifications", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch notifications data")
      }
      
      const data: NotificationsResponse = await response.json()
      setNotifications(data.notifications)
      setStats(data.summary)
      setError(null)
    } catch (err) {
      console.error("❌ Notifications fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF"
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "sales":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "royalty":
        return <DollarSign className="h-4 w-4 text-purple-600" />
      case "review":
        return <BookOpen className="h-4 w-4 text-orange-600" />
      case "milestone":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "system":
        return <Bell className="h-4 w-4 text-gray-600" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "payment":
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Paiement</Badge>
      case "sales":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">Vente</Badge>
      case "royalty":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">Droits</Badge>
      case "review":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Avis</Badge>
      case "milestone":
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Objectif</Badge>
      case "system":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">Système</Badge>
      default:
        return <Badge variant="secondary">Autre</Badge>
    }
  }

  const getPrioriteBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Haute</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">Moyenne</Badge>
      case "low":
        return <Badge variant="secondary">Normale</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/author/notifications", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId: id })
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        if (stats) {
          setStats({ ...stats, unread: stats.unread - 1 })
        }
      }
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === "all" || notification.type === filterType
    const statusMatch = filterStatut === "all" || 
      (filterStatut === "unread" && !notification.read) ||
      (filterStatut === "read" && notification.read)
    
    return typeMatch && statusMatch
  })

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
        <Button onClick={fetchNotifications} className="mt-4" disabled={refreshing}>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Mes Notifications</h1>
          <p className="text-muted-foreground">
            Notifications automatiques sur vos ventes, droits d'auteur et paiements
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchNotifications} variant="outline" disabled={refreshing}>
            {refreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Actualiser
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques des notifications */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reçues</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Toutes périodes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non Lues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette Semaine</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Priorité haute</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernier Paiement</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.byType.delivery > 0 ? `${stats.byType.delivery} paiements` : "Aucun"}
            </div>
            <p className="text-xs text-muted-foreground">Paiements effectués</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="toutes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="toutes">Toutes</TabsTrigger>
          <TabsTrigger value="non_lues">Non Lues</TabsTrigger>
          <TabsTrigger value="financieres">Financières</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="toutes" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div>
                  <Label>Type de notification</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="payment">Paiements</SelectItem>
                      <SelectItem value="sales">Ventes</SelectItem>
                      <SelectItem value="royalty">Droits</SelectItem>
                      <SelectItem value="review">Avis lecteurs</SelectItem>
                      <SelectItem value="milestone">Objectifs</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="unread">Non lues</SelectItem>
                      <SelectItem value="read">Lues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications Récentes</CardTitle>
              <CardDescription>Historique de toutes vos notifications d'auteur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg ${
                      !notification.read ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`font-medium ${
                                !notification.read ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {getTypeBadge(notification.type)}
                            {getPrioriteBadge(notification.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(notification.createdAt)}
                            </span>
                            {notification.amount && (
                              <span className="flex items-center gap-1 text-green-600 font-medium">
                                <DollarSign className="h-3 w-3" />
                                {formatCurrency(notification.amount)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.link && (
                            <Button variant="outline" size="sm">
                              Voir détails
                            </Button>
                          )}
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="non_lues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications Non Lues</CardTitle>
              <CardDescription>
                {stats.unread} notifications nécessitent votre attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 border rounded-lg bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                    >
                      <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100">{notification.title}</h4>
                          {getTypeBadge(notification.type)}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        {notification.amount && (
                          <p className="text-lg font-bold text-green-600 mt-2">
                            {formatCurrency(notification.amount)}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                        Marquer comme lue
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financieres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications Financières</CardTitle>
              <CardDescription>Paiements, droits d'auteur et revenus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications
                  .filter((n) => ["payment", "royalty"].includes(n.type))
                  .map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          {getTypeBadge(notification.type)}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        {notification.amount && (
                          <p className="text-lg font-bold text-green-600 mt-2">
                            {formatCurrency(notification.amount)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notifications</CardTitle>
              <CardDescription>Configurez vos préférences de notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Types de notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Notifications de ventes</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Calculs de droits d'auteur</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Confirmations de paiements</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Avis des lecteurs</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Méthodes de livraison</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Notifications par email</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Notifications push</Label>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>

              <div>
                <Label>Fréquence des notifications</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiate</SelectItem>
                    <SelectItem value="quotidienne">Quotidienne</SelectItem>
                    <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Sauvegarder les paramètres</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}