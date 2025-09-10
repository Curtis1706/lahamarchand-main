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
import {
  Search,
  Plus,
  School,
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
  GraduationCap,
} from "lucide-react"

export default function EcolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEcole, setSelectedEcole] = useState<any>(null)

  // Mock data for schools
  const ecoles = [
    {
      id: 1,
      nom: "Lycée Léon Mba",
      type: "Lycée",
      ville: "Libreville",
      quartier: "Montagne Sainte",
      directeur: "Dr. Jean Obame",
      telephone: "+241 01 23 45 67",
      email: "direction@lycee-leon-mba.ga",
      statut: "actif",
      dateCreation: "2024-01-15",
      commandesTotal: 12,
      montantTotal: 1250000,
      solde: 45000,
      derniereCommande: "2024-01-20",
    },
    {
      id: 2,
      nom: "École Publique de l'Indépendance",
      type: "École Primaire",
      ville: "Libreville",
      quartier: "Quartier Louis",
      directeur: "Mme. Marie Nzamba",
      telephone: "+241 01 23 45 68",
      email: "direction@epi-libreville.ga",
      statut: "actif",
      dateCreation: "2024-01-10",
      commandesTotal: 8,
      montantTotal: 890000,
      solde: 12000,
      derniereCommande: "2024-01-18",
    },
    {
      id: 3,
      nom: "Collège Saint-Gabriel",
      type: "Collège",
      ville: "Port-Gentil",
      quartier: "Zone Industrielle",
      directeur: "Père Michel Nguema",
      telephone: "+241 02 34 56 78",
      email: "direction@college-saint-gabriel.ga",
      statut: "en_attente",
      dateCreation: "2024-01-25",
      commandesTotal: 0,
      montantTotal: 0,
      solde: 0,
      derniereCommande: null,
    },
    {
      id: 4,
      nom: "École Privée Les Poussins",
      type: "École Maternelle",
      ville: "Franceville",
      quartier: "Centre-ville",
      directeur: "Mme. Sophie Mba",
      telephone: "+241 03 45 67 89",
      email: "direction@poussins-franceville.ga",
      statut: "suspendu",
      dateCreation: "2023-12-20",
      commandesTotal: 5,
      montantTotal: 320000,
      solde: -5000,
      derniereCommande: "2024-01-05",
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
      case "Lycée":
        return <GraduationCap className="h-4 w-4" />
      case "Collège":
        return <School className="h-4 w-4" />
      case "École Primaire":
        return <School className="h-4 w-4" />
      case "École Maternelle":
        return <School className="h-4 w-4" />
      default:
        return <School className="h-4 w-4" />
    }
  }

  const filteredEcoles = ecoles.filter((ecole) => {
    const matchesSearch = ecole.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ecole.directeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ecole.ville.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || ecole.statut === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalEcoles = ecoles.length
  const ecolesActifs = ecoles.filter(e => e.statut === "actif").length
  const totalCommandes = ecoles.reduce((sum, e) => sum + e.commandesTotal, 0)
  const chiffreAffaires = ecoles.reduce((sum, e) => sum + e.montantTotal, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Écoles</h1>
          <p className="text-muted-foreground">Créez et gérez les comptes des écoles sous votre responsabilité</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle École
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Compte École</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle école à votre réseau de distribution
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de l'École *</Label>
                  <Input id="nom" placeholder="Ex: Lycée Léon Mba" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'École *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maternelle">École Maternelle</SelectItem>
                      <SelectItem value="primaire">École Primaire</SelectItem>
                      <SelectItem value="college">Collège</SelectItem>
                      <SelectItem value="lycee">Lycée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville *</Label>
                  <Input id="ville" placeholder="Ex: Libreville" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quartier">Quartier *</Label>
                  <Input id="quartier" placeholder="Ex: Montagne Sainte" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="directeur">Nom du Directeur *</Label>
                <Input id="directeur" placeholder="Ex: Dr. Jean Obame" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input id="telephone" placeholder="+241 XX XX XX XX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="direction@ecole.ga" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse Complète</Label>
                <Textarea id="adresse" placeholder="Adresse détaillée de l'école" />
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
            <CardTitle className="text-sm font-medium">Total Écoles</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEcoles}</div>
            <p className="text-xs text-muted-foreground">Sous votre responsabilité</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Écoles Actives</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ecolesActifs}</div>
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
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chiffreAffaires.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Total généré</p>
          </CardContent>
        </Card>
      </div>

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

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Écoles</CardTitle>
          <CardDescription>Gérez les comptes des écoles de votre réseau</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>École</TableHead>
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
                {filteredEcoles.map((ecole) => (
                  <TableRow key={ecole.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getTypeIcon(ecole.type)}
                        <div>
                          <div className="font-medium">{ecole.nom}</div>
                          <div className="text-sm text-muted-foreground">
                            Créé le {new Date(ecole.dateCreation).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ecole.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ecole.directeur}</div>
                        <div className="text-sm text-muted-foreground">{ecole.telephone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {ecole.ville}, {ecole.quartier}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ecole.statut)}</TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-semibold">{ecole.commandesTotal}</div>
                        <div className="text-xs text-muted-foreground">
                          {ecole.derniereCommande ? `Dernière: ${new Date(ecole.derniereCommande).toLocaleDateString("fr-FR")}` : "Aucune"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{ecole.montantTotal.toLocaleString()} FCFA</div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-semibold ${ecole.solde >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {ecole.solde.toLocaleString()} FCFA
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedEcole(ecole)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de l'École</DialogTitle>
                              <DialogDescription>Informations complètes de {ecole.nom}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Nom de l'École</Label>
                                  <p className="text-sm">{ecole.nom}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Type</Label>
                                  <p className="text-sm">{ecole.type}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Directeur</Label>
                                  <p className="text-sm">{ecole.directeur}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Téléphone</Label>
                                  <p className="text-sm">{ecole.telephone}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <p className="text-sm">{ecole.email}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Localisation</Label>
                                <p className="text-sm">{ecole.ville}, {ecole.quartier}</p>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Statut</Label>
                                  <div className="mt-1">{getStatusBadge(ecole.statut)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Commandes</Label>
                                  <p className="text-sm font-semibold">{ecole.commandesTotal}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Chiffre d'Affaires</Label>
                                  <p className="text-sm font-semibold">{ecole.montantTotal.toLocaleString()} FCFA</p>
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

      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important :</strong> Les partenaires sont exclusivement autorisés à vendre aux écoles. 
          Vous ne pouvez pas vendre aux grossistes ou aux librairies. Toute commande doit être validée 
          par un responsable interne avant traitement.
        </AlertDescription>
      </Alert>
    </div>
  )
}
