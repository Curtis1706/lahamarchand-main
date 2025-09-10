"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Package, AlertTriangle, TrendingUp, Search, ShoppingCart, Eye } from "lucide-react"

const stockAlloue = [
  {
    id: 1,
    titre: "Mathématiques Appliquées au Gabon",
    auteur: "Dr. Marie Nzamba",
    discipline: "Sciences",
    quantiteAllouee: 50,
    quantiteRestante: 23,
    prixUnitaire: 8500,
    dateAllocation: "2024-01-15",
    statut: "actif",
    rotation: "moyenne",
    ventesRealisees: 27,
  },
  {
    id: 2,
    titre: "Histoire du Gabon Moderne",
    auteur: "Prof. Jean Obame",
    discipline: "Histoire",
    quantiteAllouee: 30,
    quantiteRestante: 5,
    prixUnitaire: 12000,
    dateAllocation: "2024-01-10",
    statut: "stock_faible",
    rotation: "rapide",
    ventesRealisees: 25,
  },
  {
    id: 3,
    titre: "Littérature Gabonaise Contemporaine",
    auteur: "Sylvie Ntoutoume",
    discipline: "Littérature",
    quantiteAllouee: 40,
    quantiteRestante: 35,
    prixUnitaire: 7500,
    dateAllocation: "2024-02-01",
    statut: "actif",
    rotation: "lente",
    ventesRealisees: 5,
  },
  {
    id: 4,
    titre: "Économie du Gabon - Perspectives",
    auteur: "Dr. Paul Mba",
    discipline: "Économie",
    quantiteAllouee: 25,
    quantiteRestante: 0,
    prixUnitaire: 15000,
    dateAllocation: "2023-12-20",
    statut: "epuise",
    rotation: "rapide",
    ventesRealisees: 25,
  },
]

const statistiquesStock = {
  totalAlloue: 145,
  totalRestant: 63,
  valeurTotale: 1485000,
  tauxRotation: 56.5,
  articlesActifs: 3,
  articlesEpuises: 1,
}

export default function StockAllouePartenairePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDiscipline, setFilterDiscipline] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
      case "stock_faible":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Stock Faible</Badge>
      case "epuise":
        return <Badge variant="destructive">Épuisé</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const getRotationBadge = (rotation: string) => {
    switch (rotation) {
      case "rapide":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Rapide</Badge>
      case "moyenne":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Moyenne</Badge>
      case "lente":
        return <Badge variant="outline">Lente</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const demanderReapprovisionnement = (articleId: number) => {
    console.log(`Demande de réapprovisionnement pour l'article ${articleId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Stock Alloué</h1>
          <p className="text-muted-foreground">Gestion de votre stock alloué - Librairie Nzeng-Ayong, Libreville</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Voir Historique
          </Button>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nouvelle Commande
          </Button>
        </div>
      </div>

      {/* Statistiques du stock */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alloué</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiquesStock.totalAlloue}</div>
            <p className="text-xs text-muted-foreground">Exemplaires au total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Restant</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statistiquesStock.totalRestant}</div>
            <p className="text-xs text-muted-foreground">
              {((statistiquesStock.totalRestant / statistiquesStock.totalAlloue) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistiquesStock.valeurTotale.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Valeur totale restante</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Rotation</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statistiquesStock.tauxRotation}%</div>
            <p className="text-xs text-muted-foreground">Performance de vente</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">Stock Actuel</TabsTrigger>
          <TabsTrigger value="alertes">Alertes</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          {/* Filtres et recherche */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recherche et Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <Label>Rechercher un article</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Titre, auteur, discipline..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Discipline</Label>
                  <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
                    <SelectTrigger className="w-48 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes disciplines</SelectItem>
                      <SelectItem value="Sciences">Sciences</SelectItem>
                      <SelectItem value="Histoire">Histoire</SelectItem>
                      <SelectItem value="Littérature">Littérature</SelectItem>
                      <SelectItem value="Économie">Économie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-48 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="stock_faible">Stock Faible</SelectItem>
                      <SelectItem value="epuise">Épuisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste du stock */}
          <Card>
            <CardHeader>
              <CardTitle>Articles Alloués</CardTitle>
              <CardDescription>Votre stock alloué par la direction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockAlloue.map((article) => (
                  <div key={article.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{article.titre}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Par {article.auteur} • {article.discipline}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>
                              <strong>Alloué:</strong> {article.quantiteAllouee} ex.
                            </span>
                            <span>
                              <strong>Restant:</strong> {article.quantiteRestante} ex.
                            </span>
                            <span>
                              <strong>Vendus:</strong> {article.ventesRealisees} ex.
                            </span>
                            <span className="text-green-600 font-medium">
                              {article.prixUnitaire.toLocaleString()} FCFA/ex.
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatutBadge(article.statut)}
                          {getRotationBadge(article.rotation)}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              article.quantiteRestante / article.quantiteAllouee > 0.5
                                ? "bg-green-500"
                                : article.quantiteRestante / article.quantiteAllouee > 0.2
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${(article.quantiteRestante / article.quantiteAllouee) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {((article.quantiteRestante / article.quantiteAllouee) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        Voir Détails
                      </Button>
                      {article.statut === "stock_faible" && (
                        <Button variant="default" size="sm" onClick={() => demanderReapprovisionnement(article.id)}>
                          Demander Stock
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertes de Stock</CardTitle>
              <CardDescription>Articles nécessitant votre attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockAlloue
                  .filter((article) => article.statut !== "actif")
                  .map((article) => (
                    <div
                      key={article.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg ${
                        article.statut === "epuise" ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 ${article.statut === "epuise" ? "text-red-600" : "text-orange-600"}`}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{article.titre}</h4>
                        <p className="text-sm text-muted-foreground">
                          {article.statut === "epuise"
                            ? "Stock épuisé - Demander réapprovisionnement"
                            : `Stock faible: ${article.quantiteRestante} exemplaires restants`}
                        </p>
                      </div>
                      <Button
                        variant={article.statut === "epuise" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => demanderReapprovisionnement(article.id)}
                      >
                        {article.statut === "epuise" ? "Réapprovisionner" : "Demander Stock"}
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Allocations</CardTitle>
              <CardDescription>Historique de votre stock alloué</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockAlloue.map((article) => (
                  <div key={article.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{article.titre}</h4>
                      <p className="text-sm text-muted-foreground">
                        Alloué le {new Date(article.dateAllocation).toLocaleDateString("fr-FR")} •{" "}
                        {article.quantiteAllouee} exemplaires
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{article.ventesRealisees} vendus</p>
                      <p className="text-sm text-muted-foreground">
                        {((article.ventesRealisees / article.quantiteAllouee) * 100).toFixed(1)}% de rotation
                      </p>
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
