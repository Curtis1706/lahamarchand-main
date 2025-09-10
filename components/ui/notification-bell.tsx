"use client"

import { useState, useEffect } from "react"
import { Bell, Package, Truck, BookOpen, Settings, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

interface NotificationBellProps {
  role?: "client" | "auteur" | "concepteur" | "pdg" | "representant" | "partenaire" | "dga"
}

export function NotificationBell({ role = "client" }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      // Déterminer l'API à utiliser selon le rôle
      let apiEndpoint = "/api/client/notifications"
      if (role === "auteur") {
        apiEndpoint = "/api/author/notifications"
      } else if (role === "representant") {
        apiEndpoint = "/api/representant/notifications"
      }
      
      const response = await fetch(apiEndpoint)
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des notifications")
      }
      
      const data: NotificationsResponse = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.summary.unread)
      setError(null)
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      // Déterminer l'API à utiliser selon le rôle
      let apiEndpoint = "/api/client/notifications"
      if (role === "auteur") {
        apiEndpoint = "/api/author/notifications"
      } else if (role === "representant") {
        apiEndpoint = "/api/representant/notifications"
      }
      
      await fetch(apiEndpoint, {
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
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return <Package className="h-4 w-4 text-blue-600" />
      case "delivery": return <Truck className="h-4 w-4 text-green-600" />
      case "catalog": return <BookOpen className="h-4 w-4 text-purple-600" />
      case "system": return <Settings className="h-4 w-4 text-gray-600" />
      default: return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case "medium":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      default:
        return <CheckCircle className="h-3 w-3 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
      case "low":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20"
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Maintenant"
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInHours < 48) return "Hier"
    return format(new Date(date), "dd/MM", { locale: fr })
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    // Fermer le dropdown
    setIsOpen(false)
    
    // Rediriger selon l'action
    if (notification.action) {
      switch (notification.action.type) {
        case "view_order":
          window.location.href = "/dashboard/client/commandes"
          break
        case "view_work":
          window.location.href = "/dashboard/client/catalogue"
          break
        case "view_catalog":
          window.location.href = "/dashboard/client/catalogue"
          break
        default:
          break
      }
    }
  }

  const handleViewAll = () => {
    setIsOpen(false)
    // Rediriger vers la page des notifications
    if (role === "auteur") {
      window.location.href = "/dashboard/auteur/notifications"
    } else if (role === "representant") {
      window.location.href = "/dashboard/representant/notifications"
    } else {
      window.location.href = "/dashboard/client/notifications"
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-96 p-0 dark:bg-gray-900 dark:border-gray-800 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs px-2 py-1">
              {unreadCount} nouvelles
            </Badge>
          )}
        </div>
        
        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Chargement des notifications...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">Erreur de chargement</p>
              <p className="text-xs text-muted-foreground mt-1">Veuillez réessayer plus tard</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune notification</p>
              <p className="text-xs text-muted-foreground mt-1">Vous serez notifié des nouveaux événements</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.slice(0, 6).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-950/10" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        !notification.read 
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-300"}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        
                        {/* Time and Status */}
                        <div className="flex flex-col items-end space-y-1 ml-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getRelativeTime(notification.date)}
                          </span>
                          <div className="flex items-center space-x-1">
                            {getPriorityIcon(notification.priority)}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Type Badge */}
                      <div className="mt-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-0.5"
                        >
                          {notification.type === "order" ? "Commande" :
                           notification.type === "delivery" ? "Livraison" :
                           notification.type === "catalog" ? "Catalogue" : "Système"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {notifications.length > 6 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              onClick={handleViewAll}
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir toutes les notifications ({notifications.length})
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}