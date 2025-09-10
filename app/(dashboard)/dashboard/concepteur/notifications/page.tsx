"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Users,
  RefreshCw,
  Eye,
  AlertCircle,
  Calendar,
  DollarSign
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  time: string
  urgent: boolean
  icon: string
  date: string
}

interface NotificationsResponse {
  notifications: Notification[]
  summary: {
    total: number
    unread: number
    urgent: number
    byType: {
      sales: number
      validation: number
      creation: number
      performance: number
      publication: number
      collaboration: number
    }
  }
  user: {
    name: string
    email: string
    role: string
  }
}

export default function ConcepteurNotificationsPage() {
  const [notificationsData, setNotificationsData] = useState<NotificationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [typeFilter, setTypeFilter] = useState("all")

  const fetchNotificationsData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/concepteur/notifications", {
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
      
      const data = await response.json()
      setNotificationsData(data)
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
    fetchNotificationsData()
  }, [])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy à HH:mm", { locale: fr })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "validation":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "creation":
        return <BookOpen className="h-4 w-4 text-blue-600" />
      case "performance":
        return <DollarSign className="h-4 w-4 text-purple-600" />
      case "publication":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "collaboration":
        return <Users className="h-4 w-4 text-indigo-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "sales":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">Ventes</Badge>
      case "validation":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">Validation</Badge>
      case "creation":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">Création</Badge>
      case "performance":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">Performance</Badge>
      case "publication":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">Publication</Badge>
      case "collaboration":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800">Collaboration</Badge>
      default:
        return <Badge variant="outline">Autre</Badge>
    }
  }

  // Filtrer les notifications
  const filteredNotifications = notificationsData?.notifications.filter(notification => {
    return typeFilter === "all" || notification.type === typeFilter
  }) || []

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !notificationsData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: {error || 'Données non disponibles'}</p>
        <Button onClick={fetchNotificationsData} className="mt-4" disabled={refreshing}>
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Notifications</h1>
          <p className="text-muted-foreground">Suivez l'évolution de vos œuvres et leurs performances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/concepteur'}>
            <Eye className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/concepteur/oeuvres'}>
            <BookOpen className="mr-2 h-4 w-4" />
            Mes œuvres
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationsData.summary.total}</div>
            <p className="text-xs text-muted-foreground">notifications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non lues</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{notificationsData.summary.unread}</div>
            <p className="text-xs text-muted-foreground">à consulter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{notificationsData.summary.urgent}</div>
            <p className="text-xs text-muted-foreground">prioritaires</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{notificationsData.summary.byType.sales}</div>
            <p className="text-xs text-muted-foreground">nouvelles ventes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="sales">Ventes</SelectItem>
              <SelectItem value="validation">Validation</SelectItem>
              <SelectItem value="creation">Création</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="publication">Publication</SelectItem>
              <SelectItem value="collaboration">Collaboration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={fetchNotificationsData} disabled={refreshing}>
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

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune notification trouvée</p>
              <p className="text-sm text-muted-foreground mt-2">
                Les notifications apparaîtront ici quand vous aurez des activités sur vos œuvres.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`hover:shadow-md transition-shadow ${notification.urgent ? 'border-l-4 border-l-red-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{notification.title}</h3>
                      {getTypeBadge(notification.type)}
                      {notification.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground">{notification.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{notification.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{formatDate(notification.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="text-2xl">{notification.icon}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Répartition par Type
          </CardTitle>
          <CardDescription>Vue d'ensemble des notifications par catégorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{notificationsData.summary.byType.sales}</div>
              <div className="text-xs text-muted-foreground">Ventes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{notificationsData.summary.byType.validation}</div>
              <div className="text-xs text-muted-foreground">Validation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notificationsData.summary.byType.creation}</div>
              <div className="text-xs text-muted-foreground">Création</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{notificationsData.summary.byType.performance}</div>
              <div className="text-xs text-muted-foreground">Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{notificationsData.summary.byType.publication}</div>
              <div className="text-xs text-muted-foreground">Publication</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{notificationsData.summary.byType.collaboration}</div>
              <div className="text-xs text-muted-foreground">Collaboration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}