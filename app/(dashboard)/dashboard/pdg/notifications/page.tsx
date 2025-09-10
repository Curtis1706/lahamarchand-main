"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, AlertTriangle, Info, CheckCircle, X, Search, Filter } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Stock faible - Romans Jeunesse",
    message: "Le stock de romans jeunesse est en dessous du seuil critique (5 exemplaires restants)",
    time: "Il y a 2 heures",
    read: false,
    priority: "high",
  },
  {
    id: 2,
    type: "info",
    title: "Nouveau dépôt enregistré",
    message: "Librairie Centrale a enregistré un nouveau dépôt de 50 livres",
    time: "Il y a 4 heures",
    read: false,
    priority: "medium",
  },
  {
    id: 3,
    type: "success",
    title: "Validation concepteur approuvée",
    message: "Le compte de Marie Dubois (Concepteur Graphique) a été validé",
    time: "Il y a 1 jour",
    read: true,
    priority: "low",
  },
  {
    id: 4,
    type: "alert",
    title: "Paiement droits d'auteur en retard",
    message: "Le paiement des droits d'auteur pour Jean Mbongo est en retard de 5 jours",
    time: "Il y a 2 jours",
    read: false,
    priority: "high",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    case "info":
      return <Info className="h-4 w-4 text-primary" />
    case "success":
      return <CheckCircle className="h-4 w-4 text-success" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "warning"
    case "low":
      return "secondary"
    default:
      return "secondary"
  }
}

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority

    return matchesSearch && matchesType && matchesPriority
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Gérez vos notifications et alertes système</p>
        </div>
        <Badge variant="destructive" className="text-sm">
          {unreadCount} non lues
        </Badge>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher dans les notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="alert">Alertes</SelectItem>
                    <SelectItem value="info">Informations</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                    !notification.read ? "bg-muted/50 border-primary/20" : "bg-background"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                          {notification.priority === "high"
                            ? "Haute"
                            : notification.priority === "medium"
                              ? "Moyenne"
                              : "Basse"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {notifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-muted/50 border-primary/20"
                  >
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-foreground">{notification.title}</h3>
                        <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                          {notification.priority === "high"
                            ? "Haute"
                            : notification.priority === "medium"
                              ? "Moyenne"
                              : "Basse"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertes système</CardTitle>
              <CardDescription>Configurez les seuils d'alerte pour votre plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Stock faible</h4>
                    <p className="text-sm text-muted-foreground">
                      Alerte quand le stock descend en dessous de 10 exemplaires
                    </p>
                  </div>
                  <Input type="number" defaultValue="10" className="w-20" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Retard paiement droits</h4>
                    <p className="text-sm text-muted-foreground">Alerte après 3 jours de retard</p>
                  </div>
                  <Input type="number" defaultValue="3" className="w-20" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Validation en attente</h4>
                    <p className="text-sm text-muted-foreground">Alerte après 7 jours sans validation</p>
                  </div>
                  <Input type="number" defaultValue="7" className="w-20" />
                </div>
              </div>
              <Button className="w-full">Sauvegarder les paramètres</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>Configurez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications par email</h4>
                    <p className="text-sm text-muted-foreground">Recevoir les notifications importantes par email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications push</h4>
                    <p className="text-sm text-muted-foreground">Recevoir les notifications dans le navigateur</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Résumé quotidien</h4>
                    <p className="text-sm text-muted-foreground">Recevoir un résumé quotidien des activités</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Désactivé
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
