"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/ui/stats-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Warehouse, Plus, Search, Eye, Download, TrendingUp, Users, Package } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const depotData = [
  { month: "Jan", depots: 32, montant: 480000 },
  { month: "Fév", depots: 28, montant: 420000 },
  { month: "Mar", depots: 35, montant: 525000 },
  { month: "Avr", depots: 42, montant: 630000 },
  { month: "Mai", depots: 39, montant: 585000 },
  { month: "Jun", depots: 45, montant: 675000 },
]

const recentDepots = [
  {
    id: "DEP001",
    partenaire: "Librairie Centrale",
    articles: 25,
    montant: 375000,
    date: "2024-01-15",
    statut: "Livré",
    representant: "Paul Mbongo",
  },
  {
    id: "DEP002",
    partenaire: "Point Lecture",
    articles: 18,
    montant: 270000,
    date: "2024-01-14",
    statut: "En préparation",
    representant: "Marie Nzé",
  },
  {
    id: "DEP003",
    partenaire: "Espace Livre",
    articles: 32,
    montant: 480000,
    date: "2024-01-13",
    statut: "Expédié",
    representant: "Paul Mbongo",
  },
]

const topPartners = [
  { nom: "Librairie Centrale", depots: 12, montant: 1800000 },
  { nom: "Point Lecture", depots: 8, montant: 1200000 },
  { nom: "Espace Livre", depots: 15, montant: 2250000 },
  { nom: "Centre Culturel", depots: 6, montant: 900000 },
]

export default function DepotsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showNewDepotDialog, setShowNewDepotDialog] = useState(false)

  const filteredDepots = recentDepots.filter((depot) => {
    const matchesSearch =
      depot.partenaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depot.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || depot.statut.toLowerCase().includes(selectedStatus)
    return matchesSearch && matchesStatus
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Livré":
        return "default"
      case "Expédié":
        return "secondary"
      case "En préparation":
        return "outline"
      case "Annulé":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Dépôts</h1>
          <p className="text-muted-foreground">Suivi des dépôts chez les partenaires</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter rapport
          </Button>
          <Dialog open={showNewDepotDialog} onOpenChange={setShowNewDepotDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau dépôt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau dépôt</DialogTitle>
                <DialogDescription>Enregistrer un dépôt chez un partenaire</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partenaire">Partenaire *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un partenaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="librairie-centrale">Librairie Centrale</SelectItem>
                        <SelectItem value="point-lecture">Point Lecture</SelectItem>
                        <SelectItem value="espace-livre">Espace Livre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="representant">Représentant *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paul-mbongo">Paul Mbongo</SelectItem>
                        <SelectItem value="marie-nze">Marie Nzé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Articles à déposer</Label>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sélectionner les articles du stock</span>
                      <Button type="button" variant="outline" size="sm">
                        Ajouter articles
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Les articles sélectionnés seront retirés du stock principal
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowNewDepotDialog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer le dépôt</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Dépôts du Mois"
          value="45"
          description="Nouveaux dépôts"
          icon={Warehouse}
          trend={{ value: 15, label: "vs mois dernier", type: "positive" }}
        />
        <StatsCard
          title="Valeur Totale"
          value="675,000 FCFA"
          description="Montant des dépôts"
          icon={TrendingUp}
          trend={{ value: 22, label: "vs mois dernier", type: "positive" }}
        />
        <StatsCard
          title="Partenaires Actifs"
          value="23"
          description="Avec dépôts en cours"
          icon={Users}
          trend={{ value: 2, label: "nouveaux", type: "positive" }}
        />
        <StatsCard
          title="Articles Déposés"
          value="1,247"
          description="Total ce mois"
          icon={Package}
          trend={{ value: 18, label: "vs mois dernier", type: "positive" }}
        />
      </div>

      {/* Charts and Top Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Depot Evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Évolution des Dépôts
            </CardTitle>
            <CardDescription>Nombre et valeur des dépôts (6 derniers mois)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={depotData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="depots" fill="hsl(var(--primary))" name="Nombre de dépôts" />
                <Bar yAxisId="right" dataKey="montant" fill="hsl(var(--accent))" name="Montant (FCFA)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Partenaires
            </CardTitle>
            <CardDescription>Partenaires les plus actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPartners.map((partner, index) => (
                <div key={partner.nom} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{partner.nom}</p>
                      <p className="text-sm text-muted-foreground">{partner.depots} dépôts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{partner.montant.toLocaleString()} FCFA</p>
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
                  placeholder="Rechercher par partenaire ou numéro de dépôt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="preparation">En préparation</SelectItem>
                <SelectItem value="expedie">Expédié</SelectItem>
                <SelectItem value="livre">Livré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Depots List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Dépôts Récents
          </CardTitle>
          <CardDescription>Liste des derniers dépôts effectués</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDepots.map((depot) => (
              <div
                key={depot.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusVariant(depot.statut)}>{depot.statut}</Badge>
                  <div>
                    <p className="font-medium">{depot.partenaire}</p>
                    <p className="text-sm text-muted-foreground">
                      {depot.id} • {depot.date} • {depot.articles} articles • Par {depot.representant}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{depot.montant.toLocaleString()} FCFA</p>
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
