"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Plus,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertTriangle,
  Eye,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react"

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  // Mock data for orders - accessible to all roles with different permissions
  const orders = [
    {
      id: "CMD-2024-001",
      client: "Marie Nzamba",
      clientType: "Client Particulier",
      date: "2024-01-28",
      status: "Livrée",
      items: 3,
      totalValue: 75000,
      deliveryAddress: "Libreville, Quartier Louis",
      paymentMethod: "Espèces",
      deliveryDate: "2024-01-30",
      representative: "Jean Akendengue",
      canModify: false, // Only PDG can modify
    },
    {
      id: "CMD-2024-002",
      client: "Librairie Centrale",
      clientType: "Partenaire",
      date: "2024-01-25",
      status: "En Attente Validation PDG",
      items: 15,
      totalValue: 850000,
      deliveryAddress: "Libreville, Avenue de l'Indépendance",
      paymentMethod: "Crédit 30j",
      deliveryDate: "2024-02-05",
      representative: "Jean Akendengue",
      canModify: true, // PDG can validate/reject
    },
    {
      id: "CMD-2024-003",
      client: "Université des Sciences",
      clientType: "Institution",
      date: "2024-01-20",
      status: "En Préparation",
      items: 50,
      totalValue: 1250000,
      deliveryAddress: "Franceville, Campus Universitaire",
      paymentMethod: "Bon de Commande",
      deliveryDate: "2024-02-10",
      representative: "Marie Obame",
      canModify: true,
    },
    {
      id: "CMD-2024-004",
      client: "Invité - Commande Express",
      clientType: "Client Invité",
      date: "2024-01-27",
      status: "Confirmée",
      items: 2,
      totalValue: 56000,
      deliveryAddress: "Port-Gentil, Zone Résidentielle",
      paymentMethod: "Mobile Money",
      deliveryDate: "2024-01-29",
      representative: "Système",
      canModify: false,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Livrée":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Livrée
          </Badge>
        )
      case "En Préparation":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Package className="w-3 h-3 mr-1" />
            En Préparation
          </Badge>
        )
      case "Confirmée":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmée
          </Badge>
        )
      case "En Attente Validation PDG":
        return (
          <Badge className="bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1" />
            Attente PDG
          </Badge>
        )
      case "Expédiée":
        return (
          <Badge className="bg-indigo-100 text-indigo-800">
            <Truck className="w-3 h-3 mr-1" />
            Expédiée
          </Badge>
        )
      case "Annulée":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Annulée
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getClientTypeBadge = (type: string) => {
    switch (type) {
      case "Client Particulier":
        return <Badge variant="outline">Particulier</Badge>
      case "Partenaire":
        return <Badge className="bg-blue-100 text-blue-800">Partenaire</Badge>
      case "Institution":
        return <Badge className="bg-purple-100 text-purple-800">Institution</Badge>
      case "Client Invité":
        return <Badge className="bg-gray-100 text-gray-800">Invité</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.representative.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesRole = roleFilter === "all" || order.clientType === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  // Mock user role - this would come from authentication context
  const userRole = "PDG" // Could be: PDG, Représentant, Partenaire, Client, etc.

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Commandes</h1>
          <p className="text-muted-foreground">Suivi et traitement de toutes les commandes</p>
        </div>
        <div className="flex gap-2">
          {(userRole === "PDG" || userRole === "Représentant") && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Commande
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Créer une Nouvelle Commande</DialogTitle>
                  <DialogDescription>Saisir une commande pour un client ou partenaire</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-type">Type de Client *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="particulier">Client Particulier</SelectItem>
                          <SelectItem value="partenaire">Partenaire</SelectItem>
                          <SelectItem value="institution">Institution</SelectItem>
                          <SelectItem value="invite">Client Invité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client">Client/Partenaire *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marie">Marie Nzamba</SelectItem>
                          <SelectItem value="librairie">Librairie Centrale</SelectItem>
                          <SelectItem value="universite">Université des Sciences</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="delivery-date">Date de Livraison</Label>
                      <Input id="delivery-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Mode de Paiement</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="especes">Espèces</SelectItem>
                          <SelectItem value="mobile">Mobile Money</SelectItem>
                          <SelectItem value="virement">Virement Bancaire</SelectItem>
                          <SelectItem value="credit">Crédit (Partenaires)</SelectItem>
                          <SelectItem value="bon">Bon de Commande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Articles Commandés</Label>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter Article
                      </Button>
                    </div>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Article</TableHead>
                            <TableHead>Prix Unitaire</TableHead>
                            <TableHead>Quantité</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un article" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="math">Mathématiques Appliquées</SelectItem>
                                  <SelectItem value="physique">Introduction à la Physique</SelectItem>
                                  <SelectItem value="chimie">Chimie Organique</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input type="number" placeholder="25000" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" placeholder="1" />
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">25,000 FCFA</span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {userRole === "Représentant" && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Les commandes de partenaires nécessitent une validation PDG avant traitement.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit">Créer la Commande</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes ce Mois</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+18% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente Validation</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">12</div>
            <p className="text-xs text-muted-foreground">Validation PDG requise</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5M FCFA</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Avec commandes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Toutes les Commandes</TabsTrigger>
          {userRole === "PDG" && <TabsTrigger value="validation">À Valider</TabsTrigger>}
          <TabsTrigger value="tracking">Suivi Livraisons</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Recherche et Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par client, ID commande, représentant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tous statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="En Attente Validation PDG">Attente PDG</SelectItem>
                    <SelectItem value="Confirmée">Confirmée</SelectItem>
                    <SelectItem value="En Préparation">En Préparation</SelectItem>
                    <SelectItem value="Expédiée">Expédiée</SelectItem>
                    <SelectItem value="Livrée">Livrée</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tous types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="Client Particulier">Particuliers</SelectItem>
                    <SelectItem value="Partenaire">Partenaires</SelectItem>
                    <SelectItem value="Institution">Institutions</SelectItem>
                    <SelectItem value="Client Invité">Invités</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Commandes</CardTitle>
              <CardDescription>Suivi de toutes les commandes selon vos droits d'accès</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Commande</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Livraison</TableHead>
                      <TableHead>Représentant</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{order.client}</div>
                        </TableCell>
                        <TableCell>{getClientTypeBadge(order.clientType)}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-semibold">{order.items}</div>
                            <div className="text-xs text-muted-foreground">articles</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{order.totalValue.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell>{order.representative}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            {userRole === "PDG" && order.canModify && (
                              <Button variant="ghost" size="sm" className="text-green-600">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole === "PDG" && (
          <TabsContent value="validation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Commandes en Attente de Validation PDG
                </CardTitle>
                <CardDescription>Ces commandes nécessitent votre validation avant traitement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders
                    .filter((order) => order.status === "En Attente Validation PDG")
                    .map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-semibold">{order.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.client} - {getClientTypeBadge(order.clientType)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{order.totalValue.toLocaleString()} FCFA</div>
                            <div className="text-sm text-muted-foreground">{order.items} articles</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Commandé le {order.date}</span>
                            <span>Livraison: {order.deliveryDate}</span>
                            <span>Par: {order.representative}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </Button>
                            <Button size="sm" className="text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Valider
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Suivi des Livraisons
              </CardTitle>
              <CardDescription>État d'avancement des commandes en cours de traitement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders
                  .filter((order) => !["Livrée", "Annulée"].includes(order.status))
                  .map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{order.id}</div>
                          <div className="text-sm text-muted-foreground">{order.client}</div>
                        </div>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Livraison prévue: {order.deliveryDate}</span>
                        <span>{order.deliveryAddress}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
