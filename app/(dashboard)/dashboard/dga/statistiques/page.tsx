"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Users,
  ShoppingCart,
  Package,
  Download,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react"

export default function StatistiquesDGAPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("mois")
  const [selectedZone, setSelectedZone] = useState("all")

  // Mock data for statistics
  const statsGenerales = {
    totalGrossistes: 25,
    grossistesActifs: 22,
    commandesTotal: 156,
    chiffreAffaires: 12500000,
    croissanceGrossistes: 12.5,
    croissanceCommandes: 8.3,
    croissanceCA: 15.7,
  }

  const statsParZone = [
    {
      zone: "Sud",
      grossistes: 15,
      commandes: 98,
      chiffreAffaires: 7800000,
      croissance: 18.2,
    },
    {
      zone: "Nord",
      grossistes: 7,
      commandes: 45,
      chiffreAffaires: 3600000,
      croissance: 12.1,
    },
    {
      zone: "Centre",
      grossistes: 3,
      commandes: 13,
      chiffreAffaires: 1100000,
      croissance: 5.8,
    },
  ]

  const topGrossistes = [
    {
      nom: "Librairie Centrale du Bénin",
      zone: "Sud",
      commandes: 25,
      chiffreAffaires: 2500000,
      croissance: 22.5,
    },
    {
      nom: "Distributeur Éducatif Ouest",
      zone: "Sud",
      commandes: 18,
      chiffreAffaires: 1800000,
      croissance: 15.3,
    },
    {
      nom: "Centre de Distribution Nord",
      zone: "Nord",
      commandes: 12,
      chiffreAffaires: 1200000,
      croissance: 8.7,
    },
    {
      nom: "Librairie du Plateau",
      zone: "Sud",
      commandes: 8,
      chiffreAffaires: 800000,
      croissance: 12.1,
    },
    {
      nom: "Librairie Universitaire",
      zone: "Sud",
      commandes: 5,
      chiffreAffaires: 500000,
      croissance: 3.2,
    },
  ]

  const evolutionMensuelle = [
    { mois: "Jan 2024", commandes: 45, chiffreAffaires: 3500000, grossistes: 20 },
    { mois: "Fév 2024", commandes: 52, chiffreAffaires: 4100000, grossistes: 22 },
    { mois: "Mar 2024", commandes: 48, chiffreAffaires: 3800000, grossistes: 21 },
    { mois: "Avr 2024", commandes: 61, chiffreAffaires: 4800000, grossistes: 23 },
    { mois: "Mai 2024", commandes: 58, chiffreAffaires: 4600000, grossistes: 24 },
    { mois: "Juin 2024", commandes: 67, chiffreAffaires: 5200000, grossistes: 25 },
  ]

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (growth < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <TrendingUp className="h-4 w-4 text-gray-600" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) {
      return "text-green-600"
    } else if (growth < 0) {
      return "text-red-600"
    }
    return "text-gray-600"
  }

  const exporterRapport = () => {
    console.log("Exportation du rapport DGA...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques DGA</h1>
          <p className="text-muted-foreground">Analyse des performances des grossistes et librairies</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exporterRapport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter Rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grossistes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.totalGrossistes}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getGrowthIcon(statsGenerales.croissanceGrossistes)}
              <span className={getGrowthColor(statsGenerales.croissanceGrossistes)}>
                +{statsGenerales.croissanceGrossistes}%
              </span>
              <span>vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grossistes Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statsGenerales.grossistesActifs}</div>
            <p className="text-xs text-muted-foreground">
              {((statsGenerales.grossistesActifs / statsGenerales.totalGrossistes) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes Total</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.commandesTotal}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getGrowthIcon(statsGenerales.croissanceCommandes)}
              <span className={getGrowthColor(statsGenerales.croissanceCommandes)}>
                +{statsGenerales.croissanceCommandes}%
              </span>
              <span>vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.chiffreAffaires.toLocaleString()} FCFA</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getGrowthIcon(statsGenerales.croissanceCA)}
              <span className={getGrowthColor(statsGenerales.croissanceCA)}>
                +{statsGenerales.croissanceCA}%
              </span>
              <span>vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="zones">Par Zone</TabsTrigger>
          <TabsTrigger value="grossistes">Top Grossistes</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Grossistes</CardTitle>
                <CardDescription>Distribution par statut</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Actifs</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{statsGenerales.grossistesActifs}</div>
                      <div className="text-sm text-muted-foreground">
                        {((statsGenerales.grossistesActifs / statsGenerales.totalGrossistes) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span>En Attente</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{statsGenerales.totalGrossistes - statsGenerales.grossistesActifs}</div>
                      <div className="text-sm text-muted-foreground">
                        {(((statsGenerales.totalGrossistes - statsGenerales.grossistesActifs) / statsGenerales.totalGrossistes) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Mensuelle</CardTitle>
                <CardDescription>Indicateurs clés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Commandes moyennes par grossiste</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {(statsGenerales.commandesTotal / statsGenerales.grossistesActifs).toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>CA moyen par grossiste</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {(statsGenerales.chiffreAffaires / statsGenerales.grossistesActifs).toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Panier moyen</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {(statsGenerales.chiffreAffaires / statsGenerales.commandesTotal).toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Zone</CardTitle>
              <CardDescription>Analyse géographique des performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsParZone.map((zone) => (
                  <div key={zone.zone} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Zone {zone.zone}</div>
                        <div className="text-sm text-muted-foreground">{zone.grossistes} grossistes</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{zone.commandes} commandes</div>
                      <div className="text-sm text-muted-foreground">
                        {zone.chiffreAffaires.toLocaleString()} FCFA
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getGrowthColor(zone.croissance)}`}>
                        +{zone.croissance}%
                      </div>
                      <div className="text-sm text-muted-foreground">Croissance</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grossistes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Grossistes</CardTitle>
              <CardDescription>Classement par chiffre d'affaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topGrossistes.map((grossiste, index) => (
                  <div key={grossiste.nom} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{grossiste.nom}</div>
                        <div className="text-sm text-muted-foreground">Zone {grossiste.zone}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{grossiste.commandes} commandes</div>
                      <div className="text-sm text-muted-foreground">
                        {grossiste.chiffreAffaires.toLocaleString()} FCFA
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getGrowthColor(grossiste.croissance)}`}>
                        +{grossiste.croissance}%
                      </div>
                      <div className="text-sm text-muted-foreground">Croissance</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
              <CardDescription>Progression des indicateurs clés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evolutionMensuelle.map((mois) => (
                  <div key={mois.mois} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="font-medium">{mois.mois}</div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-semibold">{mois.commandes}</div>
                        <div className="text-xs text-muted-foreground">Commandes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{mois.chiffreAffaires.toLocaleString()} FCFA</div>
                        <div className="text-xs text-muted-foreground">CA</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{mois.grossistes}</div>
                        <div className="text-xs text-muted-foreground">Grossistes</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Information :</strong> Ces statistiques concernent exclusivement les grossistes et librairies 
          gérés par la DGA. La DGA ne peut pas vendre aux écoles directement. Tous les grossistes sont 
          obligatoirement rattachés à son compte et disposent d'une grille tarifaire spécifique.
        </AlertDescription>
      </Alert>
    </div>
  )
}
