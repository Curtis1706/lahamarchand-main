"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  AlertTriangle,
  Eye,
  FileCheck,
  UserPlus,
  AlertCircle,
  Settings,
  Shield,
  Database,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  RefreshCw,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

const salesData = [
  { month: "Jan", ventesDirectes: 45000, depots: 32000, droitsVerses: 8500 },
  { month: "Fév", ventesDirectes: 52000, depots: 38000, droitsVerses: 9800 },
  { month: "Mar", ventesDirectes: 48000, depots: 35000, droitsVerses: 9100 },
  { month: "Avr", ventesDirectes: 61000, depots: 42000, droitsVerses: 11200 },
  { month: "Mai", ventesDirectes: 55000, depots: 39000, droitsVerses: 10300 },
  { month: "Jun", ventesDirectes: 67000, depots: 45000, droitsVerses: 12400 },
]

const disciplineData = [
  { name: "Sciences", value: 35, color: "hsl(var(--chart-1))", concepteurs: 12, oeuvres: 45 }, // Bleu
  { name: "Littérature", value: 28, color: "hsl(var(--chart-2))", concepteurs: 18, oeuvres: 67 }, // Vert
  { name: "Arts", value: 20, color: "hsl(var(--chart-3))", concepteurs: 8, oeuvres: 23 }, // Orange
  { name: "Philosophie", value: 17, color: "hsl(var(--chart-4))", concepteurs: 6, oeuvres: 19 }, // Rouge
]

const topOeuvres = [
  { titre: "Mathématiques Appliquées", ventes: 1250, discipline: "Sciences", auteur: "Dr. Mbeng", droits: 18750 },
  { titre: "Histoire du Gabon", ventes: 980, discipline: "Histoire", auteur: "Prof. Nzé", droits: 14700 },
  { titre: "Littérature Africaine", ventes: 875, discipline: "Littérature", auteur: "Marie Obame", droits: 13125 },
  { titre: "Philosophie Moderne", ventes: 720, discipline: "Philosophie", auteur: "Jean Mba", droits: 10800 },
  { titre: "Arts Traditionnels", ventes: 650, discipline: "Arts", auteur: "Paul Ndong", droits: 9750 },
]

interface DashboardStats {
  overview: {
    totalUsers: number
    totalWorks: number
    totalOrders: number
    totalProjects: number
    totalRevenue: number
  }
  alerts: {
    pendingConcepteurs: number
    pendingProjects: number
    lowStockWorks: number
  }
  recent: {
    orders: any[]
    projects: any[]
    users: any[]
  }
  breakdown: {
    usersByRole: any[]
    ordersByStatus: any[]
  }
}

export default function PDGDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log("👑 Fetching PDG dashboard data...")
      
      const response = await fetch("/api/pdg/dashboard", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Dashboard data loaded:", data)
        setStats(data.stats)
        setError(null)
      } else {
        const errorData = await response.json()
        console.log("⚠️ Dashboard API error:", errorData)
        setError(`Erreur API: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error("❌ Dashboard fetch error:", err)
      setError(`Erreur de connexion: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground lg:text-3xl break-words">
              Tableau de bord PDG
            </h1>
            <Badge variant="destructive" className="text-xs w-fit">
              <Shield className="mr-1 h-3 w-3" />
              Super Admin
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Contrôle total de la plateforme LAHA - Gabon</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Badge variant="outline" className="w-fit text-xs">
            <Clock className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">Dernière mise à jour: il y a 5 min</span>
            <span className="sm:hidden">MAJ: 5 min</span>
          </Badge>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 sm:flex-none bg-transparent">
              <Database className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Audit Journal</span>
              <span className="sm:hidden">Audit</span>
            </Button>
            <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={fetchDashboardData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Actualiser</span>
              <span className="sm:hidden">MAJ</span>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none" asChild>
              <a href="/dashboard/pdg/rapports">
                <Eye className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Rapport complet</span>
                <span className="sm:hidden">Rapport</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(stats?.overview.totalRevenue || 0)}</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +12.5% ce mois
              </div>
              <Button size="sm" variant="ghost" className="h-6 px-2">
                <Percent className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concepteurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.overview.totalUsers.toLocaleString() || "0"}</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-muted-foreground">
                <UserPlus className="mr-1 h-3 w-3 text-blue-500" />{stats?.alerts.pendingConcepteurs || 0} demandes en attente
              </div>
              <Badge variant="secondary" className="text-xs">
                Validation
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Droits à Verser</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">45 200 FCFA</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-muted-foreground">
                <AlertCircle className="mr-1 h-3 w-3 text-orange-500" />
                16 auteurs en attente
              </div>
              <Button size="sm" variant="ghost" className="h-6 px-2">
                <DollarSign className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Œuvres Publiées</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">154</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-muted-foreground">
                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />8 en validation
              </div>
              <Badge variant="outline" className="text-xs">
                Actif
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-105 border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              <CardTitle className="text-sm sm:text-lg text-red-700">Corrections d'Opérations</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              2 opérations nécessitent une correction PDG (droit exclusif)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="destructive" className="w-full text-xs sm:text-sm" asChild>
              <a href="/dashboard/pdg/operations">
                <Shield className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Corriger les opérations
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-105 border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-700">Validation Concepteurs</CardTitle>
            </div>
            <CardDescription>3 demandes de compte concepteur nécessitent votre validation finale</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
              <a href="/dashboard/pdg/utilisateurs">
                <UserPlus className="mr-2 h-4 w-4" />
                Valider les comptes
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-105 border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg text-green-700">Paiements Droits</CardTitle>
            </div>
            <CardDescription>8 paiements de droits d'auteur en attente de validation</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <DollarSign className="mr-2 h-4 w-4" />
              Traiter les paiements
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-105 border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg text-purple-700">Paramètres Système</CardTitle>
            </div>
            <CardDescription>Configuration des taux de royalties et paramètres généraux</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Settings className="mr-2 h-4 w-4" />
              Configurer
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Ventes et Droits</CardTitle>
            <CardDescription>Ventes directes, dépôts et droits versés sur 6 mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="ventesDirectes"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                />
                <Area
                  type="monotone"
                  dataKey="depots"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                />
                <Area
                  type="monotone"
                  dataKey="droitsVerses"
                  stackId="1"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Discipline</CardTitle>
            <CardDescription>Concepteurs et œuvres par domaine</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={disciplineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {disciplineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              {disciplineData.map((discipline, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: discipline.color }}></div>
                  <div>
                    <p className="font-medium">{discipline.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {discipline.concepteurs} concepteurs • {discipline.oeuvres} œuvres
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 des Œuvres</CardTitle>
          <CardDescription>Meilleures ventes du mois avec droits d'auteur</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topOeuvres} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="titre" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="ventes" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <FileCheck className="h-8 w-8 text-blue-600" />
              <Badge variant="secondary">En attente</Badge>
            </div>
            <CardTitle className="text-blue-700">Œuvres en Validation</CardTitle>
            <CardDescription>8 œuvres soumises par les concepteurs nécessitent validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Button size="sm" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Valider
              </Button>
              <Button size="sm" variant="ghost">
                Rejeter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-green-600" />
              <Badge variant="outline">Gestion</Badge>
            </div>
            <CardTitle className="text-green-700">Gestion Utilisateurs</CardTitle>
            <CardDescription>Créer, modifier et gérer tous les comptes utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Gérer les utilisateurs
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <Badge variant="outline">Reporting</Badge>
            </div>
            <CardTitle className="text-purple-700">Situation Générale</CardTitle>
            <CardDescription>Vue complète des statistiques et performances</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Voir les statistiques
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}