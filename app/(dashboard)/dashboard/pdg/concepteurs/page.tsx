"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { GraduationCap, CheckCircle, XCircle, Clock, Search, UserPlus, Eye, AlertTriangle } from "lucide-react"

const disciplines = [
  "Sciences",
  "Littérature",
  "Arts",
  "Philosophie",
  "Histoire",
  "Géographie",
  "Mathématiques",
  "Physique",
  "Chimie",
  "Biologie",
]

const concepteurs = [
  {
    id: 1,
    nom: "Dr. Marie Nzamba",
    email: "marie.nzamba@gabon.edu",
    discipline: "Sciences",
    statut: "en_attente",
    dateCreation: "2024-01-15",
    oeuvres: 3,
    projetsEnCours: 2,
    droitsGeneres: 45000,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nom: "Prof. Jean Mbadinga",
    email: "jean.mbadinga@litterature.ga",
    discipline: "Littérature",
    statut: "valide",
    dateCreation: "2023-11-20",
    oeuvres: 8,
    projetsEnCours: 1,
    droitsGeneres: 125000,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nom: "Mme. Sylvie Obame",
    email: "sylvie.obame@arts.ga",
    discipline: "Arts",
    statut: "rejete",
    dateCreation: "2024-02-01",
    oeuvres: 0,
    projetsEnCours: 0,
    droitsGeneres: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    raisonRejet: "Dossier incomplet - diplômes manquants",
  },
]

const statistiques = {
  total: 156,
  enAttente: 12,
  valides: 134,
  rejetes: 10,
  parDiscipline: {
    Sciences: 45,
    Littérature: 38,
    Arts: 25,
    Philosophie: 18,
    Histoire: 15,
    Autres: 15,
  },
}

export default function ConcepteursPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDiscipline, setFilterDiscipline] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [selectedConcepteur, setSelectedConcepteur] = useState<any>(null)

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "valide":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Validé</Badge>
      case "en_attente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>
      case "rejete":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejeté</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestion des Concepteurs</h1>
          <p className="text-muted-foreground">
            Validation finale des comptes concepteurs par discipline (droit exclusif PDG)
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau Concepteur
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Concepteurs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques.total}</div>
            <p className="text-xs text-muted-foreground">Tous statuts confondus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statistiques.enAttente}</div>
            <p className="text-xs text-muted-foreground">Validation PDG requise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistiques.valides}</div>
            <p className="text-xs text-muted-foreground">Comptes actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistiques.rejetes}</div>
            <p className="text-xs text-muted-foreground">Dossiers refusés</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste des Concepteurs</TabsTrigger>
          <TabsTrigger value="disciplines">Par Discipline</TabsTrigger>
          <TabsTrigger value="validations">Validations Pendantes</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres et Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <Label htmlFor="search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nom, email, discipline..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Discipline</Label>
                  <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes disciplines</SelectItem>
                      {disciplines.map((discipline) => (
                        <SelectItem key={discipline} value={discipline}>
                          {discipline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="valide">Validé</SelectItem>
                      <SelectItem value="rejete">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des concepteurs */}
          <Card>
            <CardHeader>
              <CardTitle>Concepteurs Enregistrés</CardTitle>
              <CardDescription>Gestion et validation des comptes concepteurs par discipline</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepteur</TableHead>
                    <TableHead>Discipline</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Œuvres</TableHead>
                    <TableHead>Droits Générés</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {concepteurs.map((concepteur) => (
                    <TableRow key={concepteur.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={concepteur.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {concepteur.nom
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{concepteur.nom}</div>
                            <div className="text-sm text-muted-foreground">{concepteur.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{concepteur.discipline}</Badge>
                      </TableCell>
                      <TableCell>{getStatutBadge(concepteur.statut)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{concepteur.oeuvres} œuvres</div>
                          <div className="text-muted-foreground">{concepteur.projetsEnCours} en cours</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{concepteur.droitsGeneres.toLocaleString()} FCFA</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedConcepteur(concepteur)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails du Concepteur</DialogTitle>
                                <DialogDescription>Informations complètes et actions de validation</DialogDescription>
                              </DialogHeader>
                              {selectedConcepteur && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Nom complet</Label>
                                      <div className="font-medium">{selectedConcepteur.nom}</div>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <div className="font-medium">{selectedConcepteur.email}</div>
                                    </div>
                                    <div>
                                      <Label>Discipline</Label>
                                      <Badge variant="outline">{selectedConcepteur.discipline}</Badge>
                                    </div>
                                    <div>
                                      <Label>Statut actuel</Label>
                                      {getStatutBadge(selectedConcepteur.statut)}
                                    </div>
                                  </div>

                                  {selectedConcepteur.statut === "en_attente" && (
                                    <div className="space-y-3">
                                      <Label>Action de validation (PDG)</Label>
                                      <div className="flex gap-2">
                                        <Button className="bg-green-600 hover:bg-green-700">
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Valider le Compte
                                        </Button>
                                        <Button variant="destructive">
                                          <XCircle className="mr-2 h-4 w-4" />
                                          Rejeter
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {selectedConcepteur.raisonRejet && (
                                    <div>
                                      <Label>Raison du rejet</Label>
                                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                        {selectedConcepteur.raisonRejet}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {concepteur.statut === "en_attente" && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Action requise
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplines" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(statistiques.parDiscipline).map(([discipline, count]) => (
              <Card key={discipline}>
                <CardHeader>
                  <CardTitle className="text-lg">{discipline}</CardTitle>
                  <CardDescription>{count} concepteurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Actifs</span>
                      <span className="font-medium">{Math.floor(count * 0.8)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>En attente</span>
                      <span className="font-medium text-yellow-600">{Math.floor(count * 0.15)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rejetés</span>
                      <span className="font-medium text-red-600">{Math.floor(count * 0.05)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="validations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Validations Pendantes (Action PDG Requise)
              </CardTitle>
              <CardDescription>
                {statistiques.enAttente} comptes concepteurs en attente de validation finale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {concepteurs
                  .filter((c) => c.statut === "en_attente")
                  .map((concepteur) => (
                    <div key={concepteur.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={concepteur.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {concepteur.nom
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{concepteur.nom}</div>
                          <div className="text-sm text-muted-foreground">
                            {concepteur.discipline} • Créé le {concepteur.dateCreation}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Valider
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
