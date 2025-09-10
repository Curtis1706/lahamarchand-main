"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Search,
  Eye,
  Lock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react"

const operations = [
  {
    id: "OP-2024-001",
    type: "entree",
    date: "2024-01-20",
    article: "Mathématiques Appliquées au Gabon",
    quantite: 50,
    prixUnitaire: 15000,
    montantTotal: 750000,
    fournisseur: "Imprimerie Nationale",
    statut: "validee",
    operateur: "PDG",
    commentaire: "Réapprovisionnement stock principal",
  },
  {
    id: "OP-2024-002",
    type: "depot",
    date: "2024-01-19",
    article: "Histoire du Gabon Moderne",
    quantite: 25,
    prixUnitaire: 18000,
    montantTotal: 450000,
    partenaire: "Librairie Centrale Libreville",
    statut: "en_cours",
    operateur: "Jean Mbadinga",
    commentaire: "Dépôt partenaire - livraison programmée",
  },
  {
    id: "OP-2024-003",
    type: "vente_directe",
    date: "2024-01-18",
    article: "Arts Traditionnels Gabonais",
    quantite: 3,
    prixUnitaire: 22000,
    montantTotal: 66000,
    client: "École Nationale d'Administration",
    statut: "validee",
    operateur: "PDG",
    commentaire: "Vente institutionnelle",
  },
  {
    id: "OP-2024-004",
    type: "retour",
    date: "2024-01-17",
    article: "Philosophie Africaine",
    quantite: 5,
    prixUnitaire: 20000,
    montantTotal: -100000,
    partenaire: "Librairie du Campus",
    statut: "en_attente_correction",
    operateur: "Sylvie Obame",
    commentaire: "Retour produits défectueux - correction PDG requise",
  },
]

const statistiques = {
  totalOperations: 1245,
  operationsJour: 12,
  chiffreAffairesJour: 2450000,
  operationsEnAttente: 8,
  entrees: 450,
  sorties: 678,
  retours: 23,
}

export default function OperationsConsultationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterPeriode, setFilterPeriode] = useState("7j")

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "entree":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Entrée</Badge>
      case "depot":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Dépôt</Badge>
      case "vente_directe":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Vente Directe</Badge>
      case "retour":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Retour</Badge>
      default:
        return <Badge variant="secondary">Autre</Badge>
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "validee":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Validée</Badge>
      case "en_cours":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En cours</Badge>
      case "en_attente_correction":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Correction PDG requise</Badge>
      case "annulee":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Annulée</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header avec indicateur lecture seule */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-balance">Suivi des Opérations</h1>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Lecture Seule
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Consultation des opérations en temps réel (accès représentant - lecture uniquement)
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-red-50 px-3 py-2 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          <span>Corrections réservées au PDG</span>
        </div>
      </div>

      {/* Statistiques des opérations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opérations Aujourd'hui</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques.operationsJour}</div>
            <p className="text-xs text-muted-foreground">+3 par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Journalier</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(statistiques.chiffreAffairesJour / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente Correction</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistiques.operationsEnAttente}</div>
            <p className="text-xs text-muted-foreground">Action PDG requise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opérations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques.totalOperations}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="toutes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="toutes">Toutes les Opérations</TabsTrigger>
          <TabsTrigger value="entrees">Entrées Stock</TabsTrigger>
          <TabsTrigger value="sorties">Sorties & Dépôts</TabsTrigger>
          <TabsTrigger value="corrections">Corrections Pendantes</TabsTrigger>
        </TabsList>

        <TabsContent value="toutes" className="space-y-4">
          {/* Filtres de consultation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtres de Consultation
              </CardTitle>
              <CardDescription>Recherche et filtrage des opérations (accès lecture seule)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <Label htmlFor="search">Rechercher une opération</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="ID opération, article, client, partenaire..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Type d'opération</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="entree">Entrées</SelectItem>
                      <SelectItem value="depot">Dépôts</SelectItem>
                      <SelectItem value="vente_directe">Ventes directes</SelectItem>
                      <SelectItem value="retour">Retours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="validee">Validée</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="en_attente_correction">En attente correction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Période</Label>
                  <Select value={filterPeriode} onValueChange={setFilterPeriode}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1j">Aujourd'hui</SelectItem>
                      <SelectItem value="7j">7 jours</SelectItem>
                      <SelectItem value="30j">30 jours</SelectItem>
                      <SelectItem value="90j">3 mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tableau des opérations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Journal des Opérations
              </CardTitle>
              <CardDescription>
                Consultation détaillée de toutes les opérations (dernière mise à jour automatique)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Opération</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell>
                        <div className="font-medium">{operation.id}</div>
                        <div className="text-sm text-muted-foreground">{operation.date}</div>
                      </TableCell>
                      <TableCell>{getTypeBadge(operation.type)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{operation.article}</div>
                        <div className="text-sm text-muted-foreground">
                          {operation.client || operation.partenaire || operation.fournisseur}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {operation.type === "retour" ? "-" : "+"}
                          {operation.quantite}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`font-medium ${operation.montantTotal < 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {operation.montantTotal.toLocaleString()} FCFA
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(operation.statut)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{operation.operateur}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Badge variant="outline" className="text-xs">
                            <Lock className="mr-1 h-3 w-3" />
                            Lecture
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corrections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Opérations Nécessitant une Correction
              </CardTitle>
              <CardDescription>
                {statistiques.operationsEnAttente} opérations en attente de correction par le PDG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operations
                  .filter((op) => op.statut === "en_attente_correction")
                  .map((operation) => (
                    <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{operation.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {operation.article} • {operation.commentaire}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(operation.type)}
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <Lock className="mr-1 h-3 w-3" />
                          Correction PDG requise
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entrees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Entrées de Stock
              </CardTitle>
              <CardDescription>Consultation des approvisionnements et entrées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operations
                  .filter((op) => op.type === "entree")
                  .map((operation) => (
                    <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Package className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">{operation.article}</div>
                          <div className="text-sm text-muted-foreground">
                            +{operation.quantite} unités • {operation.fournisseur} • {operation.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          +{operation.montantTotal.toLocaleString()} FCFA
                        </div>
                        {getStatutBadge(operation.statut)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sorties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                Sorties et Dépôts
              </CardTitle>
              <CardDescription>Consultation des ventes et dépôts partenaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operations
                  .filter((op) => op.type === "depot" || op.type === "vente_directe")
                  .map((operation) => (
                    <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {operation.type === "depot" ? (
                          <Truck className="h-5 w-5 text-blue-600" />
                        ) : (
                          <ShoppingCart className="h-5 w-5 text-purple-600" />
                        )}
                        <div>
                          <div className="font-medium">{operation.article}</div>
                          <div className="text-sm text-muted-foreground">
                            -{operation.quantite} unités • {operation.partenaire || operation.client} • {operation.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{operation.montantTotal.toLocaleString()} FCFA</div>
                        {getStatutBadge(operation.statut)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Note d'information sur les droits */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Accès Représentant - Consultation Uniquement</h4>
              <p className="text-sm text-red-700 mt-1">
                Vous consultez les opérations en temps réel. Les corrections d'opérations sont un{" "}
                <strong>droit exclusif du PDG</strong>. Toute anomalie détectée doit être
                signalée à l'administration pour correction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
