"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  BookOpen,
  Settings,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Notification {
  id: string
  type: "order" | "delivery" | "catalog" | "system"
  title: string
  message: string
  date: Date
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [summary, setSummary] = useState<NotificationsResponse["summary"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const fetchNotifications = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/client/notifications")
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des notifications")
      }
      
      const data: NotificationsResponse = await response.json()
      setNotifications(data.notifications)
      setSummary(data.summary)
      setError(null)
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/client/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          action: "read"
        })
      })
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
      
      if (summary) {
        setSummary(prev => prev ? { ...prev, unread: prev.unread - 1 } : null)
      }
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("/api/client/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "mark_all_read"
        })
      })
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      )
      
      if (summary) {
        setSummary(prev => prev ? { ...prev, unread: 0 } : null)
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return <Package className="h-4 w-4" />
      case "delivery": return <Truck className="h-4 w-4" />
      case "catalog": return <BookOpen className="h-4 w-4" />
      case "system": return <Settings className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      case "low": return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMMM yyyy 'à' HH:mm", { locale: fr })
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Il y a moins d'1h"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return "Hier"
    return formatDate(date)
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setSelectedNotification(notification)
  }

  const handleAction = (notification: Notification) => {
    if (!notification.action) return

    switch (notification.action.type) {
      case "view_order":
        window.location.href = `/dashboard/client/commandes`
        break
      case "view_work":
        window.location.href = `/dashboard/client/catalogue`
        break
      case "view_catalog":
        window.location.href = `/dashboard/client/catalogue`
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Restez informé de vos commandes et nouveautés</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Restez informé de vos commandes et nouveautés</p>
          </div>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <Bell className="h-5 w-5" />
              <p className="font-medium">Erreur de chargement</p>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
            <Button 
              onClick={fetchNotifications} 
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
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Restez informé de vos commandes et nouveautés</p>
        </div>
        <div className="flex items-center space-x-2">
          {summary && summary.unread > 0 && (
            <Button 
              onClick={markAllAsRead} 
              variant="outline" 
              size="sm"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
          <Button 
            onClick={fetchNotifications} 
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
      </div>

      {/* Summary Cards */}
      {summary && (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">Notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non lues</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.unread}</div>
              <p className="text-xs text-muted-foreground">À consulter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Priorité haute</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.highPriority}</div>
              <p className="text-xs text-muted-foreground">Urgentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.byType.order}</div>
              <p className="text-xs text-muted-foreground">Suivi commandes</p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Notifications List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Non lues ({summary?.unread || 0})</TabsTrigger>
          <TabsTrigger value="orders">Commandes ({summary?.byType.order || 0})</TabsTrigger>
          <TabsTrigger value="catalog">Catalogue ({summary?.byType.catalog || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.length === 0 ? (
          <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Aucune notification</h3>
                  <p className="text-muted-foreground mt-2">
                    Vous n'avez pas encore de notifications.
                  </p>
              </div>
            </CardContent>
          </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                    key={notification.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-800 ${
                  !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/20" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        !notification.read ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {notification.icon}
                          </div>
                        </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-sm font-medium ${
                            !notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority === "high" ? "Urgent" : 
                             notification.priority === "medium" ? "Normal" : "Faible"}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(notification.date)}
                          </span>
                          {notification.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction(notification)
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        !notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(notification.type)}
                          <span>
                            {notification.type === "order" ? "Commande" :
                             notification.type === "delivery" ? "Livraison" :
                             notification.type === "catalog" ? "Catalogue" : "Système"}
                          </span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(notification.date)}</span>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {notifications.filter(n => !n.read).length === 0 ? (
          <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 text-lg font-semibold">Toutes lues</h3>
                  <p className="text-muted-foreground mt-2">
                    Vous avez lu toutes vos notifications.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            notifications.filter(n => !n.read).map((notification) => (
              <Card 
                      key={notification.id}
                className="cursor-pointer transition-colors hover:bg-gray-50 border-l-4 border-l-blue-500 bg-blue-50/30"
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-blue-100 text-blue-600">
                        {notification.icon}
                      </div>
                        </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority === "high" ? "Urgent" : 
                             notification.priority === "medium" ? "Normal" : "Faible"}
                          </Badge>
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(notification.date)}
                          </span>
                          {notification.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction(notification)
                              }}
                            >
                              <Eye className="h-3 w-3" />
                        </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm mt-1 text-gray-700">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(notification.type)}
                          <span>
                            {notification.type === "order" ? "Commande" :
                             notification.type === "delivery" ? "Livraison" :
                             notification.type === "catalog" ? "Catalogue" : "Système"}
                          </span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(notification.date)}</span>
                      </div>
                    </div>
              </div>
            </CardContent>
          </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {notifications.filter(n => n.type === "order" || n.type === "delivery").length === 0 ? (
          <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Aucune notification de commande</h3>
                  <p className="text-muted-foreground mt-2">
                    Vous n'avez pas encore de notifications liées à vos commandes.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            notifications.filter(n => n.type === "order" || n.type === "delivery").map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        !notification.read ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {notification.icon}
                      </div>
                        </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-sm font-medium ${
                            !notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority === "high" ? "Urgent" : 
                             notification.priority === "medium" ? "Normal" : "Faible"}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(notification.date)}
                          </span>
                          {notification.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction(notification)
                              }}
                            >
                              <Eye className="h-3 w-3" />
                      </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        !notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(notification.type)}
                          <span>
                            {notification.type === "order" ? "Commande" : "Livraison"}
                          </span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(notification.date)}</span>
                      </div>
                    </div>
              </div>
            </CardContent>
          </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          {notifications.filter(n => n.type === "catalog").length === 0 ? (
          <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Aucune nouveauté</h3>
                  <p className="text-muted-foreground mt-2">
                    Vous n'avez pas encore de notifications sur les nouveautés.
                  </p>
              </div>
            </CardContent>
          </Card>
          ) : (
            notifications.filter(n => n.type === "catalog").map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        !notification.read ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {notification.icon}
                  </div>
                  </div>
                    
                    <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-sm font-medium ${
                            !notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority === "high" ? "Urgent" : 
                             notification.priority === "medium" ? "Normal" : "Faible"}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                  </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(notification.date)}
                          </span>
                          {notification.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction(notification)
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                </div>
              </div>

                      <p className={`text-sm mt-1 ${
                        !notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(notification.type)}
                          <span>Catalogue</span>
                  </div>
                        <span>•</span>
                        <span>{formatDate(notification.date)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span className="text-2xl">{selectedNotification?.icon}</span>
              <span>{selectedNotification?.title}</span>
            </DialogTitle>
            <DialogDescription>
              {formatDate(selectedNotification?.date || new Date())}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              {selectedNotification?.message}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(selectedNotification?.priority || "low")}>
                  {selectedNotification?.priority === "high" ? "Urgent" : 
                   selectedNotification?.priority === "medium" ? "Normal" : "Faible"}
                </Badge>
                <Badge variant="outline">
                  {selectedNotification?.type === "order" ? "Commande" :
                   selectedNotification?.type === "delivery" ? "Livraison" :
                   selectedNotification?.type === "catalog" ? "Catalogue" : "Système"}
                </Badge>
              </div>
              
              {selectedNotification?.action && (
                <Button
                  onClick={() => {
                    handleAction(selectedNotification)
                    setSelectedNotification(null)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les détails
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}