"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Search, Edit2, Shield, AlertTriangle, FileText, History, TrendingUp, Calendar } from "lucide-react"

export default function OperationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  // Mock data for operations
  const operations = [
    {
      id: "OP-2024-001",
      type: "Entrée Stock",
      date: "2024-01-15",
      article: "Mathématiques Appliquées",
      quantity: 100,
      unitPrice: 25000,
      total: 2500000,
      user: "Marie Nzamba",
      status: "Validée",
      canCorrect: true,
    },
    {
      id: "OP-2024-002",
      type: "Vente Directe",
      date: "2024-01-14",
      article: "Histoire du Gabon Moderne",
      quantity: -5,
      unitPrice: 18000,
      total: 90000,
      user: "Pierre Akendengue",
      status: "Validée",
      canCorrect: true,
    },
    {
      id: "OP-2024-003",
      type: "Dépôt Partenaire",
      date: "2024-01-13",
      article: "Littérature Gabonaise",
      quantity: -20,
      unitPrice: 22000,
      total: 440000,
      user: "Librairie Centrale",
      status: "En cours",
      canCorrect: false,
    },
  ]

  const auditLog = [
    {
      id: "AUDIT-001",
      date: "2024-01-12 14:30",
      operation: "OP-2024-001",
      action: "Correction quantité",
      oldValue: "95",
      newValue: "100",
      reason: "Erreur de saisie initiale",
      user: "PDG - Admin",
    },
    {
      id: "AUDIT-002",
      date: "2024-01-10 09:15",
      operation: "OP-2023-458",
      action: "Correction prix",
      oldValue: "20000",
      newValue: "18000",
      reason: "Ajustement prix promotionnel",
      user: "PDG - Admin",
    },
  ]

  const filteredOperations = operations.filter((op) => {
    const matchesSearch =
      op.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || op.type === selectedType
    return matchesSearch && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Validée":
        return <Badge variant="default">Validée</Badge>
      case "En cours":
        return <Badge variant="secondary">En cours</Badge>
      case "Annulée":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Entrée Stock":
        return <Badge className="bg-green-100 text-green-800">Entrée</Badge>
      case "Vente Directe":
        return <Badge className="bg-blue-100 text-blue-800">Vente</Badge>
      case "Dépôt Partenaire":
        return <Badge className="bg-purple-100 text-purple-800">Dépôt</Badge>
      case "Retour":
        return <Badge className="bg-orange-100 text-orange-800">Retour</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Opérations</h1>
          <p className="text-muted-foreground">Suivi et correction des opérations - Droits exclusifs PDG</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-medium text-amber-600">Accès Exclusif PDG</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opérations Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% vs hier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Mouvements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5M FCFA</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corrections ce Mois</CardTitle>
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Opérations corrigées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Opérations à valider</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Opérations</TabsTrigger>
          <TabsTrigger value="audit">Journal d'Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
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
                      placeholder="Rechercher par article, ID opération, utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tous types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="Entrée Stock">Entrée Stock</SelectItem>
                    <SelectItem value="Vente Directe">Vente Directe</SelectItem>
                    <SelectItem value="Dépôt Partenaire">Dépôt Partenaire</SelectItem>
                    <SelectItem value="Retour">Retour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Operations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Opérations</CardTitle>
              <CardDescription>
                Toutes les opérations avec possibilité de correction (droit exclusif PDG)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Opération</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Article</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix Unitaire</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperations.map((operation) => (
                      <TableRow key={operation.id}>
                        <TableCell className="font-mono text-sm">{operation.id}</TableCell>
                        <TableCell>{getTypeBadge(operation.type)}</TableCell>
                        <TableCell>{operation.date}</TableCell>
                        <TableCell className="font-medium">{operation.article}</TableCell>
                        <TableCell>
                          <span className={operation.quantity < 0 ? "text-red-600" : "text-green-600"}>
                            {operation.quantity > 0 ? "+" : ""}
                            {operation.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{operation.unitPrice.toLocaleString()} FCFA</TableCell>
                        <TableCell className="font-semibold">{operation.total.toLocaleString()} FCFA</TableCell>
                        <TableCell>{operation.user}</TableCell>
                        <TableCell>{getStatusBadge(operation.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            {operation.canCorrect && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-amber-600">
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Shield className="h-5 w-5 text-amber-500" />
                                      Correction d'Opération - PDG
                                    </DialogTitle>
                                    <DialogDescription>
                                      Correction de l'opération {operation.id} - Cette action sera tracée dans le
                                      journal d'audit
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="quantity">Nouvelle Quantité</Label>
                                        <Input
                                          id="quantity"
                                          type="number"
                                          defaultValue={Math.abs(operation.quantity)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="price">Nouveau Prix</Label>
                                        <Input id="price" type="number" defaultValue={operation.unitPrice} />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="reason">Motif de la Correction *</Label>
                                      <Textarea id="reason" placeholder="Expliquez la raison de cette correction..." />
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-lg">
                                      <p className="text-sm text-amber-800">
                                        <AlertTriangle className="h-4 w-4 inline mr-2" />
                                        Cette correction sera automatiquement enregistrée dans le journal d'audit avec
                                        votre identifiant et l'horodatage.
                                      </p>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                                      Appliquer la Correction
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
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

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Journal d'Audit des Corrections
              </CardTitle>
              <CardDescription>
                Historique complet de toutes les corrections d'opérations effectuées par le PDG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Opération</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Ancienne Valeur</TableHead>
                      <TableHead>Nouvelle Valeur</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Utilisateur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLog.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-mono text-sm">{entry.date}</TableCell>
                        <TableCell className="font-medium">{entry.operation}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.action}</Badge>
                        </TableCell>
                        <TableCell className="text-red-600">{entry.oldValue}</TableCell>
                        <TableCell className="text-green-600">{entry.newValue}</TableCell>
                        <TableCell>{entry.reason}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-amber-500" />
                            {entry.user}
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
