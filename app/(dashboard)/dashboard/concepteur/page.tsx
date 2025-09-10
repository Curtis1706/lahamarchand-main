"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Plus,
  Eye,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  DollarSign,
  RefreshCw,
  AlertCircle
} from "lucide-react"

export default function ConcepteurDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("projects")
  const [dashboardData, setDashboardData] = useState<any>(null)

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      
      console.log("🎨 Fetching dashboard data...")
      
      // Récupérer les données du dashboard
      const dashboardResponse = await fetch("/api/concepteur/dashboard", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      
      console.log("🎨 Dashboard response status:", dashboardResponse.status)
      
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json()
        console.log("✅ Dashboard data loaded:", data)
        setDashboardData(data)
        setError(null)
      } else {
        const errorData = await dashboardResponse.json()
        console.log("⚠️ Dashboard API error:", errorData)
        setError(`Erreur API: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err)
      setError(`Erreur de connexion: ${err.message}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Tableau de Bord Concepteur</h1>
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Créateur d'Œuvres
            </Badge>
          </div>
          <p className="text-muted-foreground">Gérez vos projets et suivez vos œuvres validées</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/concepteur/projets/nouveau'}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau projet
          </Button>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Actualisation...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Message d'erreur ou d'information */}
      {error && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">Configuration requise</h3>
                <p className="text-orange-700 dark:text-orange-300 mt-1">{error}</p>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://github.com/your-repo/setup-instructions', '_blank')}
                  >
                    Voir les instructions
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Projets Totaux"
          value={dashboardData?.stats?.totalProjects || 0}
          description="Projets créés"
          icon={FileText}
          trend={{ value: 0, label: "% ce mois", type: "neutral" }}
        />
        <StatsCard
          title="En Attente"
          value={dashboardData?.stats?.submittedProjects || 0}
          description="Projets soumis"
          icon={Clock}
          trend={{ value: 0, label: "% soumis", type: "neutral" }}
        />
        <StatsCard
          title="Œuvres Validées"
          value={dashboardData?.stats?.publishedWorks || 0}
          description="Œuvres publiées"
          icon={CheckCircle}
          trend={{ value: 0, label: "% validées", type: "neutral" }}
        />
        <StatsCard
          title="Revenus Totaux"
          value={`${dashboardData?.stats?.totalRevenue || 0} FCFA`}
          description="Droits générés"
          icon={DollarSign}
          trend={{ value: 0, label: "% ce mois", type: "neutral" }}
        />
      </div>

      {/* Tabs pour Projets et Œuvres */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Mes Projets ({dashboardData?.stats?.totalProjects || 0})
          </TabsTrigger>
          <TabsTrigger value="works" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Mes Œuvres ({dashboardData?.stats?.totalWorks || 0})
          </TabsTrigger>
        </TabsList>

        {/* Onglet Projets */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mes Projets
              </CardTitle>
              <CardDescription>Créez et gérez vos projets en cours de conception</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun projet trouvé</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Les projets apparaîtront ici une fois la base de données configurée.
                </p>
                <Button className="mt-4" onClick={() => window.location.href = '/dashboard/concepteur/projets/nouveau'}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer votre premier projet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Œuvres */}
        <TabsContent value="works" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Mes Œuvres Validées
              </CardTitle>
              <CardDescription>Vos œuvres publiées et leurs performances commerciales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune œuvre validée trouvée</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Les œuvres apparaîtront ici une fois vos projets validés par le PDG.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}