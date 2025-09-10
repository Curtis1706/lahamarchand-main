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
  Bell,
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react"

interface Notification {
  id: string
  type: "order" | "delivery" | "catalog" | "system"
  title: string
  message: string
  date: string
  read: boolean
  priority: "low" | "medium" | "high"
  icon: string
  action?: {
    type: string
    orderId?: string
    workId?: string
  }
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

export default function RepresentantNotifications() {
  const [notificationsData, setNotificationsData] = useState<NotificationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [readFilter, setReadFilter] = useState("all")

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/representant/notifications')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des notifications')
      }
      
      const data: NotificationsResponse = await response.json()
      setNotificationsData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return <Package className="h-4 w-4 text-blue-600" />
      case "delivery": return <Truck className="h-4 w-4 text-green-600" />
      case "catalog": return <Bell className="h-4 w-4 text-purple-600" />
      case "system": return <AlertCircle className="h-4 w-4 text-gray-600" />
      default: return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "order": return "Commande"
      case "delivery": return "Livraison"
      case "catalog": return "Catalogue"
      case "system": return "Système"
      default: return type
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "secondary"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Urgent"
      case "medium": return "Moyen"
      case "low": return "Faible"
      default: return priority
    }
  }

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Maintenant"
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInHours < 48) return "Hier"
    return notificationDate.toLocaleDateString("fr-FR")
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/representant/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          action: 'read'
        })
      })

      // Mettre à jour l'état local
      if (notificationsData) {
        setNotificationsData({
          ...notificationsData,
          notifications: notificationsData.notifications.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
          summary: {
            ...notificationsData.summary,
            unread: Math.max(0, notificationsData.summary.unread - 1)
          }
        })
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const filteredNotifications = notificationsData?.notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter
    
    let matchesRead = true
    if (readFilter === "read") matchesRead = notification.read
    else if (readFilter === "unread") matchesRead = !notification.read
    
    return matchesSearch && matchesType && matchesPriority && matchesRead
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
            <Bell className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Erreur de chargement</p>
            <Button onClick={fetchNotifications} variant="outline">
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
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Notifications</h1>
        <p className="text-muted-foreground">Suivez les mises à jour de vos commandes et commissions</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{notificationsData?.summary.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <EyeOff className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Non lues</p>
                <p className="text-2xl font-bold">{notificationsData?.summary.unread || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                <p className="text-2xl font-bold">{notificationsData?.summary.highPriority || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold">{notificationsData?.summary.byType.order || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher dans les notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="order">Commandes</SelectItem>
            <SelectItem value="delivery">Livraisons</SelectItem>
            <SelectItem value="catalog">Catalogue</SelectItem>
            <SelectItem value="system">Système</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="high">Urgent</SelectItem>
            <SelectItem value="medium">Moyen</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
          </SelectContent>
        </Select>
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="unread">Non lues</SelectItem>
            <SelectItem value="read">Lues</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications ({filteredNotifications.length})
          </CardTitle>
          <CardDescription>Liste de toutes vos notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucune notification trouvée</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || typeFilter !== "all" || priorityFilter !== "all" || readFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Vous n'avez pas encore de notifications"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-300"}`}>
                            {notification.title}
                          </h4>
                          <Badge variant={getPriorityBadgeVariant(notification.priority)} className="text-xs">
                            {getPriorityLabel(notification.priority)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getRelativeTime(notification.date)}
                          </span>
                          {!notification.read && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <EyeOff className="h-3 w-3" />
                              Non lue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {notification.action && (
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}