"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, Clock, Eye, Search, AlertTriangle, FileText, Calendar, User, BookOpen } from "lucide-react"

const validations = [
  {
    id: "VAL-2024-001",
    titre: "Mathématiques Appliquées au Gabon",
    type: "oeuvre",
    datesoumission: "2024-01-15",
    statut: "en_cours_validation",
    etape: "revision_pdg",
    commentaires: "En attente de validation finale PDG",
    discipline: "Sciences",
    estimationDelai: "2-3 jours",
    priorite: "normale",
  },
  {
    id: "VAL-2024-002",
    titre: "Collection Sciences Naturelles",
    type: "projet",
    datesoumission: "2024-01-10",
    statut: "validee",
    etape: "complete",
    commentaires: "Projet approuvé - mise en production",
    discipline: "Sciences",
    dateValidation: "2024-01-18",
    priorite: "haute",
  },
  {
    id: "VAL-2024-003",
    titre: "Physique Quantique Simplifiée",
    type: "oeuvre",
    datesoumission: "2024-01-08",
    statut: "en_revision",
    etape: "corrections_demandees",
    commentaires: "Révisions mineures demandées - bibliographie à compléter",
    discipline: "Sciences",
    estimationDelai: "1-2 jours",
    priorite: "normale",
  },
  {
    id: "VAL-2024-004",
    titre: "Manuel Chimie Organique",
    type: "oeuvre",
    datesoumission: "2024-01-05",
    statut: "rejetee",
    etape: "rejet",
    commentaires: "Contenu trop avancé pour le niveau ciblé",
    discipline: "Sciences",
    dateRejet: "2024-01-12",
    priorite: "basse",
  },
]

const statistiques = {
  totalSoumissions: 24,
  enAttente: 3,
  validees: 18,
  rejetees: 3,
  delaiMoyen: 4.2,
  tauxValidation: 85,
}

