"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Plus,
  Eye,
  Search,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  FileText as ProjectIcon
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Work {
  id: string
  title: string
  isbn: string
  price: number
  status: string
  discipline: string
  author: {
    id: string
    name: string
    email: string
  } | null
  sales: number
  revenue: number
  lastSale: string | null
  createdAt: string
  updatedAt: string
}

interface WorksResponse {
  works: Work[]
  stats: {
    total: number
    published: number
    submitted: number
    draft: number
    totalSales: number
    totalRevenue: number
  }
  user: {
    name: string
    email: string
    role: string
  }
}


export default function ConcepteurWorksPage() {
  const [worksData, setWorksData] = useState<WorksResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchWorksData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/concepteur/works", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch works data")
      }
      
      const data = await response.json()
      setWorksData(data)
      setError(null)
    } catch (err) {
      console.error("❌ Works fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWorksData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF"
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON_SALE":
        return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">En vente</Badge>
      case "SUBMITTED":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">En attente</Badge>
      case "DRAFT":
        return <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800">Brouillon</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ON_SALE":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "SUBMITTED":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "DRAFT":
        return <FileText className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }


  // Filtrer les œuvres
  const filteredWorks = worksData?.works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.discipline.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || work.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

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

  if (error || !worksData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: {error || 'Données non disponibles'}</p>
        <Button onClick={fetchWorksData} className="mt-4" disabled={refreshing}>
          {refreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Rechargement...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Mes Œuvres Validées</h1>
          <p className="text-muted-foreground">Vos œuvres publiées et leurs performances commerciales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/concepteur'}>
            <Eye className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button size="sm" onClick={() => window.location.href = '/dashboard/concepteur/projets'}>
            <ProjectIcon className="mr-2 h-4 w-4" />
            Mes Projets
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{worksData.stats.total}</div>
            <p className="text-xs text-muted-foreground">œuvres validées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En vente</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{worksData.stats.published}</div>
            <p className="text-xs text-muted-foreground">œuvres publiées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{worksData.stats.totalRevenue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">droits générés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{worksData.stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">exemplaires vendus</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="ON_SALE">En vente</SelectItem>
              <SelectItem value="SUBMITTED">En attente</SelectItem>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={fetchWorksData} disabled={refreshing}>
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

      {/* Works List */}
      <div className="space-y-4">
        {filteredWorks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune œuvre validée trouvée</p>
              <p className="text-sm text-muted-foreground mt-2">
                Les œuvres apparaîtront ici une fois vos projets validés par le PDG.
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <Button onClick={() => window.location.href = '/dashboard/concepteur/projets'}>
                  <ProjectIcon className="mr-2 h-4 w-4" />
                  Créer un projet
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard/concepteur'}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Voir mes projets
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredWorks.map((work) => (
            <Card key={work.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(work.status)}
                      <h3 className="text-lg font-semibold">{work.title}</h3>
                      {getStatusBadge(work.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">ISBN:</span>
                        <p className="font-medium">{work.isbn}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Discipline:</span>
                        <p className="font-medium">{work.discipline}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Prix:</span>
                        <p className="font-medium text-primary">{formatCurrency(work.price)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Auteur:</span>
                        <p className="font-medium">{work.author?.name || "Non assigné"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ventes:</span>
                        <p className="font-medium">{work.sales} exemplaires</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenus:</span>
                        <p className="font-medium text-green-600">{formatCurrency(work.revenue)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Créé: {formatDate(work.createdAt)}</span>
                      {work.lastSale && <span>Dernière vente: {formatDate(work.lastSale)}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-3 w-3" />
                      Voir détails
                    </Button>
                    <Badge variant="outline" className="text-xs">
                      Validé par PDG
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  )
}