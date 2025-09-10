"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { BarChart3, TrendingUp, TrendingDown, BookOpen, DollarSign, Award, Target } from "lucide-react"

const statistiquesGenerales = {
  oeuvresPubliees: 12,
  oeuvresEnCours: 3,
  ventesTotales: 1450,
  droitsGeneres: 2180000,
  droitsVerses: 1890000,
  tauxValidation: 89,
  classementDiscipline: 3,
  totalConcepteursDiscipline: 15,
}

const performancesMensuelles = [
  { mois: "Janvier 2024", ventes: 145, droits: 218000, nouveauxLecteurs: 67 },
  { mois: "Décembre 2023", ventes: 189, droits: 283500, nouveauxLecteurs: 89 },
  { mois: "Novembre 2023", ventes: 167, droits: 250500, nouveauxLecteurs: 78 },
  { mois: "Octobre 2023", ventes: 134, droits: 201000, nouveauxLecteurs: 56 },
  { mois: "Septembre 2023", ventes: 156, droits: 234000, nouveauxLecteurs: 72 },
]

const oeuvresPerformances = [
  {
    titre: "Mathématiques Appliquées au Gabon",
    datePublication: "2023-09-15",
    ventesTotales: 456,
    droitsGeneres: 684000,
    notesMoyennes: 4.7,
    statut: "bestseller",
  },
  {
    titre: "Physique Quantique Simplifiée",
    datePublication: "2023-11-20",
    ventesTotales: 289,
    droitsGeneres: 433500,
    notesMoyennes: 4.5,
    statut: "populaire",
  },
  {
    titre: "Chimie Organique Moderne",
    datePublication: "2024-01-10",
    ventesTotales: 123,
    droitsGeneres: 184500,
    notesMoyennes: 4.3,
    statut: "nouveau",
  },
]

const comparaisonDiscipline = {
  moyenneVentes: 1200,
  moyenneDroits: 1800000,
  moyenneOeuvres: 8,
  positionClassement: 3,
  tendance: "hausse",
}

