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
  School,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  Package,
  FileText,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"

export default function CommandesEcolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState<any>(null)

  // Mock data for school orders
  const commandesEcoles = [
    {
      id: "CMD-ECOLE-001",
      ecole: "Lycée Léon Mba",
      directeur: "Dr. Jean Obame",
      dateCommande: "2024-01-28",
      statut: "en_attente_validation",
      articles: 15,
      montantBrut: 450000,
      remise: 0,
      montantNet: 450000,
      modePaiement: "echeancier",
      echeances: 3,
      montantEcheance: 150000,
      dateLivraison: "2024-02-05",
      validePar: null,
      commentaires: "Commande pour la rentrée scolaire",
    },
    {
      id: "CMD-ECOLE-002",
      ecole: "École Publique de l'Indépendance",
      directeur: "Mme. Marie Nzamba",
      dateCommande: "2024-01-25",
      statut: "validee",
      articles: 8,
      montantBrut: 240000,
      remise: 5,
      montantNet: 228000,
      modePaiement: "cash",
      echeances: 1,
      montantEcheance: 228000,
      dateLivraison: "2024-02-01",
      validePar: "Responsable Interne",
      commentaires: "Paiement cash avec tarif spécial",
    },
    {
      id: "CMD-ECOLE-003",
      ecole: "Collège Saint-Gabriel",
      directeur: "Père Michel Nguema",
      dateCommande: "2024-01-20",
      statut: "en_preparation",
      articles: 12,
      montantBrut: 360000,
      remise: 0,
      montantNet: 360000,
      modePaiement: "echeancier",
      echeances: 2,
      montantEcheance: 180000,
      dateLivraison: "2024-01-30",
      validePar: "Responsable Interne",
      commentaires: "Livraison urgente demandée",
    },
    {
      id: "CMD-ECOLE-004",
      ecole: "École Privée Les Poussins",
      directeur: "Mme. Sophie Mba",
      dateCommande: "2024-01-15",
      statut: "livree",
      articles: 6,
      montantBrut: 180000,
      remise: 10,
      montantNet: 162000,
      modePaiement: "cash",
      echeances: 1,
      montantEcheance: 162000,
      dateLivraison: "2024-01-22",
      validePar: "Responsable Interne",
      commentaires: "Livraison effectuée avec succès",
    },
  ]

  const ecoles = [
    { id: 1, nom: "Lycée Léon Mba", directeur: "Dr. Jean Obame" },
    { id: 2, nom: "École Publique de l'Indépendance", directeur: "Mme. Marie Nzamba" },
    { id: 3, nom: "Collège Saint-Gabriel", directeur: "Père Michel Nguema" },
    { id: 4, nom: "École Privée Les Poussins", directeur: "Mme. Sophie Mba" },
  ]

  const livresDisponibles = [
    { id: 1, titre: "Mathématiques Appliquées", prix: 25000, stock: 45, type: "secondaire" },
    { id: 2, titre: "Histoire du Gabon", prix: 20000, stock: 32, type: "primaire" },
    { id: 3, titre: "Physique Quantique", prix: 30000, stock: 28, type: "secondaire" },
    { id: 4, titre: "Français CM1", prix: 15000, stock: 67, type: "primaire" },
    { id: 5, titre: "Sciences Naturelles", prix: 22000, stock: 41, type: "primaire" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente_validation":
        return <Badge className="bg-amber-100 text-amber-800">En Attente Validation</Badge>
      case "validee":
        return <Badge className="bg-blue-100 text-blue-800">Validée</Badge>
      case "en_preparation":
        return <Badge className="bg-purple-100 text-purple-800">En Préparation</Badge>
      case "livree":
        return <Badge className="bg-green-100 text-green-800">Livrée</Badge>
      case "annulee":
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getModePaiementBadge = (mode: string) => {
    switch (mode) {
      case "cash":
        return <Badge className="bg-green-100 text-green-800">Cash (Tarif Spécial)</Badge>
      case "echeancier":
        return <Badge className="bg-blue-100 text-blue-800">Échéancier (Tarif Normal)</Badge>
      default:
        return <Badge variant="outline">{mode}</Badge>
    }
  }

  const filteredCommandes = commandesEcoles.filter((commande) => {
    const matchesSearch = commande.ecole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commande.directeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commande.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || commande.statut === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalCommandes = commandesEcoles.length
  const commandesEnAttente = commandesEcoles.filter(c => c.statut === "en_attente_validation").length
  const chiffreAffaires = commandesEcoles.reduce((sum, c) => sum + c.montantNet, 0)
  const totalArticles = commandesEcoles.reduce((sum, c) => sum + c.articles, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes des Écoles</h1>
          <p className="text-muted-foreground">Saisissez et gérez les commandes des écoles de votre réseau</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Commande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Créer une Commande École</DialogTitle>
              <DialogDescription>
                Saisissez une nouvelle commande pour une école de votre réseau
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* École Selection */}
              <div className="space-y-2">
                <Label htmlFor="ecole">École *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une école" />
                  </SelectTrigger>
                  <SelectContent>
                    {ecoles.map((ecole) => (
                      <SelectItem key={ecole.id} value={ecole.id.toString()}>
                        {ecole.nom} - {ecole.directeur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mode de Paiement */}
              <div className="space-y-2">
                <Label>Mode de Paiement *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="cash" name="paiement" value="cash" />
                      <Label htmlFor="cash" className="cursor-pointer">
                        <div className="font-medium">Paiement Cash</div>
                        <div className="text-sm text-muted-foreground">Tarif spécial appliqué</div>
                      </Label>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="echeancier" name="paiement" value="echeancier" />
                      <Label htmlFor="echeancier" className="cursor-pointer">
                        <div className="font-medium">Paiement par Échéancier</div>
                        <div className="text-sm text-muted-foreground">Tarif normal</div>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Articles Selection */}
              <div className="space-y-4">
                <Label>Articles à Commander</Label>
                <div className="space-y-2">
                  {livresDisponibles.map((livre) => (
                    <div key={livre.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id={`livre-${livre.id}`} />
                        <div>
                          <div className="font-medium">{livre.titre}</div>
                          <div className="text-sm text-muted-foreground">
                            {livre.prix.toLocaleString()} FCFA • Stock: {livre.stock} • {livre.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">-</Button>
                        <Input className="w-16 text-center" value="0" />
                        <Button variant="outline" size="sm">+</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Échéancier Configuration */}
              <div className="space-y-2">
                <Label>Configuration de l'Échéancier</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="echeances">Nombre d'Échéances</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 échéance</SelectItem>
                        <SelectItem value="2">2 échéances</SelectItem>
                        <SelectItem value="3">3 échéances</SelectItem>
                        <SelectItem value="6">6 échéances</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="datePremiereEcheance">Date Première Échéance</Label>
                    <Input id="datePremiereEcheance" type="date" />
                  </div>
                </div>
              </div>

              {/* Commentaires */}
              <div className="space-y-2">
                <Label htmlFor="commentaires">Commentaires</Label>
                <Textarea id="commentaires" placeholder="Instructions spéciales, urgence, etc." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Créer la Commande
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCommandes}</div>
            <p className="text-xs text-muted-foreground">Commandes créées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{commandesEnAttente}</div>
            <p className="text-xs text-muted-foreground">Validation requise</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chiffreAffaires.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Montant total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Commandés</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground">Total articles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="toutes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="toutes">Toutes ({totalCommandes})</TabsTrigger>
          <TabsTrigger value="en_attente">En Attente ({commandesEnAttente})</TabsTrigger>
          <TabsTrigger value="validees">Validées ({commandesEcoles.filter(c => c.statut === "validee").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="toutes" className="space-y-4">
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
                      placeholder="Rechercher par école, directeur, ID commande..."
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
                    <SelectItem value="en_attente_validation">En Attente</SelectItem>
                    <SelectItem value="validee">Validée</SelectItem>
                    <SelectItem value="en_preparation">En Préparation</SelectItem>
                    <SelectItem value="livree">Livrée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Commandes</CardTitle>
              <CardDescription>Suivi de toutes les commandes des écoles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Commande</TableHead>
                      <TableHead>École</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Mode Paiement</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Livraison</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommandes.map((commande) => (
                      <TableRow key={commande.id}>
                        <TableCell className="font-mono text-sm">{commande.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{commande.ecole}</div>
                            <div className="text-sm text-muted-foreground">{commande.directeur}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(commande.dateCommande).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-semibold">{commande.articles}</div>
                            <div className="text-xs text-muted-foreground">articles</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold">{commande.montantNet.toLocaleString()} FCFA</div>
                            {commande.remise > 0 && (
                              <div className="text-xs text-green-600">-{commande.remise}% remise</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getModePaiementBadge(commande.modePaiement)}</TableCell>
                        <TableCell>{getStatusBadge(commande.statut)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(commande.dateLivraison).toLocaleDateString("fr-FR")}</div>
                            {commande.echeances > 1 && (
                              <div className="text-xs text-muted-foreground">
                                {commande.echeances} échéances de {commande.montantEcheance.toLocaleString()} FCFA
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedCommande(commande)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Détails de la Commande</DialogTitle>
                                  <DialogDescription>Commande {commande.id} - {commande.ecole}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">École</Label>
                                      <p className="text-sm">{commande.ecole}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Directeur</Label>
                                      <p className="text-sm">{commande.directeur}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Mode de Paiement</Label>
                                      <p className="text-sm">{getModePaiementBadge(commande.modePaiement)}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Statut</Label>
                                      <p className="text-sm">{getStatusBadge(commande.statut)}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Montant Brut</Label>
                                      <p className="text-sm font-semibold">{commande.montantBrut.toLocaleString()} FCFA</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Remise</Label>
                                      <p className="text-sm font-semibold">{commande.remise}%</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Montant Net</Label>
                                      <p className="text-sm font-semibold text-green-600">{commande.montantNet.toLocaleString()} FCFA</p>
                                    </div>
                                  </div>
                                  {commande.commentaires && (
                                    <div>
                                      <Label className="text-sm font-medium">Commentaires</Label>
                                      <p className="text-sm">{commande.commentaires}</p>
                                    </div>
                                  )}
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

        <TabsContent value="en_attente" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Commandes en Attente de Validation
              </CardTitle>
              <CardDescription>Ces commandes nécessitent une validation interne avant traitement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCommandes
                  .filter(c => c.statut === "en_attente_validation")
                  .map((commande) => (
                    <div key={commande.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{commande.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {commande.ecole} - {commande.directeur}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{commande.montantNet.toLocaleString()} FCFA</div>
                          <div className="text-sm text-muted-foreground">{commande.articles} articles</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Commandé le {new Date(commande.dateCommande).toLocaleDateString("fr-FR")}</span>
                          <span>Livraison: {new Date(commande.dateLivraison).toLocaleDateString("fr-FR")}</span>
                          <span>{getModePaiementBadge(commande.modePaiement)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Rejeter
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
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

        <TabsContent value="validees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Commandes Validées
              </CardTitle>
              <CardDescription>Commandes approuvées et en cours de traitement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCommandes
                  .filter(c => c.statut === "validee" || c.statut === "en_preparation" || c.statut === "livree")
                  .map((commande) => (
                    <div key={commande.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{commande.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {commande.ecole} - {commande.directeur}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{commande.montantNet.toLocaleString()} FCFA</div>
                          <div className="text-sm text-muted-foreground">{commande.articles} articles</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Validé par: {commande.validePar}</span>
                          <span>Livraison: {new Date(commande.dateLivraison).toLocaleDateString("fr-FR")}</span>
                          <span>{getStatusBadge(commande.statut)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Facture
                          </Button>
                        </div>
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
          <strong>Rappel :</strong> Toutes les commandes doivent être validées par un responsable interne 
          avant traitement. LAHA Éditions se réserve le droit de modifier les tarifs à tout moment. 
          Les remises personnalisées peuvent être appliquées par le PDG.
        </AlertDescription>
      </Alert>
    </div>
  )
}
