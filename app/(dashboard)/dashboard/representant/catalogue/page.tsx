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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BookOpen,
  Search,
  Filter,
  Package,
  User,
  Hash,
  DollarSign,
  ShoppingCart,
  Eye,
  Plus,
} from "lucide-react"

interface Work {
  id: string
  title: string
  isbn: string
  price: number
  tva: number
  stock: number
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
}

interface CatalogResponse {
  works: Work[]
  summary: {
    totalWorks: number
    totalValue: number
    disciplines: number
    authors: number
    averagePrice: number
    totalStock: number
  }
  topWorksByStock: Array<{
    id: string
    title: string
    stock: number
    price: number
    discipline: string
    author: string
    totalValue: number
  }>
  disciplineStats: Array<{
    discipline: string
    count: number
    totalValue: number
    percentage: number
  }>
}

export default function RepresentantCatalogue() {
  const [catalogData, setCatalogData] = useState<CatalogResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [disciplineFilter, setDisciplineFilter] = useState("all")
  const [authorFilter, setAuthorFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  const fetchCatalog = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/representant/catalog')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du catalogue')
      }
      
      const data: CatalogResponse = await response.json()
      setCatalogData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching catalog:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCatalog()
  }, [])

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive"
    if (stock < 10) return "secondary"
    return "default"
  }

  const getStockLabel = (stock: number) => {
    if (stock === 0) return "Rupture"
    if (stock < 10) return "Faible"
    return "Disponible"
  }

  const filteredWorks = catalogData?.works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDiscipline = disciplineFilter === "all" || work.discipline.name === disciplineFilter
    const matchesAuthor = authorFilter === "all" || work.author?.name === authorFilter
    
    let matchesStock = true
    if (stockFilter === "available") matchesStock = work.stock > 0
    else if (stockFilter === "low") matchesStock = work.stock > 0 && work.stock < 10
    else if (stockFilter === "out") matchesStock = work.stock === 0
    
    return matchesSearch && matchesDiscipline && matchesAuthor && matchesStock
  }) || []

  const uniqueDisciplines = [...new Set(catalogData?.works.map(w => w.discipline.name) || [])]
  const uniqueAuthors = [...new Set(catalogData?.works.map(w => w.author?.name).filter(Boolean) || [])]

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
            <BookOpen className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Erreur de chargement</p>
            <Button onClick={fetchCatalog} variant="outline">
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
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Catalogue des Œuvres</h1>
        <p className="text-muted-foreground">Consultez toutes les œuvres disponibles pour vos clients</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Œuvres</p>
                <p className="text-2xl font-bold">{catalogData?.summary.totalWorks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Stock Total</p>
                <p className="text-2xl font-bold">{catalogData?.summary.totalStock || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valeur Totale</p>
                <p className="text-2xl font-bold">
                  {catalogData?.summary.totalValue.toLocaleString() || "0"} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Auteurs</p>
                <p className="text-2xl font-bold">{catalogData?.summary.authors || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top œuvres par stock */}
      {catalogData?.topWorksByStock.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Œuvres par Stock
            </CardTitle>
            <CardDescription>Les œuvres avec le plus de stock disponible</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogData.topWorksByStock.slice(0, 6).map((work, index) => (
                <div key={work.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <Badge variant={getStockBadgeVariant(work.stock)}>
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

      {/* Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par titre, ISBN, auteur ou discipline..."
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
            <SelectItem value="all">Toutes</SelectItem>
            {uniqueDisciplines.map(discipline => (
              <SelectItem key={discipline} value={discipline}>{discipline}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={authorFilter} onValueChange={setAuthorFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Auteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {uniqueAuthors.map(author => (
              <SelectItem key={author} value={author}>{author}</SelectItem>
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
      </div>

      {/* Liste des œuvres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Œuvres ({filteredWorks.length})
          </CardTitle>
          <CardDescription>Liste de toutes les œuvres disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredWorks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucune œuvre trouvée</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || disciplineFilter !== "all" || authorFilter !== "all" || stockFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Aucune œuvre disponible dans le catalogue"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorks.map((work) => (
                  <TableRow key={work.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{work.title}</span>
                        <p className="text-xs text-muted-foreground">
                          Publié le {new Date(work.publishedAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm font-medium">{work.author?.name || "Inconnu"}</span>
                        {work.concepteur && work.concepteur.name !== work.author?.name && (
                          <p className="text-xs text-muted-foreground">
                            Concepteur: {work.concepteur.name}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{work.discipline.name}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {work.isbn}
                    </TableCell>
                    <TableCell className="font-medium">
                      {work.price.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(work.stock)} className="flex items-center gap-1 w-fit">
                        <Package className="h-3 w-3" />
                        {work.stock} • {getStockLabel(work.stock)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {work.totalValue.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard/representant/commandes'}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Statistiques par discipline */}
      {catalogData?.disciplineStats.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Répartition par Discipline
            </CardTitle>
            <CardDescription>Distribution des œuvres par discipline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogData.disciplineStats.map((stat) => (
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
                      Valeur: {stat.totalValue.toLocaleString()} FCFA
                    </p>
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
    </div>
  )
}
