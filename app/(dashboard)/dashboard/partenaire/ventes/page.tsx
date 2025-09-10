"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { DollarSign, Calendar, BarChart3, Download, Eye, Target } from "lucide-react"

const ventesRealisees = [
  {
    id: 1,
    date: "2024-02-05",
    titre: "Mathématiques Appliquées au Gabon",
    quantite: 3,
    prixUnitaire: 8500,
    commission: 15,
    montantCommission: 3825,
    statut: "validee",
    client: "Université Omar Bongo",
  },
  {
    id: 2,
    date: "2024-02-04",
    titre: "Histoire du Gabon Moderne",
    quantite: 5,
    prixUnitaire: 12000,
    commission: 15,
    montantCommission: 9000,
    statut: "validee",
    client: "Lycée Léon Mba",
  },
  {
    id: 3,
    date: "2024-02-03",
    titre: "Économie du Gabon - Perspectives",
    quantite: 2,
    prixUnitaire: 15000,
    commission: 15,
    montantCommission: 4500,
    statut: "en_attente",
    client: "École Supérieure de Commerce",
  },
  {
    id: 4,
    date: "2024-02-01",
    titre: "Littérature Gabonaise Contemporaine",
    quantite: 1,
    prixUnitaire: 7500,
    commission: 15,
    montantCommission: 1125,
    statut: "validee",
    client: "Particulier",
  },
]

const objectifsVentes = {
  mensuel: 50000,
  realise: 32450,
  pourcentage: 64.9,
  commissionsGagnees: 18450,
  commissionsEnAttente: 4500,
  ventesQuantite: 47,
  objectifQuantite: 75,
}

const performancesMensuelles = [
  { mois: "Oct 2023", ventes: 28000, commissions: 12600 },
  { mois: "Nov 2023", ventes: 35000, commissions: 15750 },
  { mois: "Déc 2023", ventes: 42000, commissions: 18900 },
  { mois: "Jan 2024", ventes: 38000, commissions: 17100 },
  { mois: "Fév 2024", ventes: 32450, commissions: 18450 },
]

export default function VentesPartenairePage() {
  const [periodeFiltree, setPeriodeFiltree] = useState("mois_courant")
  const [statutFiltre, setStatutFiltre] = useState("all")

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "validee":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Validée</Badge>
      case "en_attente":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En Attente</Badge>
      case "annulee":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const exporterRapport = () => {
    console.log("Export du rapport de ventes")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Ventes & Commissions</h1>
          <p className="text-muted-foreground">Suivi de vos performances et commissions - Librairie Nzeng-Ayong</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exporterRapport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            Rapport Détaillé
          </Button>
        </div>
      </div>

      {/* Objectifs et performances */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objectif Mensuel</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{objectifsVentes.pourcentage}%</div>
            <p className="text-xs text-muted-foreground">
              {objectifsVentes.realise.toLocaleString()} / {objectifsVentes.mensuel.toLocaleString()} FCFA
            </p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${objectifsVentes.pourcentage}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions Gagnées</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {objectifsVentes.commissionsGagnees.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">15% sur ventes validées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {objectifsVentes.commissionsEnAttente.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">Validation PDG requise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exemplaires Vendus</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{objectifsVentes.ventesQuantite}</div>
            <p className="text-xs text-muted-foreground">
              {((objectifsVentes.ventesQuantite / objectifsVentes.objectifQuantite) * 100).toFixed(1)}% de l'objectif
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ventes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ventes">Ventes Récentes</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="performances">Performances</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="ventes" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div>
                  <Label>Période</Label>
                  <Select value={periodeFiltree} onValueChange={setPeriodeFiltree}>
                    <SelectTrigger className="w-48 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mois_courant">Mois courant</SelectItem>
                      <SelectItem value="mois_dernier">Mois dernier</SelectItem>
                      <SelectItem value="trimestre">Ce trimestre</SelectItem>
                      <SelectItem value="annee">Cette année</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Select value={statutFiltre} onValueChange={setStatutFiltre}>
                    <SelectTrigger className="w-48 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="validee">Validées</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="annulee">Annulées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des ventes */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des Ventes</CardTitle>
              <CardDescription>Détail de toutes vos ventes réalisées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ventesRealisees.map((vente) => (
                  <div key={vente.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{vente.titre}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Client: {vente.client} • {new Date(vente.date).toLocaleDateString("fr-FR")}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>
                              <strong>Quantité:</strong> {vente.quantite} ex.
                            </span>
                            <span>
                              <strong>Prix unitaire:</strong> {vente.prixUnitaire.toLocaleString()} FCFA
                            </span>
                            <span className="text-green-600 font-medium">
                              <strong>Commission:</strong> {vente.montantCommission.toLocaleString()} FCFA (
                              {vente.commission}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatutBadge(vente.statut)}
                          <span className="text-lg font-bold">
                            {(vente.quantite * vente.prixUnitaire).toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir Détails
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Détail des Commissions</CardTitle>
              <CardDescription>Suivi de vos commissions par vente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ventesRealisees.map((vente) => (
                  <div
                    key={vente.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg ${
                      vente.statut === "validee" ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{vente.titre}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(vente.date).toLocaleDateString("fr-FR")} • {vente.quantite} exemplaires
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">
                        {vente.montantCommission.toLocaleString()} FCFA
                      </p>
                      <p className="text-sm text-muted-foreground">{vente.commission}% de commission</p>
                    </div>
                    {getStatutBadge(vente.statut)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Performances</CardTitle>
              <CardDescription>Historique de vos ventes et commissions sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performancesMensuelles.map((perf, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{perf.mois}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Ventes: {perf.ventes.toLocaleString()} FCFA</span>
                        <span>Commissions: {perf.commissions.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{((perf.commissions / perf.ventes) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Taux commission</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectifs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs et Cibles</CardTitle>
              <CardDescription>Vos objectifs de vente et progression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Objectif Mensuel (Chiffre d'affaires)</Label>
                  <span className="font-bold">{objectifsVentes.pourcentage}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${objectifsVentes.pourcentage}%` }} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {objectifsVentes.realise.toLocaleString()} / {objectifsVentes.mensuel.toLocaleString()} FCFA
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Objectif Quantité (Exemplaires)</Label>
                  <span className="font-bold">
                    {((objectifsVentes.ventesQuantite / objectifsVentes.objectifQuantite) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${(objectifsVentes.ventesQuantite / objectifsVentes.objectifQuantite) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {objectifsVentes.ventesQuantite} / {objectifsVentes.objectifQuantite} exemplaires
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800">Commissions Validées</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {objectifsVentes.commissionsGagnees.toLocaleString()} FCFA
                  </p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800">En Attente Validation</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    {objectifsVentes.commissionsEnAttente.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
