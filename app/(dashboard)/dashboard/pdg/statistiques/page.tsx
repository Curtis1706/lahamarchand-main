"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, DollarSign, Download, Target } from "lucide-react"

const statistiquesGenerales = {
  ventesTotales: 2450000,
  croissanceMensuelle: 12.5,
  utilisateursActifs: 1247,
  nouveauxUtilisateurs: 89,
  commandesTotales: 456,
  commandesEnCours: 23,
  stockTotal: 15420,
  stockFaible: 45,
  disciplinesActives: 8,
  auteursActifs: 156,
  partenairesActifs: 34,
  representantsActifs: 12,
}

const ventesParDiscipline = [
  { discipline: "Sciences", ventes: 650000, pourcentage: 26.5, croissance: 15.2 },
  { discipline: "Littérature", ventes: 580000, pourcentage: 23.7, croissance: 8.9 },
  { discipline: "Histoire", ventes: 420000, pourcentage: 17.1, croissance: 22.1 },
  { discipline: "Économie", ventes: 380000, pourcentage: 15.5, croissance: -3.2 },
  { discipline: "Arts", ventes: 250000, pourcentage: 10.2, croissance: 45.6 },
  { discipline: "Philosophie", ventes: 170000, pourcentage: 6.9, croissance: 12.8 },
]

const performancesRegionales = [
  { region: "Libreville", ventes: 1200000, commandes: 234, partenaires: 15, croissance: 18.5 },
  { region: "Port-Gentil", ventes: 680000, commandes: 128, partenaires: 8, croissance: 12.3 },
  { region: "Franceville", ventes: 320000, commandes: 67, partenaires: 6, croissance: 8.7 },
  { region: "Oyem", ventes: 250000, commandes: 27, partenaires: 5, croissance: 25.4 },
]

const indicateursFinanciers = {
  chiffreAffaires: 2450000,
  droitsAuteurs: 367500,
  commissionsPartenaires: 122500,
  margesBrutes: 1960000,
  beneficeNet: 1470000,
  tauxMarge: 80.0,
}

export default function StatistiquesPDGPage() {
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState("mois_courant")
  const [typeRapport, setTypeRapport] = useState("complet")

  const exporterRapport = () => {
    console.log(`Export du rapport ${typeRapport} pour la période ${periodeSelectionnee}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Statistiques Générales</h1>
          <p className="text-muted-foreground">Vue d'ensemble complète de la plateforme Gabon - Accès PDG</p>
        </div>
        <div className="flex gap-2">
          <Select value={periodeSelectionnee} onValueChange={setPeriodeSelectionnee}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mois_courant">Mois courant</SelectItem>
              <SelectItem value="mois_dernier">Mois dernier</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exporterRapport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistiquesGenerales.ventesTotales.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-green-600">+{statistiquesGenerales.croissanceMensuelle}% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statistiquesGenerales.utilisateursActifs}</div>
            <p className="text-xs text-blue-600">+{statistiquesGenerales.nouveauxUtilisateurs} nouveaux</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{statistiquesGenerales.commandesTotales}</div>
            <p className="text-xs text-purple-600">{statistiquesGenerales.commandesEnCours} en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statistiquesGenerales.stockTotal}</div>
            <p className="text-xs text-orange-600">{statistiquesGenerales.stockFaible} en stock faible</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ventes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ventes">Ventes</TabsTrigger>
          <TabsTrigger value="disciplines">Disciplines</TabsTrigger>
          <TabsTrigger value="regions">Régions</TabsTrigger>
          <TabsTrigger value="financier">Financier</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="ventes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Ventes</CardTitle>
                <CardDescription>Performance mensuelle des ventes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Janvier 2024</span>
                    <span className="font-medium">2,180,000 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Février 2024</span>
                    <span className="font-medium text-green-600">2,450,000 FCFA</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Croissance:</strong> +12.5% par rapport au mois précédent
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Ventes</CardTitle>
                <CardDescription>Livres les plus vendus ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Histoire du Gabon Moderne</p>
                      <p className="text-sm text-muted-foreground">Prof. Jean Obame</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">156 ex.</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mathématiques Appliquées</p>
                      <p className="text-sm text-muted-foreground">Dr. Marie Nzamba</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">134 ex.</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Économie du Gabon</p>
                      <p className="text-sm text-muted-foreground">Dr. Paul Mba</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">98 ex.</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disciplines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Discipline</CardTitle>
              <CardDescription>Analyse des ventes par domaine de connaissance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ventesParDiscipline.map((discipline, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{discipline.discipline}</h4>
                        <span className="text-lg font-bold">{discipline.ventes.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{discipline.pourcentage}% du total</span>
                        <span
                          className={`font-medium ${discipline.croissance > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {discipline.croissance > 0 ? "+" : ""}
                          {discipline.croissance}%
                        </span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${discipline.pourcentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Régionale</CardTitle>
              <CardDescription>Analyse des ventes par région du Gabon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performancesRegionales.map((region, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{region.region}</h4>
                        <span className="text-lg font-bold">{region.ventes.toLocaleString()} FCFA</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Commandes</p>
                          <p className="font-medium">{region.commandes}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Partenaires</p>
                          <p className="font-medium">{region.partenaires}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Croissance</p>
                          <p className="font-medium text-green-600">+{region.croissance}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financier" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Indicateurs Financiers</CardTitle>
                <CardDescription>Performance financière globale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chiffre d'affaires</span>
                    <span className="font-bold text-green-600">
                      {indicateursFinanciers.chiffreAffaires.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Droits d'auteurs versés</span>
                    <span className="font-medium">{indicateursFinanciers.droitsAuteurs.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Commissions partenaires</span>
                    <span className="font-medium">
                      {indicateursFinanciers.commissionsPartenaires.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium">Bénéfice net</span>
                    <span className="font-bold text-green-600">
                      {indicateursFinanciers.beneficeNet.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Taux de marge:</strong> {indicateursFinanciers.tauxMarge}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Revenus</CardTitle>
                <CardDescription>Distribution des revenus par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Marges brutes</span>
                      <span className="text-sm font-medium">80%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Droits d'auteurs</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Commissions</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "5%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utilisateurs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concepteurs</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">156</div>
                <p className="text-xs text-muted-foreground">8 disciplines actives</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auteurs</CardTitle>
                <BookOpen className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">89</div>
                <p className="text-xs text-muted-foreground">Actifs ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partenaires</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">34</div>
                <p className="text-xs text-muted-foreground">4 régions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">1,247</div>
                <p className="text-xs text-muted-foreground">+89 ce mois</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activité des Utilisateurs</CardTitle>
              <CardDescription>Engagement par type d'utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Représentants</p>
                    <p className="text-sm text-muted-foreground">12 actifs • 4 régions couvertes</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">100% actifs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Concepteurs par discipline</p>
                    <p className="text-sm text-muted-foreground">156 concepteurs • 8 disciplines</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">87% actifs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Partenaires libraires</p>
                    <p className="text-sm text-muted-foreground">34 partenaires • Stock alloué</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">94% actifs</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