export default function ValidationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedValidation, setSelectedValidation] = useState<any>(null)

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_cours_validation":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En cours de validation</Badge>
      case "en_revision":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En révision</Badge>
      case "validee":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Validée</Badge>
      case "rejetee":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejetée</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "oeuvre":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Œuvre</Badge>
      case "projet":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Projet</Badge>
      default:
        return <Badge variant="secondary">Autre</Badge>
    }
  }

  const getPrioriteBadge = (priorite: string) => {
    switch (priorite) {
      case "haute":
        return <Badge variant="destructive">Haute</Badge>
      case "normale":
        return <Badge variant="secondary">Normale</Badge>
      case "basse":
        return <Badge variant="outline">Basse</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const getEtapeDescription = (etape: string) => {
    switch (etape) {
      case "revision_pdg":
        return "Validation finale PDG"
      case "corrections_demandees":
        return "Corrections demandées"
      case "complete":
        return "Processus terminé"
      case "rejet":
        return "Rejeté"
      default:
        return "Étape inconnue"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Suivi des Validations</h1>
        <p className="text-muted-foreground">
          Suivi en temps réel de vos œuvres et projets soumis pour validation (discipline: Sciences)
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Soumissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques.totalSoumissions}</div>
            <p className="text-xs text-muted-foreground">Toutes périodes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statistiques.enAttente}</div>
            <p className="text-xs text-muted-foreground">En cours de traitement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistiques.validees}</div>
            <p className="text-xs text-muted-foreground">Approuvées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Validation</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistiques.tauxValidation}%</div>
            <p className="text-xs text-muted-foreground">Taux de succès</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Délai Moyen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques.delaiMoyen}j</div>
            <p className="text-xs text-muted-foreground">Temps de validation</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recherche et Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Titre, ID validation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="oeuvre">Œuvres</SelectItem>
                  <SelectItem value="projet">Projets</SelectItem>
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
                  <SelectItem value="en_cours_validation">En cours</SelectItem>
                  <SelectItem value="en_revision">En révision</SelectItem>
                  <SelectItem value="validee">Validée</SelectItem>
                  <SelectItem value="rejetee">Rejetée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des validations */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Soumissions en Validation</CardTitle>
          <CardDescription>Suivi détaillé du processus de validation de vos œuvres et projets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Soumission</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Étape Actuelle</TableHead>
                <TableHead>Délai Estimé</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validations.map((validation) => (
                <TableRow key={validation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{validation.titre}</div>
                      <div className="text-sm text-muted-foreground">{validation.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(validation.type)}</TableCell>
                  <TableCell>{validation.datesoumission}</TableCell>
                  <TableCell>{getStatutBadge(validation.statut)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{getEtapeDescription(validation.etape)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {validation.estimationDelai || <span className="text-muted-foreground">Terminé</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedValidation(validation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails de la Validation</DialogTitle>
                            <DialogDescription>Suivi détaillé - {selectedValidation?.titre}</DialogDescription>
                          </DialogHeader>
                          {selectedValidation && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Titre</Label>
                                  <div className="font-medium">{selectedValidation.titre}</div>
                                </div>
                                <div>
                                  <Label>Type</Label>
                                  {getTypeBadge(selectedValidation.type)}
                                </div>
                                <div>
                                  <Label>Date de soumission</Label>
                                  <div>{selectedValidation.datesoumission}</div>
                                </div>
                                <div>
                                  <Label>Statut actuel</Label>
                                  {getStatutBadge(selectedValidation.statut)}
                                </div>
                                <div>
                                  <Label>Étape</Label>
                                  <div>{getEtapeDescription(selectedValidation.etape)}</div>
                                </div>
                                <div>
                                  <Label>Priorité</Label>
                                  {getPrioriteBadge(selectedValidation.priorite)}
                                </div>
                              </div>

                              <div>
                                <Label>Commentaires et observations</Label>
                                <div className="text-sm bg-gray-50 p-3 rounded-lg mt-2">
                                  {selectedValidation.commentaires}
                                </div>
                              </div>

                              {selectedValidation.estimationDelai && (
                                <div>
                                  <Label>Délai estimé</Label>
                                  <div className="text-sm font-medium text-blue-600">
                                    {selectedValidation.estimationDelai}
                                  </div>
                                </div>
                              )}

                              {selectedValidation.dateValidation && (
                                <div>
                                  <Label>Date de validation</Label>
                                  <div className="text-sm font-medium text-green-600">
                                    {selectedValidation.dateValidation}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {validation.statut === "en_cours_validation" && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <Clock className="mr-1 h-3 w-3" />
                          En cours
                        </Badge>
                      )}

                      {validation.statut === "en_revision" && (
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

      {/* Processus de validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Processus de Validation
          </CardTitle>
          <CardDescription>Étapes du processus de validation pour vos soumissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
              <div>
                <div className="font-medium">Soumission initiale</div>
                <div className="text-sm text-muted-foreground">Votre œuvre ou projet est soumis pour validation</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-yellow-600">2</span>
              </div>
              <div>
                <div className="font-medium">Révision technique</div>
                <div className="text-sm text-muted-foreground">Examen du contenu et de la conformité aux standards</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">3</span>
              </div>
              <div>
                <div className="font-medium">Validation finale PDG</div>
                <div className="text-sm text-muted-foreground">Approbation finale par le PDG (droit exclusif)</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-purple-600">4</span>
              </div>
              <div>
                <div className="font-medium">Mise en production</div>
                <div className="text-sm text-muted-foreground">Publication et mise à disposition sur la plateforme</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Note d'information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Notifications Automatiques</h4>
              <p className="text-sm text-blue-700 mt-1">
                Vous recevrez des notifications automatiques à chaque étape clé du processus de validation : soumission
                confirmée, révision en cours, corrections demandées, validation finale, et mise en production. Ces
                notifications vous permettent de suivre l'avancement en temps réel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
