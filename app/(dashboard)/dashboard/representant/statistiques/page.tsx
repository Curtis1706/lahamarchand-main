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
import { TrendingUp, Users, Package, ShoppingCart, Eye, Download, AlertCircle } from "lucide-react"

const partnerPerformanceData = [
  { name: "Libreville Centre", ventes: 45000, commandes: 120, partenaires: 8 },
  { name: "Port-Gentil", ventes: 32000, commandes: 85, partenaires: 6 },
  { name: "Franceville", ventes: 28000, commandes: 75, partenaires: 5 },
  { name: "Oyem", ventes: 22000, commandes: 60, partenaires: 4 },
  { name: "Moanda", ventes: 18000, commandes: 45, partenaires: 3 },
]

const monthlyTrendsData = [
  { mois: "Jan", ventes: 125000, commandes: 320, nouveauxPartenaires: 2 },
  { mois: "Fév", ventes: 138000, commandes: 365, nouveauxPartenaires: 3 },
  { mois: "Mar", ventes: 142000, commandes: 380, nouveauxPartenaires: 1 },
  { mois: "Avr", ventes: 155000, commandes: 410, nouveauxPartenaires: 4 },
  { mois: "Mai", ventes: 148000, commandes: 395, nouveauxPartenaires: 2 },
]

const disciplineDistribution = [
  { name: "Sciences", value: 35, color: "#0088FE" },
  { name: "Littérature", value: 28, color: "#00C49F" },
  { name: "Arts", value: 20, color: "#FFBB28" },
  { name: "Philosophie", value: 17, color: "#FF8042" },
]

export default function RepresentantStatistiques() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques Représentant</h1>
          <p className="text-muted-foreground">Vue d'ensemble des performances de votre réseau de partenaires</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Lecture seule
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partenaires Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26</div>
            <p className="text-xs text-muted-foreground">+3 ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">608 000 FCFA</div>
            <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes Traitées</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,570</div>
            <p className="text-xs text-muted-foreground">+8% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Distribué</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,340</div>
            <p className="text-xs text-muted-foreground">Unités ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Partenaires</TabsTrigger>
          <TabsTrigger value="tendances">Tendances Mensuelles</TabsTrigger>
          <TabsTrigger value="disciplines">Répartition Disciplines</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Zone</CardTitle>
              <CardDescription>Ventes et commandes par zone géographique</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={partnerPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ventes" fill="#8884d8" name="Ventes (FCFA)" />
                  <Bar dataKey="commandes" fill="#82ca9d" name="Commandes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
              <CardDescription>Tendances des ventes et nouveaux partenaires</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ventes" stroke="#8884d8" name="Ventes (FCFA)" />
                  <Line type="monotone" dataKey="commandes" stroke="#82ca9d" name="Commandes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Discipline</CardTitle>
              <CardDescription>Distribution des ventes par domaine de contenu</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={disciplineDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {disciplineDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alertes et notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Alertes Réseau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div>
                <p className="font-medium">Stock faible chez 3 partenaires</p>
                <p className="text-sm text-muted-foreground">Libreville Centre, Port-Gentil, Oyem</p>
              </div>
              <Button variant="outline" size="sm">
                Voir détails
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">2 nouvelles demandes de partenariat</p>
                <p className="text-sm text-muted-foreground">En attente de validation PDG</p>
              </div>
              <Button variant="outline" size="sm">
                Traiter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
