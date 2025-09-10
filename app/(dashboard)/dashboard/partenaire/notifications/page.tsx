"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bell,
  CheckCircle,
  Clock,
  Package,
  Truck,
  AlertTriangle,
  ShoppingCart,
  Eye,
} from "lucide-react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  read: boolean
  createdAt: string
  data: {
    orderId: string
    total: number
    itemCount: number
  }
}

interface NotificationsData {
  notifications: Notification[]
  summary: {
    total: number
    unread: number
    highPriority: number
  }
}

export default function PartenaireNotifications() {
  const [notificationsData, setNotificationsData] = useState<NotificationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/partenaire/notifications')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des notifications')
      }
      
      const data: NotificationsData = await response.json()
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER_CREATED": return <ShoppingCart className="h-5 w-5 text-blue-600" />
      case "ORDER_VALIDATED": return <CheckCircle className="h-5 w-5 text-green-600" />
      case "ORDER_DELIVERED": return <Truck className="h-5 w-5 text-purple-600" />
      default: return <Bell className="h-5 w-5 text-gray-600" />
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
      case "high": return "Priorité élevée"
      case "medium": return "Priorité moyenne"
      case "low": return "Priorité faible"
      default: return priority
    }
  }

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/partenaire/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des notifications')
      }

      // Mettre à jour l'état local
      if (notificationsData) {
        const updatedNotifications = notificationsData.notifications.map(notification => {
          if (notificationIds.includes(notification.id)) {
            return { ...notification, read: true }
          }
          return notification
        })

        setNotificationsData({
          ...notificationsData,
          notifications: updatedNotifications,
          summary: {
            ...notificationsData.summary,
            unread: Math.max(0, notificationsData.summary.unread - notificationIds.length)
          }
        })
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err)
    }
  }

  const markAllAsRead = () => {
    const unreadIds = notificationsData?.notifications
      .filter(n => !n.read)
      .map(n => n.id) || []
    
    if (unreadIds.length > 0) {
      markAsRead(unreadIds)
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Notifications</h1>
          <p className="text-muted-foreground">Suivi de vos commandes et activités</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/partenaire/commandes'}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Mes commandes
          </Button>
          {notificationsData?.summary.unread > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Notifications</p>
                <p className="text-2xl font-bold">{notificationsData?.summary.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
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
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Priorité élevée</p>
                <p className="text-2xl font-bold">{notificationsData?.summary.highPriority || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications ({notificationsData?.notifications.length || 0})
          </CardTitle>
          <CardDescription>Historique de toutes vos notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {notificationsData?.notifications.length ? (
            <div className="space-y-4">
              {notificationsData.notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge variant={getPriorityBadgeVariant(notification.priority)}>
                            {getPriorityLabel(notification.priority)}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="default" className="bg-blue-600">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Commande #{notification.data.orderId.slice(-8)}</span>
                          <span>{notification.data.itemCount} article(s)</span>
                          <span>{notification.data.total.toLocaleString()} FCFA</span>
                          <span>{new Date(notification.createdAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markAsRead([notification.id])}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucune notification</p>
              <p className="text-sm text-muted-foreground">
                Vos notifications apparaîtront ici
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Types de notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Types de Notifications
          </CardTitle>
          <CardDescription>Les différents types de notifications que vous recevez</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Création de commande</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Notification envoyée lorsque vous créez une nouvelle commande
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Validation de commande</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Notification envoyée lorsque le PDG valide votre commande
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">Livraison</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Notification envoyée lorsque votre commande est livrée
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}