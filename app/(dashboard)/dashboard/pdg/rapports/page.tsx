"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/ui/stats-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  FileText,
  PieChart,
  LineChart,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const salesByDiscipline = [
  { discipline: "Sciences", ventes: 450, ca: 6750000, couleur: "hsl(var(--chart-1))" }, // Bleu
  { discipline: "Littérature", ventes: 320, ca: 4800000, couleur: "hsl(var(--chart-2))" }, // Vert
  { discipline: "Histoire", ventes: 280, ca: 4200000, couleur: "hsl(var(--chart-5))" }, // Violet
  { discipline: "Arts", ventes: 180, ca: 2700000, couleur: "hsl(var(--chart-3))" }, // Orange
  { discipline: "Philosophie", ventes: 120, ca: 1800000, couleur: "hsl(var(--chart-4))" }, // Rouge
]

const monthlyEvolution = [
  { month: "Jan", ventes: 1200, ca: 18000000, droits: 2700000, nouveauxClients: 45 },
  { month: "Fév", ventes: 1350, ca: 20250000, droits: 3037500, nouveauxClients: 52 },
  { month: "Mar", ventes: 1180, ca: 17700000, droits: 2655000, nouveauxClients: 38 },
  { month: "Avr", ventes: 1520, ca: 22800000, droits: 3420000, nouveauxClients: 67 },
  { month: "Mai", ventes: 1420, ca: 21300000, droits: 3195000, nouveauxClients: 58 },
  { month: "Jun", ventes: 1680, ca: 25200000, droits: 3780000, nouveauxClients: 73 },
]

const topAuthors = [
  { nom: "Jean Mbongo", oeuvres: 8, ventes: 456, droits: 6840000 },
  { nom: "Marie Nzé", oeuvres: 5, ventes: 324, droits: 4860000 },
  { nom: "Paul Obame", oeuvres: 12, ventes: 289, droits: 4335000 },
  { nom: "Sophie Mba", oeuvres: 3, ventes: 178, droits: 2670000 },
]

const partnerPerformance = [
  { nom: "Librairie Centrale", depots: 45, ventes: 1250, ca: 18750000 },
  { nom: "Point Lecture", depots: 32, ventes: 890, ca: 13350000 },
  { nom: "Espace Livre", depots: 28, ventes: 760, ca: 11400000 },
  { nom: "Centre Culturel", depots: 18, ventes: 520, ca: 7800000 },
]

export default function RapportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedDiscipline, setSelectedDiscipline] = useState("all")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rapports et Analyses</h1>
          <p className="text-muted-foreground">Tableaux de bord et statistiques détaillées</p>
        </div>
        <div className="flex gap-2">
          <DatePickerWithRange className="w-auto" />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Rapport personnalisé
          </Button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="CA Total"
          value="25,200,000 FCFA"
          description="Ce mois"
          icon={DollarSign}
          trend={{ value: 18, label: "vs mois dernier", type: "positive" }}
        />
        <StatsCard
          title="Ventes Totales"
          value="1,680"
          description="Exemplaires vendus"
          icon={TrendingUp}
          trend={{ value: 15, label: "vs mois dernier", type: "positive" }}
        />
        <StatsCard
          title="Droits Versés"
          value="3,780,000 FCFA"
          description="Aux auteurs/concepteurs"
          icon={Package}
          trend={{ value: 22, label: "vs mois dernier", type: "positive" }}
        />
        <StatsCard
          title="Nouveaux Clients"
          value="73"
          description="Ce mois"
          icon={Users}
          trend={{ value: 26, label: "vs mois dernier", type: "positive" }}
        />
      </div>

      <Tabs defaultValue="global" className="space-y-4">
        <TabsList>
          <TabsTrigger value="global" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vue Globale
          </TabsTrigger>
          <TabsTrigger value="disciplines" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Par Discipline
          </TabsTrigger>
          <TabsTrigger value="authors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Auteurs/Concepteurs
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Partenaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          {/* Evolution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Évolution du Chiffre d'Affaires
                </CardTitle>
                <CardDescription>Progression mensuelle (6 derniers mois)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, ""]} />
                    <Area
                      type="monotone"
                      dataKey="ca"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ventes et Nouveaux Clients
                </CardTitle>
                <CardDescription>Corrélation ventes/acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={monthlyEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="ventes"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Ventes"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="nouveauxClients"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      name="Nouveaux clients"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Droits Evolution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Évolution des Droits d'Auteur
              </CardTitle>
              <CardDescription>Montants versés aux créateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, ""]} />
                  <Bar dataKey="droits" fill="hsl(var(--success))" name="Droits versés" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplines" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Discipline Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Répartition par Discipline
                </CardTitle>
                <CardDescription>Ventes par domaine</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={salesByDiscipline}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="ventes"
                    >
                      {salesByDiscipline.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.couleur} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {salesByDiscipline.map((item) => (
                    <div key={item.discipline} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.couleur }} />
                      <span className="text-sm">{item.discipline}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance by Discipline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance par Discipline
                </CardTitle>
                <CardDescription>Chiffre d'affaires détaillé</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByDiscipline} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="discipline" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, ""]} />
                    <Bar dataKey="ca" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Discipline Details */}
          <Card>
            <CardHeader>
              <CardTitle>Détails par Discipline</CardTitle>
              <CardDescription>Performance détaillée de chaque domaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByDiscipline.map((discipline) => (
                  <div key={discipline.discipline} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: discipline.couleur }} />
                      <div>
                        <h4 className="font-medium">{discipline.discipline}</h4>
                        <p className="text-sm text-muted-foreground">{discipline.ventes} ventes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{discipline.ca.toLocaleString()} FCFA</p>
                      <p className="text-sm text-muted-foreground">
                        {((discipline.ca / salesByDiscipline.reduce((sum, d) => sum + d.ca, 0)) * 100).toFixed(1)}% du
                        CA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Auteurs/Concepteurs
              </CardTitle>
              <CardDescription>Classement par performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAuthors.map((author, index) => (
                  <div key={author.nom} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{author.nom}</h4>
                        <p className="text-sm text-muted-foreground">
                          {author.oeuvres} œuvres • {author.ventes} ventes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{author.droits.toLocaleString()} FCFA</p>
                      <p className="text-sm text-muted-foreground">Droits générés</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Performance des Partenaires
              </CardTitle>
              <CardDescription>Analyse des dépôts et ventes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerPerformance.map((partner, index) => (
                  <div key={partner.nom} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{partner.nom}</h4>
                        <p className="text-sm text-muted-foreground">
                          {partner.depots} dépôts • {partner.ventes} ventes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{partner.ca.toLocaleString()} FCFA</p>
                      <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
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
