"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Search, 
  BookOpen, 
  BarChart3, 
  Eye,
  RefreshCw
} from "lucide-react"

interface Work {
  id: string
  title: string
  isbn: string | null
  price: number
  status: string
  discipline: string
  conceptor: string
  createdAt: string
  sales: {
    total: number
    revenue: number
  }
  royalties: {
    total: number
    paid: number
    pending: number
    rate: number
  }
  lastPayment: {
    amount: number
    date: string
    paid: boolean
  } | null
  nextPayment: {
    amount: number
    date: string
    paid: boolean
  } | null
}

interface WorksResponse {
  works: Work[]
  stats: {
    totalWorks: number
    publishedWorks: number
    submittedWorks: number
    acceptedWorks: number
    totalSales: number
    totalRevenue: number
    totalRoyalties: number
    paidRoyalties: number
    pendingRoyalties: number
  }
}

export default function VentesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [works, setWorks] = useState<Work[]>([])
  const [stats, setStats] = useState<WorksResponse["stats"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)

  const fetchWorks = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/author/works", {
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
      
      const data: WorksResponse = await response.json()
      setWorks(data.works)
      setStats(data.stats)
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
    fetchWorks()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF"
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_SALE":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ON_SALE": return "En vente"
      case "ACCEPTED": return "Accepté"
      case "SUBMITTED": return "Soumis"
      default: return status
    }
  }

  const filteredWorks = works.filter(work => 
    work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (work.isbn && work.isbn.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: {error || 'Données non disponibles'}</p>
        <Button onClick={fetchWorks} className="mt-4" disabled={refreshing}>
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Œuvres & Ventes</h1>
          <p className="text-muted-foreground">Consultez les ventes de vos œuvres publiées et leurs performances (lecture seule)</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchWorks} variant="outline" disabled={refreshing}>
            {refreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Œuvres</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedWorks} en vente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">Exemplaires vendus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Droits Générés</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRoyalties)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.pendingRoyalties)} en attente
            </p>
          </CardContent>
        </Card>
      </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Recherche et Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                  placeholder="Rechercher par titre, discipline, ISBN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ON_SALE">En vente</SelectItem>
                <SelectItem value="ACCEPTED">Accepté</SelectItem>
                <SelectItem value="SUBMITTED">Soumis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

      {/* Works Table */}
          <Card>
            <CardHeader>
          <CardTitle>Mes Œuvres ({filteredWorks.length})</CardTitle>
          <CardDescription>Liste de toutes vos œuvres avec leurs performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Œuvre</TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Ventes</TableHead>
                  <TableHead>Revenus</TableHead>
                  <TableHead>Droits</TableHead>
                  <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                {filteredWorks.map((work) => (
                  <TableRow key={work.id}>
                        <TableCell>
                          <div>
                        <div className="font-medium">{work.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {work.isbn || "ISBN non assigné"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Créé le {formatDate(work.createdAt)}
                        </div>
                          </div>
                        </TableCell>
                        <TableCell>
                      <Badge variant="outline">{work.discipline}</Badge>
                        </TableCell>
                        <TableCell>
                      <Badge className={getStatusColor(work.status)}>
                        {getStatusText(work.status)}
                      </Badge>
                        </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(work.price)}
                        </TableCell>
                        <TableCell>
                      <div className="text-center font-semibold">{work.sales.total}</div>
                        </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(work.sales.revenue)}
                        </TableCell>
                        <TableCell>
                      <div className="space-y-1">
                          <div className="font-semibold text-green-600">
                          {formatCurrency(work.royalties.total)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(work.royalties.pending)} en attente
                        </div>
                          </div>
                        </TableCell>
                        <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedWork(work)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedWork?.title}</DialogTitle>
                              <DialogDescription>
                                Détails complets de l'œuvre
                              </DialogDescription>
                            </DialogHeader>
                            {selectedWork && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">ISBN</label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedWork.isbn || "Non assigné"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Discipline</label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedWork.discipline}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Prix</label>
                                    <p className="text-sm text-muted-foreground">
                                      {formatCurrency(selectedWork.price)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Statut</label>
                                    <Badge className={getStatusColor(selectedWork.status)}>
                                      {getStatusText(selectedWork.status)}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2">Performance</h4>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold">{selectedWork.sales.total}</div>
                                      <div className="text-sm text-muted-foreground">Ventes</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold">{formatCurrency(selectedWork.sales.revenue)}</div>
                                      <div className="text-sm text-muted-foreground">Revenus</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-green-600">{formatCurrency(selectedWork.royalties.total)}</div>
                                      <div className="text-sm text-muted-foreground">Droits</div>
                                    </div>
                                  </div>
                                </div>
                                {selectedWork.lastPayment && (
                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Dernier Paiement</h4>
                                    <div className="flex justify-between">
                                      <span>{formatCurrency(selectedWork.lastPayment.amount)}</span>
                                      <span className="text-muted-foreground">
                                        {formatDate(selectedWork.lastPayment.date)}
                            </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
    </div>
  )
}