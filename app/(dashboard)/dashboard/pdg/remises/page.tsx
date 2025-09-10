"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Percent,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  DollarSign,
  Calendar,
  Settings,
  TrendingUp,
  User,
  Building2,
  School,
} from "lucide-react"

export default function RemisesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedRemise, setSelectedRemise] = useState<any>(null)

  // Mock data for remises
  const remises = [
    {
      id: "REM-2024-001",
      client: "Lycée Léon Mba",
      typeClient: "École",
      contact: "Dr. Jean Obame",
      telephone: "+241 01 23 45 67",
      email: "direction@lycee-leon-mba.ga",
      montantCommande: 450000,
      pourcentageRemise: 15,
      montantRemise: 67500,
      montantFinal: 382500,
      raison: "Commande importante pour la rentrée scolaire",
      dateCreation: "2024-01-28",
      dateExpiration: "2024-02-28",
      statut: "active",
      creePar: "PDG",
      commandeId: "CMD-ECOLE-001",
    },
    {
      id: "REM-2024-002",
      client: "Librairie Centrale du Bénin",
      typeClient: "Grossiste",
      contact: "M. Jean Akendengue",
      telephone: "+229 21 23 45 67",
      email: "direction@librairie-centrale-bj.com",
      montantCommande: 850000,
      pourcentageRemise: 10,
      montantRemise: 85000,
      montantFinal: 765000,
      raison: "Partenaire de longue date - fidélité",
      dateCreation: "2024-01-25",
      dateExpiration: "2024-03-25",
      statut: "active",
      creePar: "PDG",
      commandeId: "CMD-GROSS-001",
    },
    {
      id: "REM-2024-003",
      client: "Université des Sciences",
      typeClient: "Institution",
      contact: "Pr. Marie Nzamba",
      telephone: "+241 01 23 45 68",
      email: "direction@universite-sciences.ga",
      montantCommande: 1200000,
      pourcentageRemise: 20,
      montantRemise: 240000,
      montantFinal: 960000,
      raison: "Commande exceptionnelle - partenariat éducatif",
      dateCreation: "2024-01-20",
      dateExpiration: "2024-02-20",
      statut: "expiree",
      creePar: "PDG",
      commandeId: "CMD-INST-001",
    },
    {
      id: "REM-2024-004",
      client: "École Publique de l'Indépendance",
      typeClient: "École",
      contact: "Mme. Sophie Mba",
      telephone: "+241 01 23 45 69",
      email: "direction@epi-libreville.ga",
      montantCommande: 320000,
      pourcentageRemise: 5,
      montantRemise: 16000,
      montantFinal: 304000,
      raison: "Première commande - promotion d'accueil",
      dateCreation: "2024-01-15",
      dateExpiration: "2024-02-15",
      statut: "utilisee",
      creePar: "PDG",
      commandeId: "CMD-ECOLE-002",
    },
  ]

  const typesClients = [
    { value: "ecole", label: "École", icon: School },
    { value: "grossiste", label: "Grossiste", icon: Building2 },
    { value: "librairie", label: "Librairie", icon: Building2 },
    { value: "institution", label: "Institution", icon: Users },
    { value: "particulier", label: "Particulier", icon: User },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "expiree":
        return <Badge className="bg-red-100 text-red-800">Expirée</Badge>
      case "utilisee":
        return <Badge className="bg-blue-100 text-blue-800">Utilisée</Badge>
      case "annulee":
        return <Badge className="bg-gray-100 text-gray-800">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeClientIcon = (type: string) => {
    switch (type) {
      case "École":
        return <School className="h-4 w-4" />
      case "Grossiste":
        return <Building2 className="h-4 w-4" />
      case "Librairie":
        return <Building2 className="h-4 w-4" />
      case "Institution":
        return <Users className="h-4 w-4" />
      case "Particulier":
        return <User className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getTypeClientBadge = (type: string) => {
    switch (type) {
      case "École":
        return <Badge className="bg-green-100 text-green-800">École</Badge>
      case "Grossiste":
        return <Badge className="bg-blue-100 text-blue-800">Grossiste</Badge>
      case "Librairie":
        return <Badge className="bg-purple-100 text-purple-800">Librairie</Badge>
      case "Institution":
        return <Badge className="bg-orange-100 text-orange-800">Institution</Badge>
      case "Particulier":
        return <Badge className="bg-gray-100 text-gray-800">Particulier</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const filteredRemises = remises.filter((remise) => {
    const matchesSearch = remise.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remise.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remise.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || remise.statut === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalRemises = remises.length
  const remisesActives = remises.filter(r => r.statut === "active").length
  const montantTotalRemises = remises.reduce((sum, r) => sum + r.montantRemise, 0)
  const montantEconome = remises.reduce((sum, r) => sum + r.montantRemise, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Remises</h1>
          <p className="text-muted-foreground">Accordez des remises personnalisées à vos clients</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Remise
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une Remise Personnalisée</DialogTitle>
              <DialogDescription>
                Accordez une remise exceptionnelle à un client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Client Selection */}
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lycee">Lycée Léon Mba - École</SelectItem>
                    <SelectItem value="librairie">Librairie Centrale - Grossiste</SelectItem>
                    <SelectItem value="universite">Université des Sciences - Institution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type de Client */}
              <div className="space-y-2">
                <Label>Type de Client *</Label>
                <div className="grid grid-cols-2 gap-4">
                  {typesClients.map((type) => {
                    const Icon = type.icon
                    return (
                      <div key={type.value} className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <input type="radio" id={type.value} name="typeClient" value={type.value} />
                          <Icon className="h-4 w-4" />
                          <Label htmlFor={type.value} className="cursor-pointer">
                            {type.label}
                          </Label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Montant de la Commande */}
              <div className="space-y-2">
                <Label htmlFor="montantCommande">Montant de la Commande (FCFA) *</Label>
                <Input id="montantCommande" type="number" placeholder="450000" />
              </div>

              {/* Pourcentage de Remise */}
              <div className="space-y-2">
                <Label>Pourcentage de Remise *</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((pourcentage) => (
                    <div key={pourcentage} className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <input type="radio" id={`remise-${pourcentage}`} name="pourcentage" value={pourcentage} />
                        <Label htmlFor={`remise-${pourcentage}`} className="cursor-pointer">
                          {pourcentage}%
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raison de la Remise */}
              <div className="space-y-2">
                <Label htmlFor="raison">Raison de la Remise *</Label>
                <Textarea id="raison" placeholder="Justifiez l'octroi de cette remise..." />
              </div>

              {/* Durée de Validité */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de Début</Label>
                  <Input id="dateDebut" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateExpiration">Date d'Expiration</Label>
                  <Input id="dateExpiration" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Créer la Remise
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Remises</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRemises}</div>
            <p className="text-xs text-muted-foreground">Remises accordées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{remisesActives}</div>
            <p className="text-xs text-muted-foreground">En cours de validité</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{montantTotalRemises.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Remises accordées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Économies Clients</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{montantEconome.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Montant économisé</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="toutes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="toutes">Toutes ({totalRemises})</TabsTrigger>
          <TabsTrigger value="actives">Actives ({remisesActives})</TabsTrigger>
          <TabsTrigger value="expirees">Expirées ({remises.filter(r => r.statut === "expiree").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="toutes" className="space-y-4">
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
                      placeholder="Rechercher par client, contact, ID remise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tous statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expiree">Expirée</SelectItem>
                    <SelectItem value="utilisee">Utilisée</SelectItem>
                    <SelectItem value="annulee">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Remises Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Remises</CardTitle>
              <CardDescription>Gérez les remises personnalisées accordées aux clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Remise</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Montant Commande</TableHead>
                      <TableHead>Remise</TableHead>
                      <TableHead>Montant Final</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Validité</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRemises.map((remise) => (
                      <TableRow key={remise.id}>
                        <TableCell className="font-mono text-sm">{remise.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getTypeClientIcon(remise.typeClient)}
                            <div>
                              <div className="font-medium">{remise.client}</div>
                              <div className="text-sm text-muted-foreground">{remise.contact}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeClientBadge(remise.typeClient)}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{remise.montantCommande.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-red-600">-{remise.pourcentageRemise}%</div>
                            <div className="text-sm text-red-600">-{remise.montantRemise.toLocaleString()} FCFA</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-green-600">{remise.montantFinal.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(remise.statut)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Créée: {new Date(remise.dateCreation).toLocaleDateString("fr-FR")}</div>
                            <div>Expire: {new Date(remise.dateExpiration).toLocaleDateString("fr-FR")}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedRemise(remise)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Détails de la Remise</DialogTitle>
                                  <DialogDescription>Remise {remise.id} - {remise.client}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Client</Label>
                                      <p className="text-sm">{remise.client}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Type</Label>
                                      <p className="text-sm">{remise.typeClient}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Contact</Label>
                                      <p className="text-sm">{remise.contact}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Téléphone</Label>
                                      <p className="text-sm">{remise.telephone}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Montant Commande</Label>
                                      <p className="text-sm font-semibold">{remise.montantCommande.toLocaleString()} FCFA</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Remise</Label>
                                      <p className="text-sm font-semibold text-red-600">-{remise.pourcentageRemise}%</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Montant Final</Label>
                                      <p className="text-sm font-semibold text-green-600">{remise.montantFinal.toLocaleString()} FCFA</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Raison</Label>
                                    <p className="text-sm">{remise.raison}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Créée par</Label>
                                      <p className="text-sm">{remise.creePar}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Commande</Label>
                                      <p className="text-sm font-mono">{remise.commandeId}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
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

        <TabsContent value="actives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Remises Actives
              </CardTitle>
              <CardDescription>Remises en cours de validité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRemises
                  .filter(r => r.statut === "active")
                  .map((remise) => (
                    <div key={remise.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{remise.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {remise.client} - {remise.contact}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{remise.montantFinal.toLocaleString()} FCFA</div>
                          <div className="text-sm text-muted-foreground">-{remise.pourcentageRemise}% de remise</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Expire le {new Date(remise.dateExpiration).toLocaleDateString("fr-FR")}</span>
                          <span>{getTypeClientBadge(remise.typeClient)}</span>
                          <span>Commande: {remise.commandeId}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir Détails
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expirees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-600" />
                Remises Expirées
              </CardTitle>
              <CardDescription>Remises dont la période de validité est terminée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRemises
                  .filter(r => r.statut === "expiree")
                  .map((remise) => (
                    <div key={remise.id} className="border rounded-lg p-4 opacity-75">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{remise.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {remise.client} - {remise.contact}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-600">{remise.montantFinal.toLocaleString()} FCFA</div>
                          <div className="text-sm text-muted-foreground">-{remise.pourcentageRemise}% de remise</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Expirée le {new Date(remise.dateExpiration).toLocaleDateString("fr-FR")}</span>
                          <span>{getTypeClientBadge(remise.typeClient)}</span>
                          <span>Commande: {remise.commandeId}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir Détails
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Pouvoir Discrétionnaire :</strong> En tant que PDG, vous pouvez accorder des remises 
          personnalisées à tout type de client présent sur la plateforme. Les remises sont appliquées 
          sous forme de pourcentage sur le tarif normal : 5%, 10%, 15% ou 20%.
        </AlertDescription>
      </Alert>
    </div>
  )
}
