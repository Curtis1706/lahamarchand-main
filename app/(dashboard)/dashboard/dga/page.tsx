"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Building2,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react"

export default function DGAPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedGrossiste, setSelectedGrossiste] = useState<any>(null)

  // Mock data for grossistes
  const grossistes = [
    {
      id: 1,
      nom: "Librairie Centrale du Bénin",
      type: "Grossiste",
      ville: "Cotonou",
      quartier: "Centre-ville",
      directeur: "M. Jean Akendengue",
      telephone: "+229 21 23 45 67",
      email: "direction@librairie-centrale-bj.com",
      statut: "actif",
      dateCreation: "2024-01-15",
      commandesTotal: 25,
      montantTotal: 2500000,
      solde: 150000,
      derniereCommande: "2024-01-25",
      grilleTarifaire: "DGA",
    },
    {
      id: 2,
      nom: "Distributeur Éducatif Ouest",
      type: "Distributeur",
      ville: "Porto-Novo",
      quartier: "Quartier Administratif",
      directeur: "Mme. Marie Obame",
      telephone: "+229 20 12 34 56",
      email: "contact@distributeur-ouest.bj",
      statut: "actif",
      dateCreation: "2024-01-10",
      commandesTotal: 18,
      montantTotal: 1800000,
      solde: 75000,
      derniereCommande: "2024-01-22",
      grilleTarifaire: "DGA",
    },
    {
      id: 3,
      nom: "Librairie Universitaire",
      type: "Librairie",
      ville: "Abomey-Calavi",
      quartier: "Campus Universitaire",
      directeur: "Dr. Paul Nguema",
      telephone: "+229 21 34 56 78",
      email: "direction@librairie-universitaire.bj",
      statut: "en_attente",
      dateCreation: "2024-01-28",
      commandesTotal: 0,
      montantTotal: 0,
      solde: 0,
      derniereCommande: null,
      grilleTarifaire: "DGA",
    },
    {
      id: 4,
      nom: "Centre de Distribution Nord",
      type: "Grossiste",
      ville: "Parakou",
      quartier: "Zone Industrielle",
      directeur: "M. Pierre Mba",
      telephone: "+229 23 45 67 89",
      email: "contact@centre-distribution-nord.bj",
      statut: "suspendu",
      dateCreation: "2023-12-20",
      commandesTotal: 12,
      montantTotal: 1200000,
      solde: -25000,
      derniereCommande: "2024-01-10",
      grilleTarifaire: "DGA",
    },
  ]

  const grilleTarifaireDGA = [
    { type: "primaire", prix: 12000, description: "Livres primaires" },
    { type: "secondaire", prix: 18000, description: "Livres secondaires" },
    { type: "universitaire", prix: 25000, description: "Livres universitaires" },
    { type: "specialise", prix: 30000, description: "Livres spécialisés" },
  ]

  const commandesGrossistes = [
    {
      id: "CMD-GROSS-001",
      grossiste: "Librairie Centrale du Bénin",
      date: "2024-01-25",
      articles: 50,
      montant: 450000,
      statut: "validee",
      livraison: "2024-02-05",
    },
    {
      id: "CMD-GROSS-002",
      grossiste: "Distributeur Éducatif Ouest",
      date: "2024-01-22",
      articles: 35,
      montant: 320000,
      statut: "en_preparation",
      livraison: "2024-02-01",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "en_attente":
        return <Badge className="bg-amber-100 text-amber-800">En Attente</Badge>
      case "suspendu":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Grossiste":
        return <Building2 className="h-4 w-4" />
      case "Distributeur":
        return <Users className="h-4 w-4" />
      case "Librairie":
        return <FileText className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const filteredGrossistes = grossistes.filter((grossiste) => {
    const matchesSearch = grossiste.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grossiste.directeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grossiste.ville.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || grossiste.statut === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalGrossistes = grossistes.length
  const grossistesActifs = grossistes.filter(g => g.statut === "actif").length
  const totalCommandes = grossistes.reduce((sum, g) => sum + g.commandesTotal, 0)
  const chiffreAffaires = grossistes.reduce((sum, g) => sum + g.montantTotal, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion DGA</h1>
          <p className="text-muted-foreground">Gérez les grossistes et librairies du Gabon</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Grossiste
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Compte Grossiste</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau grossiste ou librairie au réseau DGA
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de l'Établissement *</Label>
                  <Input id="nom" placeholder="Ex: Librairie Centrale du Bénin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grossiste">Grossiste</SelectItem>
                      <SelectItem value="distributeur">Distributeur</SelectItem>
                      <SelectItem value="librairie">Librairie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville *</Label>
                  <Input id="ville" placeholder="Ex: Cotonou" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quartier">Quartier *</Label>
                  <Input id="quartier" placeholder="Ex: Centre-ville" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="directeur">Nom du Directeur *</Label>
                <Input id="directeur" placeholder="Ex: M. Jean Akendengue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input id="telephone" placeholder="+229 XX XX XX XX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contact@etablissement.bj" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse Complète</Label>
                <Textarea id="adresse" placeholder="Adresse détaillée de l'établissement" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Créer le Compte
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grossistes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGrossistes}</div>
            <p className="text-xs text-muted-foreground">Sous gestion DGA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{grossistesActifs}</div>
            <p className="text-xs text-muted-foreground">Comptes actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCommandes}</div>
            <p className="text-xs text-muted-foreground">Commandes passées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chiffreAffaires.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Total généré</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grossistes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grossistes">Grossistes ({totalGrossistes})</TabsTrigger>
          <TabsTrigger value="commandes">Commandes ({commandesGrossistes.length})</TabsTrigger>
          <TabsTrigger value="tarifs">Grille Tarifaire</TabsTrigger>
        </TabsList>

        <TabsContent value="grossistes" className="space-y-4">
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
                      placeholder="Rechercher par nom, directeur, ville..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tous statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="en_attente">En Attente</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Grossistes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Grossistes</CardTitle>
              <CardDescription>Gérez les comptes des grossistes et librairies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Établissement</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Directeur</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Commandes</TableHead>
                      <TableHead>Chiffre d'Affaires</TableHead>
                      <TableHead>Solde</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrossistes.map((grossiste) => (
                      <TableRow key={grossiste.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getTypeIcon(grossiste.type)}
                            <div>
                              <div className="font-medium">{grossiste.nom}</div>
                              <div className="text-sm text-muted-foreground">
                                Créé le {new Date(grossiste.dateCreation).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{grossiste.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{grossiste.directeur}</div>
                            <div className="text-sm text-muted-foreground">{grossiste.telephone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {grossiste.ville}, {grossiste.quartier}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(grossiste.statut)}</TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-semibold">{grossiste.commandesTotal}</div>
                            <div className="text-xs text-muted-foreground">
                              {grossiste.derniereCommande ? `Dernière: ${new Date(grossiste.derniereCommande).toLocaleDateString("fr-FR")}` : "Aucune"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{grossiste.montantTotal.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-semibold ${grossiste.solde >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {grossiste.solde.toLocaleString()} FCFA
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedGrossiste(grossiste)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Détails du Grossiste</DialogTitle>
                                  <DialogDescription>Informations complètes de {grossiste.nom}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Nom de l'Établissement</Label>
                                      <p className="text-sm">{grossiste.nom}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Type</Label>
                                      <p className="text-sm">{grossiste.type}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Directeur</Label>
                                      <p className="text-sm">{grossiste.directeur}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Téléphone</Label>
                                      <p className="text-sm">{grossiste.telephone}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm">{grossiste.email}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Localisation</Label>
                                    <p className="text-sm">{grossiste.ville}, {grossiste.quartier}</p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Statut</Label>
                                      <div className="mt-1">{getStatusBadge(grossiste.statut)}</div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Commandes</Label>
                                      <p className="text-sm font-semibold">{grossiste.commandesTotal}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Chiffre d'Affaires</Label>
                                      <p className="text-sm font-semibold">{grossiste.montantTotal.toLocaleString()} FCFA</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
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

        <TabsContent value="commandes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commandes des Grossistes</CardTitle>
              <CardDescription>Suivi des commandes passées par les grossistes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Commande</TableHead>
                      <TableHead>Grossiste</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Livraison</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commandesGrossistes.map((commande) => (
                      <TableRow key={commande.id}>
                        <TableCell className="font-mono text-sm">{commande.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{commande.grossiste}</div>
                        </TableCell>
                        <TableCell>{new Date(commande.date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-semibold">{commande.articles}</div>
                            <div className="text-xs text-muted-foreground">articles</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{commande.montant.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={commande.statut === "validee" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                            {commande.statut === "validee" ? "Validée" : "En Préparation"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(commande.livraison).toLocaleDateString("fr-FR")}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
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

        <TabsContent value="tarifs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grille Tarifaire DGA</CardTitle>
              <CardDescription>Tarifs spécifiques pour les grossistes et librairies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grilleTarifaireDGA.map((tarif) => (
                  <div key={tarif.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tarif.description}</div>
                        <div className="text-sm text-muted-foreground">Type: {tarif.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{tarif.prix.toLocaleString()} FCFA</div>
                      <div className="text-sm text-muted-foreground">Prix unitaire</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Information :</strong> La DGA dispose d'une grille tarifaire spécifique pour les grossistes 
              et librairies du Bénin. Cette grille est différente des tarifs appliqués aux écoles. 
              La DGA ne peut pas vendre aux écoles directement.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
