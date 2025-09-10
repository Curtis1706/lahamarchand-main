"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  Eye,
  Trash2,
  Settings,
  BarChart3,
  Clock,
} from "lucide-react"

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
  createdAt: string
  updatedAt: string
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
  recentMovements: Array<{
    id: string
    type: string
    quantity: number
    reason: string | null
    createdAt: string
  }>
}

interface StockMovement {
  id: string
  type: string
  quantity: number
  reason: string | null
  reference: string | null
  createdAt: string
  work: {
    id: string
    title: string
    isbn: string
    discipline: string
    author: string
  }
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
  recentMovements: StockMovement[]
}

export default function PDGStockManagement() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [disciplineFilter, setDisciplineFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [movementForm, setMovementForm] = useState({
    type: "",
    quantity: "",
    reason: "",
    reference: ""
  })
  const [settingsForm, setSettingsForm] = useState({
    minStock: "",
    maxStock: "",
    price: ""
  })
  const [editForm, setEditForm] = useState({
    title: "",
    isbn: "",
    price: "",
    tva: "",
    disciplineId: ""
  })

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

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case "INBOUND": return "Entrée"
      case "OUTBOUND": return "Sortie"
      case "ADJUSTMENT": return "Ajustement"
      case "TRANSFER": return "Transfert"
      case "DAMAGED": return "Endommagé"
      case "EXPIRED": return "Expiré"
      default: return type
    }
  }

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case "INBOUND": return <TrendingUp className="h-4 w-4 text-green-600" />
      case "OUTBOUND": return <TrendingDown className="h-4 w-4 text-red-600" />
      case "ADJUSTMENT": return <Settings className="h-4 w-4 text-blue-600" />
      case "TRANSFER": return <Package className="h-4 w-4 text-purple-600" />
      case "DAMAGED": return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "EXPIRED": return <Clock className="h-4 w-4 text-gray-600" />
      default: return <Package className="h-4 w-4 text-gray-600" />
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

  const handleMovementSubmit = async () => {
    if (!selectedWork || !movementForm.type || !movementForm.quantity) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const response = await fetch('/api/pdg/stock/movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workId: selectedWork.id,
          type: movementForm.type,
          quantity: parseInt(movementForm.quantity),
          reason: movementForm.reason || null,
          reference: movementForm.reference || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du mouvement')
      }

      // Réinitialiser le formulaire
      setMovementForm({ type: "", quantity: "", reason: "", reference: "" })
      setIsMovementDialogOpen(false)
      setSelectedWork(null)
      
      // Recharger les données
      fetchStockData()
      
      alert("Mouvement de stock créé avec succès !")
    } catch (err) {
      console.error('Error creating stock movement:', err)
      alert(err instanceof Error ? err.message : 'Erreur lors de la création')
    }
  }

  const handleSettingsSubmit = async () => {
    if (!selectedWork) {
      alert("Aucune œuvre sélectionnée")
      return
    }

    try {
      const response = await fetch('/api/pdg/stock/works', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workId: selectedWork.id,
          minStock: settingsForm.minStock ? parseInt(settingsForm.minStock) : undefined,
          maxStock: settingsForm.maxStock ? parseInt(settingsForm.maxStock) : undefined,
          price: settingsForm.price ? parseFloat(settingsForm.price) : undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour')
      }

      // Réinitialiser le formulaire
      setSettingsForm({ minStock: "", maxStock: "", price: "" })
      setIsSettingsDialogOpen(false)
      setSelectedWork(null)
      
      // Recharger les données
      fetchStockData()
      
      alert("Paramètres mis à jour avec succès !")
    } catch (err) {
      console.error('Error updating work settings:', err)
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }

  const handleEditSubmit = async () => {
    if (!selectedWork) {
      alert("Aucune œuvre sélectionnée")
      return
    }

    if (!editForm.title || !editForm.isbn || !editForm.price) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const response = await fetch(`/api/pdg/works/${selectedWork.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          isbn: editForm.isbn,
          price: parseFloat(editForm.price),
          tva: parseFloat(editForm.tva) / 100,
          disciplineId: editForm.disciplineId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour')
      }

      // Réinitialiser le formulaire
      setEditForm({ title: "", isbn: "", price: "", tva: "", disciplineId: "" })
      setIsEditDialogOpen(false)
      setSelectedWork(null)
      
      // Recharger les données
      fetchStockData()
      
      alert("Œuvre mise à jour avec succès !")
    } catch (err) {
      console.error('Error updating work:', err)
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }

  const openMovementDialog = (work: Work) => {
    setSelectedWork(work)
    setMovementForm({ type: "", quantity: "", reason: "", reference: "" })
    setIsMovementDialogOpen(true)
  }

  const openSettingsDialog = (work: Work) => {
    setSelectedWork(work)
    setSettingsForm({
      minStock: work.minStock.toString(),
      maxStock: work.maxStock?.toString() || "",
      price: work.price.toString()
    })
    setIsSettingsDialogOpen(true)
  }

  const openViewDialog = (work: Work) => {
    setSelectedWork(work)
    setIsViewDialogOpen(true)
  }

  const openEditDialog = (work: Work) => {
    setSelectedWork(work)
    setEditForm({
      title: work.title,
      isbn: work.isbn,
      price: work.price.toString(),
      tva: (work.tva * 100).toString(),
      disciplineId: work.discipline.id
    })
    setIsEditDialogOpen(true)
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
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Gestion du Stock</h1>
          <p className="text-muted-foreground">Gestion complète des articles et mouvements de stock</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
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

      {/* Onglets */}
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Articles ({filteredWorks.length})
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Mouvements
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertes ({stockData?.summary.lowStockCount || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Articles en Stock</CardTitle>
              <CardDescription>Liste de tous les articles avec leur stock actuel</CardDescription>
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
                            <div>Auteur: {work.author?.name || "Inconnu"}</div>
                            <div>Discipline: {work.discipline.name}</div>
                            <div>ISBN: {work.isbn}</div>
                            <div>TVA: {work.tva * 100}%</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                            <div>Prix: {work.price.toLocaleString()} FCFA</div>
                            <div>Stock: {work.stock} unités</div>
                            <div>Stock min: {work.minStock} unités</div>
                            <div>Valeur: {work.totalValue.toLocaleString()} FCFA</div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => openMovementDialog(work)}>
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openSettingsDialog(work)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openViewDialog(work)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(work)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mouvements de Stock</CardTitle>
              <CardDescription>Historique des mouvements de stock récents</CardDescription>
            </CardHeader>
            <CardContent>
              {stockData?.recentMovements.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Article</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead>Référence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockData.recentMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {new Date(movement.createdAt).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMovementTypeIcon(movement.type)}
                            {getMovementTypeLabel(movement.type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <span className="font-medium">{movement.work.title}</span>
                            <p className="text-xs text-muted-foreground">
                              {movement.work.author} • {movement.work.discipline}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className={movement.quantity > 0 ? "text-green-600" : "text-red-600"}>
                          {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                        </TableCell>
                        <TableCell>{movement.reason || "-"}</TableCell>
                        <TableCell>{movement.reference || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun mouvement de stock récent</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertes de Stock</CardTitle>
              <CardDescription>Articles avec stock faible ou en rupture</CardDescription>
            </CardHeader>
            <CardContent>
              {stockData?.works.filter(w => w.stockStatus === "low" || w.stockStatus === "out").length ? (
                <div className="space-y-4">
                  {stockData.works
                    .filter(w => w.stockStatus === "low" || w.stockStatus === "out")
                    .map((work) => (
                      <div key={work.id} className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{work.title}</h4>
                              <Badge variant={getStockBadgeVariant(work.stockStatus)}>
                                {getStockLabel(work.stockStatus)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {work.author?.name || "Auteur inconnu"} • {work.discipline.name}
                            </p>
                            <div className="text-sm">
                              <span className="font-medium">Stock actuel: {work.stock} unités</span>
                              <span className="text-muted-foreground ml-2">(Seuil: {work.minStock} unités)</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openMovementDialog(work)}>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Réapprovisionner
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openSettingsDialog(work)}>
                              <Settings className="mr-2 h-4 w-4" />
                              Paramètres
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-600 font-medium">Aucune alerte de stock</p>
                  <p className="text-sm text-muted-foreground">Tous les articles ont un stock suffisant</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog pour mouvement de stock */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mouvement de Stock</DialogTitle>
            <DialogDescription>
              {selectedWork && `Ajouter ou retirer du stock pour "${selectedWork.title}"`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="movementType">Type de mouvement *</Label>
              <Select value={movementForm.type} onValueChange={(value) => setMovementForm({ ...movementForm, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INBOUND">Entrée (Réimpression, Réception)</SelectItem>
                  <SelectItem value="OUTBOUND">Sortie (Vente, Retrait)</SelectItem>
                  <SelectItem value="ADJUSTMENT">Ajustement (Inventaire, Correction)</SelectItem>
                  <SelectItem value="TRANSFER">Transfert</SelectItem>
                  <SelectItem value="DAMAGED">Stock Endommagé</SelectItem>
                  <SelectItem value="EXPIRED">Stock Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                value={movementForm.quantity}
                onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                placeholder="Quantité (positive pour ajout, négative pour retrait)"
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Raison</Label>
              <Input
                id="reason"
                value={movementForm.reason}
                onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                placeholder="Raison du mouvement"
              />
            </div>
            
            <div>
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={movementForm.reference}
                onChange={(e) => setMovementForm({ ...movementForm, reference: e.target.value })}
                placeholder="Numéro de commande, facture, etc."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMovementDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleMovementSubmit}>
              Créer le mouvement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour paramètres de stock */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres de Stock</DialogTitle>
            <DialogDescription>
              {selectedWork && `Modifier les paramètres pour "${selectedWork.title}"`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="minStock">Stock minimum</Label>
              <Input
                id="minStock"
                type="number"
                value={settingsForm.minStock}
                onChange={(e) => setSettingsForm({ ...settingsForm, minStock: e.target.value })}
                placeholder="Seuil d'alerte de stock faible"
              />
            </div>
            
            <div>
              <Label htmlFor="maxStock">Stock maximum</Label>
              <Input
                id="maxStock"
                type="number"
                value={settingsForm.maxStock}
                onChange={(e) => setSettingsForm({ ...settingsForm, maxStock: e.target.value })}
                placeholder="Stock maximum recommandé"
              />
            </div>
            
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={settingsForm.price}
                onChange={(e) => setSettingsForm({ ...settingsForm, price: e.target.value })}
                placeholder="Prix de vente"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSettingsSubmit}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

              {/* Mouvements récents */}
              {selectedWork.recentMovements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mouvements Récents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedWork.recentMovements.map((movement) => (
                        <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getMovementTypeIcon(movement.type)}
                            <div>
                              <p className="font-medium">{getMovementTypeLabel(movement.type)}</p>
                              <p className="text-sm text-muted-foreground">
                                {movement.reason || "Aucune raison spécifiée"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                              {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(movement.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour éditer l'œuvre */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'Œuvre</DialogTitle>
            <DialogDescription>
              {selectedWork && `Modifier les informations de "${selectedWork.title}"`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTitle">Titre *</Label>
              <Input
                id="editTitle"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Titre de l'œuvre"
              />
            </div>
            
            <div>
              <Label htmlFor="editIsbn">ISBN *</Label>
              <Input
                id="editIsbn"
                value={editForm.isbn}
                onChange={(e) => setEditForm({ ...editForm, isbn: e.target.value })}
                placeholder="ISBN de l'œuvre"
              />
            </div>
            
            <div>
              <Label htmlFor="editPrice">Prix (FCFA) *</Label>
              <Input
                id="editPrice"
                type="number"
                step="0.01"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                placeholder="Prix de vente"
              />
            </div>
            
            <div>
              <Label htmlFor="editTva">TVA (%)</Label>
              <Input
                id="editTva"
                type="number"
                step="0.01"
                value={editForm.tva}
                onChange={(e) => setEditForm({ ...editForm, tva: e.target.value })}
                placeholder="Taux de TVA"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditSubmit}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}