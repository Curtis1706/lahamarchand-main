"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BookOpen, Award, DollarSign, Download, Target, Clock } from "lucide-react"

const disciplinePerformanceData = [
  { mois: "Jan", oeuvresCreees: 3, oeuvresValidees: 2, ventesGenerees: 45000 },
  { mois: "Fév", oeuvresCreees: 4, oeuvresValidees: 3, ventesGenerees: 52000 },
  { mois: "Mar", oeuvresCreees: 2, oeuvresValidees: 2, ventesGenerees: 38000 },
  { mois: "Avr", oeuvresCreees: 5, oeuvresValidees: 4, ventesGenerees: 68000 },
  { mois: "Mai", oeuvresCreees: 3, oeuvresValidees: 3, ventesGenerees: 55000 },
]

const validationStatusData = [
  { status: "Validées", count: 14, color: "#00C49F" },
  { status: "En cours", count: 6, color: "#FFBB28" },
  { status: "En attente", count: 3, color: "#FF8042" },
  { status: "Refusées", count: 2, color: "#FF6B6B" },
]

const disciplineComparisonData = [
  { discipline: "Sciences", mesOeuvres: 14, moyenne: 12, objectif: 18 },
  { discipline: "Littérature", mesOeuvres: 8, moyenne: 15, objectif: 20 },
  { discipline: "Arts", mesOeuvres: 12, moyenne: 10, objectif: 15 },
  { discipline: "Philosophie", mesOeuvres: 6, moyenne: 8, objectif: 12 },
]

export default function ConcepteurStatistiques() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques Concepteur</h1>
          <p className="text-muted-foreground">Performance de vos créations en Sciences - Discipline Gabon</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-blue-600">
            Sciences
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Œuvres Créées</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+3 ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Validation</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">+5% vs trimestre dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Générés</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">258 000 FCFA</div>
            <p className="text-xs text-muted-foreground">Depuis le début</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Délai Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 jours</div>
            <p className="text-xs text-muted-foreground">Validation PDG</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Mensuelle</TabsTrigger>
          <TabsTrigger value="validations">Statut Validations</TabsTrigger>
          <TabsTrigger value="comparaison">Comparaison Disciplines</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la Production</CardTitle>
              <CardDescription>Créations, validations et revenus par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={disciplinePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="oeuvresCreees" stroke="#8884d8" name="Œuvres Créées" />
                  <Line type="monotone" dataKey="oeuvresValidees" stroke="#82ca9d" name="Œuvres Validées" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Validations</CardTitle>
              <CardDescription>Statut de vos œuvres soumises</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={validationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {validationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparaison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance vs Objectifs</CardTitle>
              <CardDescription>Comparaison avec la moyenne des concepteurs par discipline</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={disciplineComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="discipline" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="mesOeuvres" fill="#8884d8" name="Mes Œuvres" />
                  <Bar dataKey="moyenne" fill="#82ca9d" name="Moyenne Discipline" />
                  <Bar dataKey="objectif" fill="#ffc658" name="Objectif" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Objectifs et progression */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Objectifs Discipline Sciences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Œuvres validées (14/18)</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Revenus générés (258k/300k FCFA)</span>
                  <span>86%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "86%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Œuvre "Physique Quantique" validée</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Première vente enregistrée</p>
                  <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-amber-50 rounded">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Révision demandée sur "Chimie Organique"</p>
                  <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
