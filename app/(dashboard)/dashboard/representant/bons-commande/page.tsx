"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  Search,
  Eye,
  Plus,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserCheck,
} from "lucide-react"

const bonsCommande = [
  {
    id: "BC-2024-001",
    partenaire: "Librairie Centrale Libreville",
    dateEmission: "2024-01-20",
    dateEcheance: "2024-01-25",
    statut: "en_attente_validation",
    montantTotal: 450000,
    nbArticles: 25,
    representant: "Jean Mbadinga",
    commentaire: "Commande mensuelle standard",
  },
  {
    id: "BC-2024-002",
    partenaire: "Librairie du Campus",
    dateEmission: "2024-01-18",
    dateEcheance: "2024-01-23",
    statut: "validee",
    montantTotal: 320000,
    nbArticles: 18,
    representant: "Jean Mbadinga",
    commentaire: "Réapprovisionnement urgence",
  },
  {
    id: "BC-2024-003",
    partenaire: "Point Lecture Port-Gentil",
    dateEmission: "2024-01-15",
    dateEcheance: "2024-01-20",
    statut: "expediee",
    montantTotal: 280000,
    nbArticles: 15,
    representant: "Jean Mbadinga",
    commentaire: "Nouvelle ouverture point de vente",
  },
]

const partenaires = [
  { id: 1, nom: "Librairie Centrale Libreville", ville: "Libreville", statut: "actif" },
  { id: 2, nom: "Librairie du Campus", ville: "Libreville", statut: "actif" },
  { id: 3, nom: "Point Lecture Port-Gentil", ville: "Port-Gentil", statut: "actif" },
  { id: 4, nom: "Espace Livre Franceville", ville: "Franceville", statut: "actif" },
]

const articles = [
  { id: 1, titre: "Mathématiques Appliquées", prix: 15000, stock: 89 },
  { id: 2, titre: "Histoire du Gabon", prix: 18000, stock: 45 },
  { id: 3, titre: "Arts Traditionnels", prix: 22000, stock: 67 },
]

export default function BonsCommandePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState("all")
  const [selectedBon, setSelectedBon] = useState<any>(null)
  const [showNewBon, setShowNewBon] = useState(false)
  const [newBon, setNewBon] = useState({
    partenaire: "",
    dateEcheance: "",
    commentaire: "",
    articles: [] as any[],
  })

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_attente_validation":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente validation</Badge>
      case "validee":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Validée</Badge>
      case "expediee":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Expédiée</Badge>
      case "livree":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Livrée</Badge>
      case "annulee":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Annulée</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Bons de Commande</h1>
          <p className="text-muted-foreground">
            Émission et suivi des bons de commande pour les partenaires (droit représentant)
          </p>
        </div>
        <Dialog open={showNewBon} onOpenChange={setShowNewBon}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Bon de Commande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Nouveau Bon de Commande</DialogTitle>
              <DialogDescription>Émission d'un bon de commande pour un partenaire</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Partenaire destinataire</Label>
                  <Select
                    value={newBon.partenaire}
                    onValueChange={(value) => setNewBon({ ...newBon, partenaire: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un partenaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {partenaires.map((partenaire) => (
                        <SelectItem key={partenaire.id} value={partenaire.nom}>
                          {partenaire.nom} - {partenaire.ville}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date d'échéance</Label>
                  <Input
                    type="date"
                    value={newBon.dateEcheance}
                    onChange={(e) => setNewBon({ ...newBon, dateEcheance: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Articles à commander</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  {articles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{article.titre}</div>
                        <div className="text-sm text-muted-foreground">
                          {article.prix.toLocaleString()} FCFA • Stock: {article.stock}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="Qté" className="w-20" min="0" />
                        <Button size="sm" variant="outline">
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Commentaire</Label>
                <Textarea
                  placeholder="Commentaire ou instructions particulières..."
                  value={newBon.commentaire}
                  onChange={(e) => setNewBon({ ...newBon, commentaire: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewBon(false)}>
                Annuler
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                Émettre le Bon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bons Émis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente Validation</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-xs text-muted-foreground">Validation PDG requise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89</div>
            <p className="text-xs text-muted-foreground">Prêts pour expédition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.6M</div>
            <p className="text-xs text-muted-foreground">FCFA ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recherche et Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="ID bon, partenaire, représentant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="en_attente_validation">En attente validation</SelectItem>
                  <SelectItem value="validee">Validée</SelectItem>
                  <SelectItem value="expediee">Expédiée</SelectItem>
                  <SelectItem value="livree">Livrée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des bons de commande */}
      <Card>
        <CardHeader>
          <CardTitle>Bons de Commande Émis</CardTitle>
          <CardDescription>Suivi de tous les bons de commande émis pour les partenaires</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Bon</TableHead>
                <TableHead>Partenaire</TableHead>
                <TableHead>Date Émission</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bonsCommande.map((bon) => (
                <TableRow key={bon.id}>
                  <TableCell>
                    <div className="font-medium">{bon.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{bon.partenaire}</div>
                    <div className="text-sm text-muted-foreground">par {bon.representant}</div>
                  </TableCell>
                  <TableCell>{bon.dateEmission}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {bon.dateEcheance}
                    </div>
                  </TableCell>
                  <TableCell>{getStatutBadge(bon.statut)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{bon.montantTotal.toLocaleString()} FCFA</div>
                    <div className="text-sm text-muted-foreground">{bon.nbArticles} articles</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedBon(bon)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails du Bon de Commande</DialogTitle>
                            <DialogDescription>Bon de commande {selectedBon?.id}</DialogDescription>
                          </DialogHeader>
                          {selectedBon && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>ID Bon</Label>
                                  <div className="font-medium">{selectedBon.id}</div>
                                </div>
                                <div>
                                  <Label>Partenaire</Label>
                                  <div className="font-medium">{selectedBon.partenaire}</div>
                                </div>
                                <div>
                                  <Label>Date d'émission</Label>
                                  <div>{selectedBon.dateEmission}</div>
                                </div>
                                <div>
                                  <Label>Date d'échéance</Label>
                                  <div>{selectedBon.dateEcheance}</div>
                                </div>
                                <div>
                                  <Label>Statut</Label>
                                  {getStatutBadge(selectedBon.statut)}
                                </div>
                                <div>
                                  <Label>Montant total</Label>
                                  <div className="font-medium">{selectedBon.montantTotal.toLocaleString()} FCFA</div>
                                </div>
                              </div>
                              <div>
                                <Label>Commentaire</Label>
                                <div className="text-sm bg-gray-50 p-2 rounded">{selectedBon.commentaire}</div>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger PDF
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>

                      {bon.statut === "en_attente_validation" && (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Validation PDG
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Note d'information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <UserCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Droit Représentant - Émission de Bons de Commande</h4>
              <p className="text-sm text-blue-700 mt-1">
                Vous pouvez émettre des bons de commande pour vos partenaires. Tous les bons nécessitent une validation
                finale du PDG avant expédition . Les partenaires seront notifiés
                automatiquement du statut de leurs commandes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
