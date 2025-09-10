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
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  FileText,
  Truck,
  Package,
} from "lucide-react"

export default function CommandesGrossistesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState<any>(null)

  // Mock data for grossiste orders
  const commandesGrossistes = [
    {
      id: "CMD-GROSS-001",
      grossiste: "Librairie Centrale du Bénin",
      directeur: "M. Jean Akendengue",
      dateCommande: "2024-01-25",
      statut: "validee",
      articles: 50,
      montantBrut: 450000,
      remise: 5,
      montantNet: 427500,
      modePaiement: "virement",
      dateLivraison: "2024-02-05",
      validePar: "DGA",
      commentaires: "Commande urgente pour réapprovisionnement",
      zone: "Sud",
    },
    {
      id: "CMD-GROSS-002",
      grossiste: "Distributeur Éducatif Ouest",
      directeur: "Mme. Marie Obame",
      dateCommande: "2024-01-22",
      statut: "en_preparation",
      articles: 35,
      montantBrut: 320000,
      remise: 0,
      montantNet: 320000,
      modePaiement: "virement",
      dateLivraison: "2024-02-01",
      validePar: "DGA",
      commentaires: "Livraison standard",
      zone: "Sud",
    },
    {
      id: "CMD-GROSS-003",
      grossiste: "Centre de Distribution Nord",
      directeur: "M. Pierre Mba",
      dateCommande: "2024-01-20",
      statut: "en_attente_validation",
      articles: 28,
      montantBrut: 280000,
      remise: 0,
      montantNet: 280000,
      modePaiement: "virement",
      dateLivraison: "2024-02-10",
      validePar: null,
      commentaires: "Nouvelle commande en attente",
      zone: "Nord",
    },
    {
      id: "CMD-GROSS-004",
      grossiste: "Librairie du Plateau",
      directeur: "Mme. Sophie Mba",
      dateCommande: "2024-01-18",
      statut: "livree",
      articles: 15,
      montantBrut: 150000,
      remise: 10,
      montantNet: 135000,
      modePaiement: "virement",
      dateLivraison: "2024-01-25",
      validePar: "DGA",
      commentaires: "Livraison effectuée avec succès",
      zone: "Sud",
    },
    {
      id: "CMD-GROSS-005",
      grossiste: "Librairie Universitaire",
      directeur: "Dr. Paul Nguema",
      dateCommande: "2024-01-15",
      statut: "annulee",
      articles: 20,
      montantBrut: 200000,
      remise: 0,
      montantNet: 200000,
      modePaiement: "virement",
      dateLivraison: "2024-01-30",
      validePar: "DGA",
      commentaires: "Annulée par le grossiste",
      zone: "Sud",
    },
  ]

  const grossistes = [
    { id: 1, nom: "Librairie Centrale du Bénin", directeur: "M. Jean Akendengue" },
    { id: 2, nom: "Distributeur Éducatif Ouest", directeur: "Mme. Marie Obame" },
    { id: 3, nom: "Centre de Distribution Nord", directeur: "M. Pierre Mba" },
    { id: 4, nom: "Librairie du Plateau", directeur: "Mme. Sophie Mba" },
    { id: 5, nom: "Librairie Universitaire", directeur: "Dr. Paul Nguema" },
  ]

  const livresDisponibles = [
    { id: 1, titre: "Mathématiques Appliquées", prix: 12000, stock: 45, type: "primaire" },
    { id: 2, titre: "Histoire du Bénin", prix: 18000, stock: 32, type: "secondaire" },
    { id: 3, titre: "Physique Quantique", prix: 25000, stock: 28, type: "universitaire" },
    { id: 4, titre: "Français CM1", prix: 12000, stock: 67, type: "primaire" },
    { id: 5, titre: "Sciences Naturelles", prix: 15000, stock: 41, type: "primaire" },
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
      case "virement":
        return <Badge className="bg-blue-100 text-blue-800">Virement Bancaire</Badge>
      case "mobile":
        return <Badge className="bg-green-100 text-green-800">Mobile Money</Badge>
      case "especes":
        return <Badge className="bg-gray-100 text-gray-800">Espèces</Badge>
      default:
        return <Badge variant="outline">{mode}</Badge>
    }
  }

  const filteredCommandes = commandesGrossistes.filter((commande) => {
    const matchesSearch = commande.grossiste.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commande.directeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commande.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || commande.statut === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalCommandes = commandesGrossistes.length
  const commandesEnAttente = commandesGrossistes.filter(c => c.statut === "en_attente_validation").length
  const chiffreAffaires = commandesGrossistes.reduce((sum, c) => sum + c.montantNet, 0)
  const totalArticles = commandesGrossistes.reduce((sum, c) => sum + c.articles, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes des Grossistes</h1>
          <p className="text-muted-foreground">Suivi des commandes passées par les grossistes et librairies</p>
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
              <DialogTitle>Créer une Commande Grossiste</DialogTitle>
              <DialogDescription>
                Saisissez une nouvelle commande pour un grossiste ou librairie
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Grossiste Selection */}
              <div className="space-y-2">
                <Label htmlFor="grossiste">Grossiste/Librairie *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un grossiste" />
                  </SelectTrigger>
                  <SelectContent>
                    {grossistes.map((grossiste) => (
                      <SelectItem key={grossiste.id} value={grossiste.id.toString()}>
                        {grossiste.nom} - {grossiste.directeur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mode de Paiement */}
              <div className="space-y-2">
                <Label>Mode de Paiement *</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="virement" name="paiement" value="virement" />
                      <Label htmlFor="virement" className="cursor-pointer">
                        <div className="font-medium">Virement Bancaire</div>
                        <div className="text-sm text-muted-foreground">Recommandé</div>
                      </Label>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="mobile" name="paiement" value="mobile" />
                      <Label htmlFor="mobile" className="cursor-pointer">
                        <div className="font-medium">Mobile Money</div>
                        <div className="text-sm text-muted-foreground">Rapide</div>
                      </Label>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="especes" name="paiement" value="especes" />
                      <Label htmlFor="especes" className="cursor-pointer">
                        <div className="font-medium">Espèces</div>
                        <div className="text-sm text-muted-foreground">Sur place</div>
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
          <TabsTrigger value="validees">Validées ({commandesGrossistes.filter(c => c.statut === "validee").length})</TabsTrigger>
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
                      placeholder="Rechercher par grossiste, directeur, ID commande..."
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
                    <SelectItem value="annulee">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Commandes</CardTitle>
              <CardDescription>Suivi de toutes les commandes des grossistes</CardDescription>
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
                            <div className="font-medium">{commande.grossiste}</div>
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
                                  <DialogDescription>Commande {commande.id} - {commande.grossiste}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Grossiste</Label>
                                      <p className="text-sm">{commande.grossiste}</p>
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
              <CardDescription>Ces commandes nécessitent une validation avant traitement</CardDescription>
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
                            {commande.grossiste} - {commande.directeur}
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
                          <span>Zone: {commande.zone}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                            <Trash2 className="h-4 w-4 mr-2" />
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
                  .filter(c => c.statut === "validee")
                  .map((commande) => (
                    <div key={commande.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{commande.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {commande.grossiste} - {commande.directeur}
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
                          <span>Validé par: {commande.validePar}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir Détails
                          </Button>
                          <Button size="sm">
                            <Truck className="h-4 w-4 mr-2" />
                            Suivre Livraison
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
          <strong>Information :</strong> La DGA gère exclusivement les commandes des grossistes et librairies du Bénin. 
          Toutes les commandes sont traitées avec la grille tarifaire spécifique DGA. 
          Les grossistes ne peuvent pas vendre aux écoles directement.
        </AlertDescription>
      </Alert>
    </div>
  )
}
