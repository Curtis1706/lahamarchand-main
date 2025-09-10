"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, FileText, AlertTriangle, TrendingDown, TrendingUp, Calendar } from "lucide-react"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for inventory movements
  const movements = [
    {
      id: "MOV-2024-001",
      date: "2024-01-15 14:30",
      type: "Entrée",
      article: "Mathématiques Appliquées",
      quantity: 100,
      source: "Livraison Imprimeur",
      reference: "BL-2024-001",
      user: "Marie Nzamba",
    },
    {
      id: "MOV-2024-002",
      date: "2024-01-15 10:15",
      type: "Sortie",
      article: "Histoire du Gabon Moderne",
      quantity: -5,
      source: "Vente Directe",
      reference: "VD-2024-045",
      user: "Pierre Akendengue",
    },
    {
      id: "MOV-2024-003",
      date: "2024-01-14 16:45",
      type: "Sortie",
      article: "Littérature Gabonaise",
      quantity: -20,
      source: "Dépôt Partenaire",
      reference: "DP-2024-012",
      user: "Librairie Centrale",
    },
  ]

  const lowStockItems = [
    {
      article: "Histoire du Gabon Moderne",
      currentStock: 5,
      minStock: 10,
      discipline: "Histoire",
      lastOrder: "2024-01-01",
    },
    {
      article: "Philosophie Africaine",
      currentStock: 2,
      minStock: 15,
      discipline: "Philosophie",
      lastOrder: "2023-12-15",
    },
    {
      article: "Arts Traditionnels",
      currentStock: 0,
      minStock: 20,
      discipline: "Arts",
      lastOrder: "2023-12-01",
    },
  ]

  const getMovementBadge = (type: string) => {
    return type === "Entrée" ? (
      <Badge className="bg-green-100 text-green-800">Entrée</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Sortie</Badge>
    )
  }

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return <Badge variant="destructive">Rupture</Badge>
    if (current < min) return <Badge variant="secondary">Stock faible</Badge>
    return <Badge variant="default">Normal</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion d'Inventaire</h1>
          <p className="text-muted-foreground">Suivi des mouvements de stock et alertes</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Mouvement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enregistrer un Mouvement</DialogTitle>
                <DialogDescription>Ajouter un mouvement d'inventaire manuel</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de Mouvement</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entree">Entrée Stock</SelectItem>
                        <SelectItem value="sortie">Sortie Stock</SelectItem>
                        <SelectItem value="ajustement">Ajustement</SelectItem>
                        <SelectItem value="inventaire">Inventaire Physique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="article">Article</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathématiques Appliquées</SelectItem>
                        <SelectItem value="histoire">Histoire du Gabon Moderne</SelectItem>
                        <SelectItem value="litterature">Littérature Gabonaise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité</Label>
                    <Input id="quantity" type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Référence</Label>
                    <Input id="reference" placeholder="BL-2024-001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source/Destination</Label>
                  <Input id="source" placeholder="Livraison Imprimeur, Vente Directe..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Commentaires additionnels..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Enregistrer le Mouvement</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mouvements Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">32 entrées, 15 sorties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entrées ce Mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+2,450</div>
            <p className="text-xs text-muted-foreground">Articles ajoutés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sorties ce Mois</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-1,890</div>
            <p className="text-xs text-muted-foreground">Articles vendus/déposés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">23</div>
            <p className="text-xs text-muted-foreground">Articles sous seuil</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="alerts">Alertes Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Recherche des Mouvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par article, référence, utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Movements Table */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des Mouvements</CardTitle>
              <CardDescription>Tous les mouvements d'inventaire en temps réel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Mouvement</TableHead>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Article</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Source/Destination</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-mono text-sm">{movement.id}</TableCell>
                        <TableCell>{movement.date}</TableCell>
                        <TableCell>{getMovementBadge(movement.type)}</TableCell>
                        <TableCell className="font-medium">{movement.article}</TableCell>
                        <TableCell>
                          <span className={movement.quantity > 0 ? "text-green-600" : "text-red-600"}>
                            {movement.quantity > 0 ? "+" : ""}
                            {movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{movement.source}</TableCell>
                        <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                        <TableCell>{movement.user}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Alertes de Stock Faible
              </CardTitle>
              <CardDescription>Articles nécessitant un réapprovisionnement urgent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Stock Actuel</TableHead>
                      <TableHead>Stock Minimum</TableHead>
                      <TableHead>Discipline</TableHead>
                      <TableHead>Dernière Commande</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.article}</TableCell>
                        <TableCell>
                          <span
                            className={
                              item.currentStock === 0 ? "text-red-600 font-bold" : "text-amber-600 font-semibold"
                            }
                          >
                            {item.currentStock}
                          </span>
                        </TableCell>
                        <TableCell>{item.minStock}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.discipline}</Badge>
                        </TableCell>
                        <TableCell>{item.lastOrder}</TableCell>
                        <TableCell>{getStockStatus(item.currentStock, item.minStock)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Commander
                            </Button>
                            <Button size="sm" variant="ghost">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
