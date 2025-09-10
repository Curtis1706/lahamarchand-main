"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Package, TrendingUp, DollarSign, Target, Download, AlertTriangle, Award } from "lucide-react"

const salesData = [
  { month: "Jan", ventes: 125, commission: 18750 },
  { month: "Fév", ventes: 142, commission: 21300 },
  { month: "Mar", ventes: 138, commission: 20700 },
  { month: "Avr", ventes: 165, commission: 24750 },
  { month: "Mai", ventes: 158, commission: 23700 },
  { month: "Jun", ventes: 189, commission: 28350 },
]

const stockRotation = [
  { categorie: "Sciences", stock: 45, vendu: 38, rotation: 84 },
  { categorie: "Littérature", stock: 62, vendu: 48, rotation: 77 },
  { categorie: "Histoire", stock: 38, vendu: 35, rotation: 92 },
  { categorie: "Arts", stock: 28, vendu: 19, rotation: 68 },
]

const clientTypes = [
  { name: "Étudiants", value: 45, color: "#0088FE" },
  { name: "Professionnels", value: 30, color: "#00C49F" },
  { name: "Institutions", value: 15, color: "#FFBB28" },
  { name: "Particuliers", value: 10, color: "#FF8042" },
]

export default function PartenaireStatistiques() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques Partenaire</h1>
          <p className="text-muted-foreground">Performance de vos ventes et gestion du stock alloué</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Rapport mensuel
        </Button>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alloué</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">173</div>
            <p className="text-xs text-muted-foreground">+12 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes du Mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <p className="text-xs text-muted-foreground">+19% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28,350 FCFA</div>
            <p className="text-xs text-muted-foreground">15% sur ventes validées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objectif Mensuel</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">189/200 ventes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="stock">Gestion Stock</TabsTrigger>
          <TabsTrigger value="clients">Clientèle</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Ventes et Commissions</CardTitle>
                <CardDescription>Suivi mensuel de vos performances commerciales</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventes" fill="#8884d8" name="Ventes" />
                    <Bar dataKey="commission" fill="#82ca9d" name="Commission (FCFA)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition de la Clientèle</CardTitle>
                <CardDescription>Types de clients par volume d'achat</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rotation du Stock par Catégorie</CardTitle>
              <CardDescription>Analyse de la performance de votre stock alloué</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockRotation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.categorie}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Stock: {item.stock}</span>
                        <span>Vendu: {item.vendu}</span>
                        <Badge
                          variant={item.rotation > 80 ? "default" : item.rotation > 60 ? "secondary" : "destructive"}
                        >
                          {item.rotation}% rotation
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={item.rotation} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alertes Stock</CardTitle>
                <CardDescription>Articles nécessitant un réapprovisionnement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Histoire du Gabon</p>
                      <p className="text-sm text-muted-foreground">Stock critique: 2 restants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Contes Traditionnels</p>
                      <p className="text-sm text-muted-foreground">Stock faible: 5 restants</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demandes de Réapprovisionnement</CardTitle>
                <CardDescription>Statut de vos demandes en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sciences Naturelles</p>
                      <p className="text-sm text-muted-foreground">Demandé: 20 exemplaires</p>
                    </div>
                    <Badge variant="secondary">En attente</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Littérature Gabonaise</p>
                      <p className="text-sm text-muted-foreground">Demandé: 15 exemplaires</p>
                    </div>
                    <Badge>Approuvé</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Clients du Mois</CardTitle>
                <CardDescription>Vos meilleurs clients par volume d'achat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Université Omar Bongo</p>
                        <p className="text-sm text-muted-foreground">Institution</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">45 achats</p>
                      <p className="text-sm text-muted-foreground">6,750 FCFA commission</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Lycée Léon Mba</p>
                        <p className="text-sm text-muted-foreground">Institution</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">32 achats</p>
                      <p className="text-sm text-muted-foreground">4,800 FCFA commission</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Marie Nzamba</p>
                        <p className="text-sm text-muted-foreground">Professionnelle</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">28 achats</p>
                      <p className="text-sm text-muted-foreground">4,200 FCFA commission</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Client</CardTitle>
                <CardDescription>Retours et évaluations de vos clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Satisfaction générale</span>
                    <span>4.6/5</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rapidité de service</span>
                    <span>4.4/5</span>
                  </div>
                  <Progress value={88} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Qualité des produits</span>
                    <span>4.7/5</span>
                  </div>
                  <Progress value={94} />
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Excellent service !</p>
                  <p className="text-xs text-green-600 mt-1">
                    "Toujours des livres de qualité et un service rapide" - Client récent
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="objectifs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs Mensuels</CardTitle>
                <CardDescription>Progression vers vos objectifs de juin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ventes mensuelles</span>
                    <span>189/200</span>
                  </div>
                  <Progress value={94} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Commission cible</span>
                    <span>28,350/30,000 FCFA</span>
                  </div>
                  <Progress value={94} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nouveaux clients</span>
                    <span>12/15</span>
                  </div>
                  <Progress value={80} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Récompenses et Bonus</CardTitle>
                <CardDescription>Vos achievements et primes gagnées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Partenaire du Mois</p>
                      <p className="text-sm text-muted-foreground">Bonus: 5,000 FCFA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Objectif Atteint</p>
                      <p className="text-sm text-muted-foreground">3 mois consécutifs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Meilleure Rotation</p>
                      <p className="text-sm text-muted-foreground">Catégorie Histoire</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
