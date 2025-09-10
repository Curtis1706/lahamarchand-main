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
  Edit,
  Trash2,
  DollarSign,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  FileText,
  BarChart3,
} from "lucide-react"

export default function GrilleTarifairePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTarif, setSelectedTarif] = useState<any>(null)

  // Mock data for grille tarifaire DGA
  const grilleTarifaire = [
    {
      id: 1,
      type: "primaire",
      description: "Livres primaires",
      prix: 12000,
      marge: 15,
      prixVente: 13800,
      statut: "actif",
      dateCreation: "2024-01-01",
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      commentaires: "Tarif standard pour les livres primaires",
    },
    {
      id: 2,
      type: "secondaire",
      description: "Livres secondaires",
      prix: 18000,
      marge: 20,
      prixVente: 21600,
      statut: "actif",
      dateCreation: "2024-01-01",
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      commentaires: "Tarif standard pour les livres secondaires",
    },
    {
      id: 3,
      type: "universitaire",
      description: "Livres universitaires",
      prix: 25000,
      marge: 25,
      prixVente: 31250,
      statut: "actif",
      dateCreation: "2024-01-01",
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      commentaires: "Tarif standard pour les livres universitaires",
    },
    {
      id: 4,
      type: "specialise",
      description: "Livres spécialisés",
      prix: 30000,
      marge: 30,
      prixVente: 39000,
      statut: "actif",
      dateCreation: "2024-01-01",
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      commentaires: "Tarif standard pour les livres spécialisés",
    },
    {
      id: 5,
      type: "manuel",
      description: "Manuels scolaires",
      prix: 15000,
      marge: 18,
      prixVente: 17700,
      statut: "actif",
      dateCreation: "2024-01-01",
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      commentaires: "Tarif standard pour les manuels scolaires",
    },
    {
      id: 6,
      type: "cahier",
      description: "Cahiers d'exercices",
      prix: 8000,
      marge: 12,
      prixVente: 8960,
      statut: "actif",
      dateCreation: "2024-01-01",
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      commentaires: "Tarif standard pour les cahiers d'exercices",
    },
  ]

  const historiqueModifications = [
    {
      id: 1,
      type: "primaire",
      ancienPrix: 10000,
      nouveauPrix: 12000,
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      raison: "Ajustement des coûts de production",
    },
    {
      id: 2,
      type: "secondaire",
      ancienPrix: 15000,
      nouveauPrix: 18000,
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      raison: "Ajustement des coûts de production",
    },
    {
      id: 3,
      type: "universitaire",
      ancienPrix: 20000,
      nouveauPrix: 25000,
      dateModification: "2024-01-15",
      modifiePar: "DGA",
      raison: "Ajustement des coûts de production",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "inactif":
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>
      case "en_attente":
        return <Badge className="bg-amber-100 text-amber-800">En Attente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "primaire":
        return <BookOpen className="h-4 w-4" />
      case "secondaire":
        return <BookOpen className="h-4 w-4" />
      case "universitaire":
        return <BookOpen className="h-4 w-4" />
      case "specialise":
        return <BookOpen className="h-4 w-4" />
      case "manuel":
        return <FileText className="h-4 w-4" />
      case "cahier":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const filteredTarifs = grilleTarifaire.filter((tarif) => {
    const matchesSearch = tarif.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarif.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || tarif.type === filterType
    return matchesSearch && matchesType
  })

  const totalTarifs = grilleTarifaire.length
  const tarifsActifs = grilleTarifaire.filter(t => t.statut === "actif").length
  const prixMoyen = grilleTarifaire.reduce((sum, t) => sum + t.prix, 0) / grilleTarifaire.length
  const margeMoyenne = grilleTarifaire.reduce((sum, t) => sum + t.marge, 0) / grilleTarifaire.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grille Tarifaire DGA</h1>
          <p className="text-muted-foreground">Gérez les tarifs spécifiques pour les grossistes et librairies</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Tarif
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Tarif</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau tarif à la grille tarifaire DGA
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de Livre *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primaire">Primaire</SelectItem>
                      <SelectItem value="secondaire">Secondaire</SelectItem>
                      <SelectItem value="universitaire">Universitaire</SelectItem>
                      <SelectItem value="specialise">Spécialisé</SelectItem>
                      <SelectItem value="manuel">Manuel</SelectItem>
                      <SelectItem value="cahier">Cahier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input id="description" placeholder="Ex: Livres primaires" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prix">Prix de Base (FCFA) *</Label>
                  <Input id="prix" type="number" placeholder="12000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marge">Marge (%) *</Label>
                  <Input id="marge" type="number" placeholder="15" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commentaires">Commentaires</Label>
                <Textarea id="commentaires" placeholder="Notes sur ce tarif..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Créer le Tarif
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tarifs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTarifs}</div>
            <p className="text-xs text-muted-foreground">Types de livres</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tarifsActifs}</div>
            <p className="text-xs text-muted-foreground">Tarifs en vigueur</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prix Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prixMoyen.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Prix de base moyen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marge Moyenne</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{margeMoyenne.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Marge moyenne</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grille" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grille">Grille Tarifaire</TabsTrigger>
          <TabsTrigger value="historique">Historique Modifications</TabsTrigger>
          <TabsTrigger value="comparaison">Comparaison Tarifs</TabsTrigger>
        </TabsList>

        <TabsContent value="grille" className="space-y-4">
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
                      placeholder="Rechercher par type, description..."
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
                    <SelectItem value="primaire">Primaire</SelectItem>
                    <SelectItem value="secondaire">Secondaire</SelectItem>
                    <SelectItem value="universitaire">Universitaire</SelectItem>
                    <SelectItem value="specialise">Spécialisé</SelectItem>
                    <SelectItem value="manuel">Manuel</SelectItem>
                    <SelectItem value="cahier">Cahier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tarifs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Tarifs</CardTitle>
              <CardDescription>Gérez les tarifs de la grille DGA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Prix de Base</TableHead>
                      <TableHead>Marge</TableHead>
                      <TableHead>Prix de Vente</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière Modif</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTarifs.map((tarif) => (
                      <TableRow key={tarif.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getTypeIcon(tarif.type)}
                            <div>
                              <div className="font-medium capitalize">{tarif.type}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{tarif.description}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{tarif.prix.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tarif.marge}%</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-green-600">{tarif.prixVente.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(tarif.statut)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(tarif.dateModification).toLocaleDateString("fr-FR")}</div>
                            <div className="text-muted-foreground">Par {tarif.modifiePar}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedTarif(tarif)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Modifier le Tarif</DialogTitle>
                                  <DialogDescription>Modifiez les informations du tarif {tarif.type}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="type">Type de Livre</Label>
                                      <Input id="type" value={tarif.type} disabled />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="description">Description</Label>
                                      <Input id="description" value={tarif.description} />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="prix">Prix de Base (FCFA)</Label>
                                      <Input id="prix" type="number" value={tarif.prix} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="marge">Marge (%)</Label>
                                      <Input id="marge" type="number" value={tarif.marge} />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="commentaires">Commentaires</Label>
                                    <Textarea id="commentaires" value={tarif.commentaires} />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Annuler</Button>
                                  <Button>Enregistrer</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
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

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Modifications</CardTitle>
              <CardDescription>Suivi des changements de tarifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Ancien Prix</TableHead>
                      <TableHead>Nouveau Prix</TableHead>
                      <TableHead>Variation</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Modifié Par</TableHead>
                      <TableHead>Raison</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historiqueModifications.map((modification) => (
                      <TableRow key={modification.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(modification.type)}
                            <span className="capitalize">{modification.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{modification.ancienPrix.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{modification.nouveauPrix.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-semibold ${
                            modification.nouveauPrix > modification.ancienPrix ? "text-red-600" : "text-green-600"
                          }`}>
                            {modification.nouveauPrix > modification.ancienPrix ? "+" : ""}
                            {((modification.nouveauPrix - modification.ancienPrix) / modification.ancienPrix * 100).toFixed(1)}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(modification.dateModification).toLocaleDateString("fr-FR")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{modification.modifiePar}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{modification.raison}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparaison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison des Tarifs</CardTitle>
              <CardDescription>Analyse comparative des tarifs par type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grilleTarifaire.map((tarif) => (
                  <div key={tarif.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(tarif.type)}
                      <div>
                        <div className="font-medium capitalize">{tarif.type}</div>
                        <div className="text-sm text-muted-foreground">{tarif.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{tarif.prix.toLocaleString()} FCFA</div>
                      <div className="text-sm text-muted-foreground">Prix de base</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{tarif.prixVente.toLocaleString()} FCFA</div>
                      <div className="text-sm text-muted-foreground">Prix de vente</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">{tarif.marge}%</div>
                      <div className="text-sm text-muted-foreground">Marge</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Information :</strong> La grille tarifaire DGA est spécifique aux grossistes et librairies du Bénin. 
          Elle est différente des tarifs appliqués aux écoles. La DGA ne peut pas vendre aux écoles directement. 
          Tous les grossistes sont obligatoirement rattachés à son compte.
        </AlertDescription>
      </Alert>
    </div>
  )
}
