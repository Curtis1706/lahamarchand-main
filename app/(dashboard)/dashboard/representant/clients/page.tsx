"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Users,
  Plus,
  Eye,
  Search,
  Filter,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingCart,
} from "lucide-react"

interface Client {
  id: string
  name: string
  type: string
  contact: string
  email: string
  phone: string
  address: string
  city: string
  status: string
  totalOrders: number
  totalSpent: number
  lastOrder: string | null
  notes: string
}

interface ClientsResponse {
  clients: Client[]
  summary: {
    total: number
    active: number
    pending: number
    totalRevenue: number
    averageOrderValue: number
    topClient: Client
  }
}

export default function RepresentantClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    type: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
  })

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/representant/clients')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des clients')
      }
      
      const data: ClientsResponse = await response.json()
      setClients(data.clients)
      setError(null)
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Actif": return "default"
      case "En attente": return "outline"
      case "Inactif": return "secondary"
      default: return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Librairie": return <Building className="h-4 w-4" />
      case "Point de vente": return <ShoppingCart className="h-4 w-4" />
      case "Institution": return <Building className="h-4 w-4" />
      case "École": return <Building className="h-4 w-4" />
      default: return <Building className="h-4 w-4" />
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    const matchesType = typeFilter === "all" || client.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const createClient = async () => {
    if (!newClient.name.trim() || !newClient.type.trim() || !newClient.contact.trim()) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const response = await fetch('/api/representant/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du client')
      }

      // Réinitialiser le formulaire
      setNewClient({
        name: "",
        type: "",
        contact: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        notes: ""
      })
      setIsCreateDialogOpen(false)
      
      // Recharger les clients
      fetchClients()
      
      alert("Client créé avec succès !")
    } catch (err) {
      console.error('Error creating client:', err)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Gestion des Clients</h1>
          <p className="text-muted-foreground">Gérer votre portefeuille client et suivre leurs achats</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau client</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau client à votre portefeuille
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Nom de l'entreprise ou institution"
                />
              </div>
              
              <div>
                <Label htmlFor="clientType">Type *</Label>
                <Select value={newClient.type} onValueChange={(value) => setNewClient({ ...newClient, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Librairie">Librairie</SelectItem>
                    <SelectItem value="Point de vente">Point de vente</SelectItem>
                    <SelectItem value="Institution">Institution</SelectItem>
                    <SelectItem value="École">École</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="contact">Contact *</Label>
                <Input
                  id="contact"
                  value={newClient.contact}
                  onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                  placeholder="Nom du contact principal"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+241 XX XX XX XX"
                />
              </div>
              
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={newClient.city}
                  onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                  placeholder="Ville"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="Adresse complète"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder="Informations supplémentaires sur le client..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={createClient}>
                Créer le client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Clients Actifs</p>
                <p className="text-2xl font-bold">{clients.filter(c => c.status === "Actif").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Commandes Total</p>
                <p className="text-2xl font-bold">{clients.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold">
                  {clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()} FCFA
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
            placeholder="Rechercher par nom, contact ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="Actif">Actif</SelectItem>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="Inactif">Inactif</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="Librairie">Librairie</SelectItem>
            <SelectItem value="Point de vente">Point de vente</SelectItem>
            <SelectItem value="Institution">Institution</SelectItem>
            <SelectItem value="École">École</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clients ({filteredClients.length})
          </CardTitle>
          <CardDescription>Liste de tous vos clients</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Aucun client trouvé</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Créez votre premier client pour commencer"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(client.type)}
                          <span className="font-medium">{client.name}</span>
                        </div>
                        {client.address && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {client.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm font-medium">{client.contact}</span>
                        {client.email && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </p>
                        )}
                        {client.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{client.city}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(client.status)}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{client.totalOrders}</span>
                        {client.lastOrder && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(client.lastOrder).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {client.totalSpent.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
