"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/ui/stats-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, TrendingUp, DollarSign, Users, Search, Eye, Download, Calendar, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const salesData = [
  { month: "Jan", directes: 450000, depots: 320000, total: 770000 },
  { month: "Fév", directes: 520000, depots: 380000, total: 900000 },
  { month: "Mar", directes: 480000, depots: 350000, total: 830000 },
  { month: "Avr", directes: 610000, depots: 420000, total: 1030000 },
  { month: "Mai", directes: 550000, depots: 390000, total: 940000 },
  { month: "Jun", directes: 670000, depots: 450000, total: 1120000 },
]

const recentSales = [
  {
    id: "VT001",
    type: "Vente directe",
    client: "Jean Dupont",
    articles: 3,
    montant: 45000,
    date: "2024-01-15",
    statut: "Payé",
  },
  {
    id: "VT002",
    type: "Dépôt",
    client: "Librairie Centrale",
    articles: 25,
    montant: 375000,
    date: "2024-01-14",
    statut: "Payé",
  },
  {
    id: "VT003",
    type: "Vente directe",
    client: "Marie Nzé",
    articles: 2,
    montant: 30000,
    date: "2024-01-13",
    statut: "En attente",
  },
]

const topProducts = [
  { titre: "Histoire du Gabon", ventes: 156, ca: 2340000 },
  { titre: "Mathématiques Appliquées", ventes: 89, ca: 1602000 },
  { titre: "Contes Gabonais", ventes: 134, ca: 1675000 },
  { titre: "Physique Quantique", ventes: 67, ca: 1206000 },
]

export default function VentesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedType, setSelectedType] = useState("all")

  const filteredSales = recentSales.filter((sale) => {
    const matchesSearch =
      sale.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || sale.type.toLowerCase().includes(selectedType)
    return matchesSearch && matchesType
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Payé":
        return "default"
      case "En attente":
        return "outline"
      case "Annulé":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Ventes</h1>
          <p className="text-muted-foreground">Suivi des ventes directes et dépôts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter rapport
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Période personnalisée
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Ventes du Mois"
          value="1,120,000 FCFA"
          description="Toutes ventes confondues"
          icon={ShoppingCart}
          trend={{ value: 18, label: "vs mois dernier", type: "positive" }}
        />
        <StatsCard
          title="Ventes Directes"
          value="670,000 FCFA"
          description="Ventes aux particuliers"
          icon={TrendingUp}
          trend={{ value: 22, label: "vs mois dernier", type: "positive" }}
        />
        <StatsCard
          title="Dépôts"
          value="450,000 FCFA"
          description="Ventes aux partenaires"
          icon={DollarSign}
          trend={{ value: 15, label: "vs mois dernier", type: "positive" }}
        />
        <StatsCard
          title="Clients Actifs"
          value="247"
          description="Ce mois"
          icon={Users}
          trend={{ value: 12, label: "nouveaux", type: "positive" }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Évolution des Ventes
            </CardTitle>
            <CardDescription>Ventes directes vs Dépôts (6 derniers mois)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, ""]} />
                <Bar dataKey="directes" fill="hsl(var(--primary))" name="Ventes directes" />
                <Bar dataKey="depots" fill="hsl(var(--accent))" name="Dépôts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Produits
            </CardTitle>
            <CardDescription>Meilleures ventes du mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.titre} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.titre}</p>
                      <p className="text-sm text-muted-foreground">{product.ventes} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.ca.toLocaleString()} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par client ou numéro de vente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de vente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="directe">Ventes directes</SelectItem>
                <SelectItem value="depot">Dépôts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Ventes Récentes
          </CardTitle>
          <CardDescription>Liste des dernières transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <Badge variant={sale.type === "Vente directe" ? "default" : "secondary"}>{sale.type}</Badge>
                  <div>
                    <p className="font-medium">{sale.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.id} • {sale.date} • {sale.articles} articles
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{sale.montant.toLocaleString()} FCFA</p>
                    <Badge variant={getStatusVariant(sale.statut)} className="text-xs">
                      {sale.statut}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
