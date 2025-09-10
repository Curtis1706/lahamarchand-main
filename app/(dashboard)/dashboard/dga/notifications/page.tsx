"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  Building2,
  ShoppingCart,
  FileText,
  Trash2,
  CheckCheck,
  DollarSign,
  Users,
  Settings,
} from "lucide-react"

export default function NotificationsDGAPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      title: "Nouveau grossiste en attente",
      message: "Librairie du Plateau souhaite rejoindre le réseau DGA et attend validation",
      type: "grossiste",
      priority: "high",
      date: "2024-01-28T10:30:00Z",
      read: false,
      action: "Examiner la demande",
      actionUrl: "/dashboard/dga/grossistes",
    },
    {
      id: 2,
      title: "Commande urgente reçue",
      message: "Librairie Centrale du Bénin a passé une commande urgente de 450,000 FCFA",
      type: "commande",
      priority: "high",
      date: "2024-01-28T09:15:00Z",
      read: false,
      action: "Traiter la commande",
      actionUrl: "/dashboard/dga/commandes-grossistes",
    },
    {
      id: 3,
      title: "Modification de grille tarifaire",
      message: "Mise à jour des tarifs pour les livres primaires (+20% à partir du 1er février)",
      type: "tarif",
      priority: "medium",
      date: "2024-01-27T16:45:00Z",
      read: true,
      action: "Voir les détails",
      actionUrl: "/dashboard/dga/grille-tarifaire",
    },
    {
      id: 4,
      title: "Rapport mensuel disponible",
      message: "Votre rapport de performance de janvier est prêt avec les statistiques détaillées",
      type: "rapport",
      priority: "low",
      date: "2024-01-27T14:20:00Z",
      read: true,
      action: "Consulter le rapport",
      actionUrl: "/dashboard/dga/statistiques",
    },
    {
      id: 5,
      title: "Livraison effectuée",
      message: "La livraison pour la commande CMD-GROSS-001 a été effectuée avec succès",
      type: "livraison",
      priority: "low",
      date: "2024-01-26T11:30:00Z",
      read: true,
      action: "Voir les détails",
      actionUrl: "/dashboard/dga/commandes-grossistes",
    },
    {
      id: 6,
      title: "Nouveau grossiste validé",
      message: "Centre de Distribution Nord a été validé et ajouté au réseau DGA",
      type: "grossiste",
      priority: "medium",
      date: "2024-01-25T15:20:00Z",
      read: true,
      action: "Voir le profil",
      actionUrl: "/dashboard/dga/grossistes",
    },
    {
      id: 7,
      title: "Alerte stock faible",
      message: "Le stock de 'Mathématiques Appliquées' est en dessous du seuil minimum",
      type: "stock",
      priority: "high",
      date: "2024-01-25T08:45:00Z",
      read: false,
      action: "Vérifier le stock",
      actionUrl: "/dashboard/dga/stock",
    },
    {
      id: 8,
      title: "Formation en ligne disponible",
      message: "Nouvelle session de formation sur la gestion des grossistes et librairies",
      type: "formation",
      priority: "low",
      date: "2024-01-24T14:00:00Z",
      read: true,
      action: "S'inscrire",
      actionUrl: "#",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "grossiste":
        return <Building2 className="h-4 w-4" />
      case "commande":
        return <ShoppingCart className="h-4 w-4" />
      case "tarif":
        return <DollarSign className="h-4 w-4" />
      case "rapport":
        return <FileText className="h-4 w-4" />
      case "livraison":
        return <CheckCircle className="h-4 w-4" />
      case "stock":
        return <AlertTriangle className="h-4 w-4" />
      case "formation":
        return <Info className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const types = {
      grossiste: { label: "Grossiste", variant: "default" as const },
      commande: { label: "Commande", variant: "secondary" as const },
      tarif: { label: "Tarif", variant: "outline" as const },
      rapport: { label: "Rapport", variant: "secondary" as const },
      livraison: { label: "Livraison", variant: "outline" as const },
      stock: { label: "Stock", variant: "destructive" as const },
      formation: { label: "Formation", variant: "outline" as const },
    }
    const typeInfo = types[type as keyof typeof types] || { label: type, variant: "outline" as const }
    return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
  }

  const getPrioriteBadge = (priorite: string) => {
    switch (priorite) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-800">Moyen</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Faible</Badge>
      default:
        return <Badge variant="outline">{priorite}</Badge>
    }
  }

  const marquerCommeLue = (id: number) => {
    // In a real app, this would update the notification status
    console.log(`Marquer notification ${id} comme lue`)
  }

  const supprimerNotification = (id: number) => {
    // In a real app, this would delete the notification
    console.log(`Supprimer notification ${id}`)
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority
    return matchesSearch && matchesType && matchesPriority
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications DGA</h1>
          <p className="text-muted-foreground">Gérez vos notifications et alertes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CheckCheck className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Notifications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non lues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter(n => n.priority === "high" && !n.read).length}
            </div>
            <p className="text-xs text-muted-foreground">Action requise</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grossistes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === "grossiste" && !n.read).length}
            </div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
          <TabsTrigger value="urgent">Urgentes ({notifications.filter(n => n.priority === "high" && !n.read).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans les notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tous types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="grossiste">Grossistes</SelectItem>
                    <SelectItem value="commande">Commandes</SelectItem>
                    <SelectItem value="tarif">Tarifs</SelectItem>
                    <SelectItem value="rapport">Rapports</SelectItem>
                    <SelectItem value="livraison">Livraisons</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="formation">Formations</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Toutes priorités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} className={!notification.read ? "border-l-4 border-l-blue-500" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">Nouveau</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 mb-3">
                          {getTypeBadge(notification.type)}
                          {getPrioriteBadge(notification.priority)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.date).toLocaleString("fr-FR")}
                          </span>
                        </div>
                        {notification.action && (
                          <Button size="sm" variant="outline">
                            {notification.action}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => marquerCommeLue(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <div className="space-y-4">
            {filteredNotifications
              .filter(n => !n.read)
              .map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{notification.title}</h3>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">Nouveau</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-2 mb-3">
                            {getTypeBadge(notification.type)}
                            {getPrioriteBadge(notification.priority)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.date).toLocaleString("fr-FR")}
                            </span>
                          </div>
                          {notification.action && (
                            <Button size="sm" variant="outline">
                              {notification.action}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => marquerCommeLue(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => supprimerNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="urgent" className="space-y-4">
          <div className="space-y-4">
            {filteredNotifications
              .filter(n => n.priority === "high" && !n.read)
              .map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{notification.title}</h3>
                            <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-2 mb-3">
                            {getTypeBadge(notification.type)}
                            {getPrioriteBadge(notification.priority)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.date).toLocaleString("fr-FR")}
                            </span>
                          </div>
                          {notification.action && (
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              {notification.action}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => marquerCommeLue(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => supprimerNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Information :</strong> Ces notifications concernent exclusivement les grossistes et librairies 
          gérés par la DGA. La DGA ne peut pas vendre aux écoles directement. Tous les grossistes sont 
          obligatoirement rattachés à son compte et disposent d'une grille tarifaire spécifique.
        </AlertDescription>
      </Alert>
    </div>
  )
}
