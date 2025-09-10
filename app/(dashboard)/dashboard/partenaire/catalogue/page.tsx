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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  Eye,
  AlertTriangle,
  User,
  Hash,
  DollarSign,
  Building2,
} from "lucide-react"

interface Work {
  id: string
  title: string
  isbn: string
  price: number
  tva: number
  stock: number
  minStock: number
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

interface CatalogData {
  works: Work[]
  filters: {
    disciplines: Array<{ id: string; name: string }>
    authors: string[]
  }
  summary: {
    totalWorks: number
    totalStock: number
    totalValue: number
    lowStockCount: number
    outOfStockCount: number
  }
}

export default function PartenaireCatalogue() {
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [disciplineFilter, setDisciplineFilter] = useState("all")
  const [authorFilter, setAuthorFilter] = useState("all")
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [selectedWorks, setSelectedWorks] = useState<Map<string, number>>(new Map())

  const fetchCatalogData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (disciplineFilter !== "all") params.append("discipline", disciplineFilter)
      if (authorFilter !== "all") params.append("author", authorFilter)
      if (searchTerm) params.append("search", searchTerm)
      
      const response = await fetch(`/api/partenaire/catalog?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du catalogue')
      }
      
      const data: CatalogData = await response.json()
      setCatalogData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching catalog data:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCatalogData()
  }, [disciplineFilter, authorFilter, searchTerm])

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

  const filteredWorks = catalogData?.works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  }) || []

  const addToCart = (workId: string) => {
    const currentQuantity = selectedWorks.get(workId) || 0
    const work = catalogData?.works.find(w => w.id === workId)
    if (work && currentQuantity < work.stock) {
      setSelectedWorks(new Map(selectedWorks.set(workId, currentQuantity + 1)))
    }
  }

  const removeFromCart = (workId: string) => {
    const currentQuantity = selectedWorks.get(workId) || 0
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1
      if (newQuantity === 0) {
        const newMap = new Map(selectedWorks)
        newMap.delete(workId)
        setSelectedWorks(newMap)
      } else {
        setSelectedWorks(new Map(selectedWorks.set(workId, newQuantity)))
      }
    }
  }

  const getCartTotal = () => {
    let total = 0
    selectedWorks.forEach((quantity, workId) => {
      const work = catalogData?.works.find(w => w.id === workId)
      if (work) {
        total += work.price * quantity
      }
    })
    return total
  }

  const getCartItemCount = () => {
    return Array.from(selectedWorks.values()).reduce((sum, quantity) => sum + quantity, 0)
  }

  const handleCreateOrder = async () => {
    if (selectedWorks.size === 0) {
      alert("Veuillez sélectionner au moins un article")
      return
    }

    try {
      const items = Array.from(selectedWorks.entries()).map(([workId, quantity]) => ({
        workId,
        quantity
      }))

      const response = await fetch('/api/partenaire/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de la commande')
      }

      // Réinitialiser le panier
      setSelectedWorks(new Map())
      setIsOrderDialogOpen(false)
      
      alert("Commande créée avec succès !")
      
      // Rediriger vers les commandes
      window.location.href = '/dashboard/partenaire/commandes'
    } catch (err) {
      console.error('Error creating order:', err)
      alert(err instanceof Error ? err.message : 'Erreur lors de la création')
    }
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
            <Button onClick={fetchCatalogData} variant="outline">
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
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Catalogue</h1>
          <p className="text-muted-foreground">Consultez et commandez les œuvres disponibles</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/partenaire/commandes'}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Mes commandes
          </Button>
          <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={selectedWorks.size === 0}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Commander ({getCartItemCount()})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la commande</DialogTitle>
                <DialogDescription>
                  Vérifiez les articles sélectionnés avant de confirmer votre commande
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {Array.from(selectedWorks.entries()).map(([workId, quantity]) => {
                  const work = catalogData?.works.find(w => w.id === workId)
                  if (!work) return null
                  
                  return (
                    <div key={workId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{work.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {work.author?.name} • {work.discipline.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(workId)}
                            disabled={quantity === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(workId)}
                            disabled={quantity >= work.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{work.price.toLocaleString()} FCFA</p>
                          <p className="text-sm text-muted-foreground">
                            Total: {(work.price * quantity).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total de la commande:</span>
                    <span className="text-lg font-bold">{getCartTotal().toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateOrder}>
                  Confirmer la commande
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Œuvres Disponibles</p>
                <p className="text-2xl font-bold">{catalogData?.summary.totalWorks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
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
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Stock Faible</p>
                <p className="text-2xl font-bold">{catalogData?.summary.lowStockCount || 0}</p>
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
            {catalogData?.filters.disciplines.map(discipline => (
              <SelectItem key={discipline.id} value={discipline.name}>
                {discipline.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={authorFilter} onValueChange={setAuthorFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Auteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les auteurs</SelectItem>
            {catalogData?.filters.authors.map(author => (
              <SelectItem key={author} value={author}>{author}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtres avancés
        </Button>
      </div>

      {/* Liste des œuvres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Œuvres Disponibles ({filteredWorks.length})
          </CardTitle>
          <CardDescription>Liste de toutes les œuvres disponibles pour vos commandes</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredWorks.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucune œuvre trouvée</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || disciplineFilter !== "all" || authorFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Aucune œuvre disponible"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorks.map((work) => {
                const quantityInCart = selectedWorks.get(work.id) || 0
                return (
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
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(work.id)}
                            disabled={quantityInCart === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {quantityInCart}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(work.id)}
                            disabled={quantityInCart >= work.stock || work.stock === 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
