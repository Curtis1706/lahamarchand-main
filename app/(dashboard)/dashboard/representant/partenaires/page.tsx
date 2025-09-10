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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, MapPin, Phone, Building2, Users, TrendingUp, Calendar, Eye, Edit, FileText } from "lucide-react"

export default function PartenairesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for partners
  const partners = [
    {
      id: "PART-2024-001",
      name: "Librairie Centrale Libreville",
      type: "Librairie",
      city: "Libreville",
      address: "Avenue de l'Indépendance, Quartier Louis",
      phone: "+241 01 23 45 67",
      email: "contact@librairie-centrale.ga",
      manager: "Marie Nzamba",
      status: "Actif",
      creationDate: "2024-01-15",
      lastOrder: "2024-01-28",
      totalOrders: 45,
      totalValue: 12500000,
      commission: 1250000,
      stockAllocated: 2500,
    },
    {
      id: "PART-2024-002",
      name: "Éditions Gabonaises",
      type: "Distributeur",
      city: "Port-Gentil",
      address: "Zone Industrielle, BP 1234",
      phone: "+241 05 67 89 01",
      email: "commercial@editions-ga.com",
      manager: "Pierre Akendengue",
      status: "Actif",
      creationDate: "2024-01-10",
      lastOrder: "2024-01-25",
      totalOrders: 28,
      totalValue: 8900000,
      commission: 890000,
      stockAllocated: 1800,
    },
    {
      id: "PART-2024-003",
      name: "Papeterie Scolaire Franceville",
      type: "Point de Vente",
      city: "Franceville",
      address: "Marché Central, Stand 15",
      phone: "+241 02 34 56 78",
      email: "papeterie.franceville@gmail.com",
      manager: "Sylvie Mba",
      status: "Suspendu",
      creationDate: "2023-12-20",
      lastOrder: "2024-01-05",
      totalOrders: 12,
      totalValue: 3200000,
      commission: 320000,
      stockAllocated: 500,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "Suspendu":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>
      case "En Attente":
        return <Badge variant="secondary">En Attente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Librairie":
        return <Badge className="bg-blue-100 text-blue-800">Librairie</Badge>
      case "Distributeur":
        return <Badge className="bg-purple-100 text-purple-800">Distributeur</Badge>
      case "Point de Vente":
        return <Badge className="bg-orange-100 text-orange-800">Point de Vente</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || partner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Partenaires</h1>
          <p className="text-muted-foreground">Création et suivi de vos partenaires commerciaux</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Partenaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un Nouveau Partenaire</DialogTitle>
                <DialogDescription>Ajouter un nouveau partenaire commercial à votre réseau</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner-name">Nom du Partenaire *</Label>
                    <Input id="partner-name" placeholder="Nom complet de l'établissement" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-type">Type de Partenaire</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="librairie">Librairie</SelectItem>
                        <SelectItem value="distributeur">Distributeur</SelectItem>
                        <SelectItem value="point-vente">Point de Vente</SelectItem>
                        <SelectItem value="ecole">École/Institution</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="libreville">Libreville</SelectItem>
                        <SelectItem value="port-gentil">Port-Gentil</SelectItem>
                        <SelectItem value="franceville">Franceville</SelectItem>
                        <SelectItem value="oyem">Oyem</SelectItem>
                        <SelectItem value="moanda">Moanda</SelectItem>
                        <SelectItem value="lambarene">Lambaréné</SelectItem>
                        <SelectItem value="autre">Autre ville</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Responsable *</Label>
                    <Input id="manager" placeholder="Nom du responsable" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse Complète *</Label>
                  <Textarea id="address" placeholder="Adresse complète avec quartier, BP..." rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input id="phone" placeholder="+241 XX XX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contact@partenaire.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commission">Taux de Commission (%)</Label>
                    <Input id="commission" type="number" placeholder="10" min="0" max="50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credit-limit">Limite de Crédit (FCFA)</Label>
                    <Input id="credit-limit" type="number" placeholder="1000000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes & Commentaires</Label>
                  <Textarea id="notes" placeholder="Informations additionnelles..." rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Créer le Partenaire</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partenaires Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2M FCFA</div>
            <p className="text-xs text-muted-foreground">Via partenaires</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions Versées</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5M FCFA</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes en Cours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="partners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
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
                      placeholder="Rechercher par nom, ville, responsable..."
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
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Suspendu">Suspendu</SelectItem>
                    <SelectItem value="En Attente">En Attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Partners Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Partenaires</CardTitle>
              <CardDescription>Gestion complète de votre réseau de partenaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partenaire</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Commandes</TableHead>
                      <TableHead>CA Total</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{partner.name}</div>
                            <div className="text-sm text-muted-foreground">{partner.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(partner.type)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{partner.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{partner.phone}</span>
                            </div>
                            <div className="text-sm font-medium">{partner.manager}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(partner.status)}</TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-semibold">{partner.totalOrders}</div>
                            <div className="text-xs text-muted-foreground">commandes</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{partner.totalValue.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-600">{partner.commission.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Partenaires par CA</CardTitle>
                <CardDescription>Classement des meilleurs partenaires ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partners
                    .sort((a, b) => b.totalValue - a.totalValue)
                    .slice(0, 5)
                    .map((partner, index) => (
                      <div key={partner.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium">{partner.name}</div>
                            <div className="text-sm text-muted-foreground">{partner.city}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{partner.totalValue.toLocaleString()} FCFA</div>
                          <div className="text-sm text-muted-foreground">{partner.totalOrders} commandes</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
                <CardDescription>Distribution des partenaires par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Librairies</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">12</div>
                      <div className="text-sm text-muted-foreground">50%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span>Distributeurs</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">8</div>
                      <div className="text-sm text-muted-foreground">33%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span>Points de Vente</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">4</div>
                      <div className="text-sm text-muted-foreground">17%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
