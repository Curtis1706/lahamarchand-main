"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Package,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  User,
  Hash,
  DollarSign,
  ShoppingCart,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Work {
  id: string
  title: string
  isbn: string
  price: number
  tva: number
  stock: number
  minStock: number
  maxStock: number | null
  status: string
  publishedAt: string
  discipline: {
    id: string
    name: string
  }
  author: {
    id: string
    name: string
    email: string
  } | null
  concepteur: {
    id: string
    name: string
    email: string
  } | null
  totalValue: number
  stockStatus: "available" | "low" | "out"
}

interface StockData {
  works: Work[]
  summary: {
    totalWorks: number
    totalStock: number
    totalValue: number
    lowStockCount: number
    outOfStockCount: number
    averageStock: number
    averagePrice: number
  }
  disciplineStats: Array<{
    discipline: string
    count: number
    totalStock: number
    totalValue: number
    lowStock: number
    percentage: number
  }>
  topWorksByStock: Array<{
    id: string
    title: string
    stock: number
    minStock: number
    price: number
    discipline: string
    author: string
    totalValue: number
    stockStatus: "available" | "low" | "out"
  }>
}

export default function RepresentantStockConsultation() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [disciplineFilter, setDisciplineFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)

  const fetchStockData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pdg/stock')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données de stock')
      }
      
      const data: StockData = await response.json()
      setStockData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching stock data:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()
  }, [])

  const getStockBadgeVariant = (status: string) => {
    switch (status) {
      case "available": return "default"
      case "low": return "secondary"
      case "out": return "destructive"
      default: return "secondary"
    }
  }

  const getStockLabel = (status: string) => {
    switch (status) {
      case "available": return "Disponible"
      case "low": return "Stock faible"
      case "out": return "Rupture"
      default: return status
    }
  }

  const filteredWorks = stockData?.works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDiscipline = disciplineFilter === "all" || work.discipline.name === disciplineFilter
    
    let matchesStock = true
    if (stockFilter === "available") matchesStock = work.stockStatus === "available"
    else if (stockFilter === "low") matchesStock = work.stockStatus === "low"
    else if (stockFilter === "out") matchesStock = work.stockStatus === "out"
    
    return matchesSearch && matchesDiscipline && matchesStock
  }) || []

  const uniqueDisciplines = [...new Set(stockData?.works.map(w => w.discipline.name) || [])]

  const openViewDialog = (work: Work) => {
    setSelectedWork(work)
    setIsViewDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Erreur de chargement</p>
            <Button onClick={fetchStockData} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Consultation du Stock</h1>
          <p className="text-muted-foreground">Consultez le stock disponible pour vos ventes (lecture seule)</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/representant/commandes'}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Créer une commande
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Articles</p>
                <p className="text-2xl font-bold">{stockData?.summary.totalWorks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Stock Total</p>
                <p className="text-2xl font-bold">{stockData?.summary.totalStock || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Stock Faible</p>
                <p className="text-2xl font-bold">{stockData?.summary.lowStockCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valeur Totale</p>
                <p className="text-2xl font-bold">
                  {stockData?.summary.totalValue.toLocaleString() || "0"} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par titre, auteur ou ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Discipline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes disciplines</SelectItem>
            {uniqueDisciplines.map(discipline => (
              <SelectItem key={discipline} value={discipline}>{discipline}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="low">Stock faible</SelectItem>
            <SelectItem value="out">Rupture</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtres avancés
        </Button>
      </div>

      {/* Liste des articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Articles en Stock ({filteredWorks.length})
          </CardTitle>
          <CardDescription>Liste de tous les articles disponibles pour vos ventes</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredWorks.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucun article trouvé</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || disciplineFilter !== "all" || stockFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Aucun article disponible"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorks.map((work) => (
                <div key={work.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{work.title}</h4>
                        <Badge variant={getStockBadgeVariant(work.stockStatus)}>
                          {getStockLabel(work.stockStatus)}
                        </Badge>
                        {work.stockStatus === "low" && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Stock faible
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground md:grid-cols-4">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {work.author?.name || "Inconnu"}
                        </div>
                        <div>{work.discipline.name}</div>
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {work.isbn}
                        </div>
                        <div>TVA: {work.tva * 100}%</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {work.price.toLocaleString()} FCFA
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {work.stock} unités
                        </div>
                        <div>Stock min: {work.minStock} unités</div>
                        <div>Valeur: {work.totalValue.toLocaleString()} FCFA</div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => openViewDialog(work)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.location.href = '/dashboard/representant/commandes'}
                        disabled={work.stock === 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Commander
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top œuvres par stock */}
      {stockData?.topWorksByStock.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Œuvres par Stock
            </CardTitle>
            <CardDescription>Les œuvres avec le plus de stock disponible</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockData.topWorksByStock.slice(0, 6).map((work, index) => (
                <div key={work.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <Badge variant={getStockBadgeVariant(work.stockStatus)}>
                      {work.stock} exemplaires
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-1">{work.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {work.author} • {work.discipline}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{work.price.toLocaleString()} FCFA</span>
                    <span className="text-xs text-muted-foreground">
                      Valeur: {work.totalValue.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques par discipline */}
      {stockData?.disciplineStats.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Répartition par Discipline
            </CardTitle>
            <CardDescription>Distribution des œuvres par discipline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockData.disciplineStats.map((stat) => (
                <div key={stat.discipline} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{stat.discipline}</h4>
                    <Badge variant="outline">{stat.percentage}%</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {stat.count} œuvre(s)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {stat.totalStock} unités
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Valeur: {stat.totalValue.toLocaleString()} FCFA
                    </p>
                    {stat.lowStock > 0 && (
                      <p className="text-sm text-orange-600">
                        ⚠️ {stat.lowStock} avec stock faible
                      </p>
                    )}
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour visualiser l'œuvre */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de l'Œuvre</DialogTitle>
            <DialogDescription>
              {selectedWork && `Informations complètes pour "${selectedWork.title}"`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWork && (
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations Générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Titre</Label>
                      <p className="text-sm text-muted-foreground">{selectedWork.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">ISBN</Label>
                      <p className="text-sm text-muted-foreground">{selectedWork.isbn}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Discipline</Label>
                      <p className="text-sm text-muted-foreground">{selectedWork.discipline.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Statut</Label>
                      <Badge variant={getStockBadgeVariant(selectedWork.stockStatus)}>
                        {getStockLabel(selectedWork.stockStatus)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations Commerciales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Prix</Label>
                      <p className="text-sm text-muted-foreground">{selectedWork.price.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">TVA</Label>
                      <p className="text-sm text-muted-foreground">{selectedWork.tva * 100}%</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Stock Actuel</Label>
                      <p className="text-sm text-muted-foreground">{selectedWork.stock} unités</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valeur Totale</Label>
                      <p className="text-sm text-muted-foreground">{selectedWork.totalValue.toLocaleString()} FCFA</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Informations sur les personnes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Auteur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedWork.author ? (
                      <div className="space-y-2">
                        <p className="font-medium">{selectedWork.author.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedWork.author.email}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Auteur non assigné</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Concepteur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedWork.concepteur ? (
                      <div className="space-y-2">
                        <p className="font-medium">{selectedWork.concepteur.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedWork.concepteur.email}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Concepteur non assigné</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Paramètres de stock */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paramètres de Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Stock Minimum</Label>
                      <p className="text-sm text-muted-foreground">{selectedWork.minStock} unités</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Stock Maximum</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedWork.maxStock ? `${selectedWork.maxStock} unités` : "Non défini"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date de Publication</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedWork.publishedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions commerciales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions Commerciales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => window.location.href = '/dashboard/representant/commandes'}
                      disabled={selectedWork.stock === 0}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Créer une commande
                    </Button>
                    {selectedWork.stock === 0 && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        ⚠️ Stock épuisé - Impossible de commander
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}