export default function StatistiquesPage() {
  const [periodeFiltree, setPeriodeFiltree] = useState("12m")

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "bestseller":
        return <Badge className="bg-gold-100 text-gold-800 border-gold-200">Bestseller</Badge>
      case "populaire":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Populaire</Badge>
      case "nouveau":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Nouveau</Badge>
      default:
        return <Badge variant="secondary">Standard</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Mes Statistiques</h1>
          <p className="text-muted-foreground">Performances de vos œuvres et position dans la discipline Sciences</p>
        </div>
        <div className="flex items-center gap-2">
          <Label>Période</Label>
          <Select value={periodeFiltree} onValueChange={setPeriodeFiltree}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 mois</SelectItem>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="12m">12 mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Œuvres Publiées</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiquesGenerales.oeuvresPubliees}</div>
            <p className="text-xs text-muted-foreground">
              +{statistiquesGenerales.oeuvresEnCours} en cours de validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiquesGenerales.ventesTotales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Exemplaires vendus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Droits Générés</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(statistiquesGenerales.droitsGeneres / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA au total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classement Discipline</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">#{statistiquesGenerales.classementDiscipline}</div>
            <p className="text-xs text-muted-foreground">
              sur {statistiquesGenerales.totalConcepteursDiscipline} concepteurs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performances">Performances</TabsTrigger>
          <TabsTrigger value="oeuvres">Mes Œuvres</TabsTrigger>
          <TabsTrigger value="discipline">Comparaison Discipline</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="performances" className="space-y-4">
          {/* Évolution mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Évolution des Performances
              </CardTitle>
              <CardDescription>Ventes et droits générés par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead>Ventes</TableHead>
                    <TableHead>Droits Générés</TableHead>
                    <TableHead>Nouveaux Lecteurs</TableHead>
                    <TableHead>Évolution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performancesMensuelles.map((perf, index) => (
                    <TableRow key={perf.mois}>
                      <TableCell className="font-medium">{perf.mois}</TableCell>
                      <TableCell>{perf.ventes}</TableCell>
                      <TableCell>{perf.droits.toLocaleString()} FCFA</TableCell>
                      <TableCell>{perf.nouveauxLecteurs}</TableCell>
                      <TableCell>
                        {index > 0 && (
                          <div className="flex items-center gap-1">
                            {perf.ventes > performancesMensuelles[index - 1].ventes ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={`text-sm ${
                                perf.ventes > performancesMensuelles[index - 1].ventes
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {Math.abs(
                                ((perf.ventes - performancesMensuelles[index - 1].ventes) /
                                  performancesMensuelles[index - 1].ventes) *
                                  100,
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Indicateurs clés */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taux de Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{statistiquesGenerales.tauxValidation}%</div>
                <p className="text-sm text-muted-foreground mt-2">Excellent taux d'acceptation de vos soumissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Droits Versés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {((statistiquesGenerales.droitsVerses / statistiquesGenerales.droitsGeneres) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {statistiquesGenerales.droitsVerses.toLocaleString()} FCFA versés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Moyenne par Œuvre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(statistiquesGenerales.ventesTotales / statistiquesGenerales.oeuvresPubliees)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Exemplaires vendus par œuvre</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="oeuvres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performances par Œuvre</CardTitle>
              <CardDescription>Détail des performances de chacune de vos œuvres publiées</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Œuvre</TableHead>
                    <TableHead>Date Publication</TableHead>
                    <TableHead>Ventes</TableHead>
                    <TableHead>Droits Générés</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {oeuvresPerformances.map((oeuvre) => (
                    <TableRow key={oeuvre.titre}>
                      <TableCell>
                        <div className="font-medium">{oeuvre.titre}</div>
                      </TableCell>
                      <TableCell>{oeuvre.datePublication}</TableCell>
                      <TableCell>
                        <div className="font-medium">{oeuvre.ventesTotales}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{oeuvre.droitsGeneres.toLocaleString()} FCFA</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{oeuvre.notesMoyennes}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(oeuvre.statut)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discipline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Position dans la Discipline Sciences
              </CardTitle>
              <CardDescription>Comparaison avec les autres concepteurs de votre discipline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Ventes (vs moyenne discipline)</span>
                      <span className="text-sm text-green-600">+21% au-dessus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{statistiquesGenerales.ventesTotales}</div>
                      <div className="text-sm text-muted-foreground">(moy: {comparaisonDiscipline.moyenneVentes})</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Droits générés (vs moyenne)</span>
                      <span className="text-sm text-green-600">+18% au-dessus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {(statistiquesGenerales.droitsGeneres / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-muted-foreground">
                        (moy: {(comparaisonDiscipline.moyenneDroits / 1000000).toFixed(1)}M)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Classement discipline</span>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        #{comparaisonDiscipline.positionClassement}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Sur {statistiquesGenerales.totalConcepteursDiscipline} concepteurs actifs
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Tendance</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">En hausse</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Progression constante depuis 3 mois</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectifs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objectifs et Projections
              </CardTitle>
              <CardDescription>Suivi de vos objectifs et projections pour l'année</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Objectif ventes annuelles</span>
                    <span className="text-sm text-green-600">78% atteint</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>1,450 / 1,850 exemplaires</span>
                    <span>400 restants</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Objectif droits annuels</span>
                    <span className="text-sm text-blue-600">72% atteint</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>2.18M / 3M FCFA</span>
                    <span>820K restants</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Nouvelles œuvres prévues</span>
                    <span className="text-sm text-purple-600">2 / 3 planifiées</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>2 en cours de validation</span>
                    <span>1 en préparation</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Note d'information */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Statistiques en Temps Réel</h4>
              <p className="text-sm text-green-700 mt-1">
                Vos statistiques sont mises à jour automatiquement à chaque vente. Les données de droits d'auteur sont
                calculées en temps réel et les paiements sont traités selon le calendrier établi. Vous recevrez des
                notifications pour chaque étape importante.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
