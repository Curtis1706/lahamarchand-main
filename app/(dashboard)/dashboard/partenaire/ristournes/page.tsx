"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Calculator,
  Download,
  Eye,
  Calendar,
  Percent,
} from "lucide-react"

export default function RistournesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("mois_courant")

  // Mock data for ristournes
  const ristournes = [
    {
      id: "RIST-2024-001",
      commandeId: "CMD-ECOLE-001",
      ecole: "Lycée Léon Mba",
      dateCommande: "2024-01-28",
      dateValidation: "2024-01-29",
      montantCommande: 450000,
      tauxRistourne: 15,
      montantRistourne: 67500,
      statut: "calculee",
      dateCalcul: "2024-01-30",
      typeLivre: "secondaire",
      periode: "Janvier 2024",
    },
    {
      id: "RIST-2024-002",
      commandeId: "CMD-ECOLE-002",
      ecole: "École Publique de l'Indépendance",
      dateCommande: "2024-01-25",
      dateValidation: "2024-01-26",
      montantCommande: 228000,
      tauxRistourne: 12,
      montantRistourne: 27360,
      statut: "payee",
      dateCalcul: "2024-01-27",
      datePaiement: "2024-02-01",
      typeLivre: "primaire",
      periode: "Janvier 2024",
    },
    {
      id: "RIST-2024-003",
      commandeId: "CMD-ECOLE-003",
      ecole: "Collège Saint-Gabriel",
      dateCommande: "2024-01-20",
      dateValidation: "2024-01-21",
      montantCommande: 360000,
      tauxRistourne: 15,
      montantRistourne: 54000,
      statut: "en_attente_paiement",
      dateCalcul: "2024-01-22",
      typeLivre: "secondaire",
      periode: "Janvier 2024",
    },
    {
      id: "RIST-2024-004",
      commandeId: "CMD-ECOLE-004",
      ecole: "École Privée Les Poussins",
      dateCommande: "2024-01-15",
      dateValidation: "2024-01-16",
      montantCommande: 162000,
      tauxRistourne: 10,
      montantRistourne: 16200,
      statut: "payee",
      dateCalcul: "2024-01-17",
      datePaiement: "2024-01-25",
      typeLivre: "primaire",
      periode: "Janvier 2024",
    },
  ]

  const tauxRistournes = [
    { type: "primaire", taux: 12, description: "Livres primaires" },
    { type: "secondaire", taux: 15, description: "Livres secondaires" },
    { type: "promotionnel", taux: 20, description: "Périodes promotionnelles" },
  ]

  const historiquePaiements = [
    {
      id: "PAY-2024-001",
      date: "2024-02-01",
      periode: "Janvier 2024",
      montant: 27360,
      method: "Mobile Money",
      reference: "MM-2024-001",
      statut: "effectue",
    },
    {
      id: "PAY-2024-002",
      date: "2024-01-25",
      periode: "Décembre 2023",
      montant: 45000,
      method: "Mobile Money",
      reference: "MM-2024-002",
      statut: "effectue",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "calculee":
        return <Badge className="bg-blue-100 text-blue-800">Calculée</Badge>
      case "en_attente_paiement":
        return <Badge className="bg-amber-100 text-amber-800">En Attente Paiement</Badge>
      case "payee":
        return <Badge className="bg-green-100 text-green-800">Payée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLivreBadge = (type: string) => {
    switch (type) {
      case "primaire":
        return <Badge className="bg-green-100 text-green-800">Primaire</Badge>
      case "secondaire":
        return <Badge className="bg-blue-100 text-blue-800">Secondaire</Badge>
      case "promotionnel":
        return <Badge className="bg-purple-100 text-purple-800">Promotionnel</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const totalRistournes = ristournes.reduce((sum, r) => sum + r.montantRistourne, 0)
  const ristournesPayees = ristournes.filter(r => r.statut === "payee").reduce((sum, r) => sum + r.montantRistourne, 0)
  const ristournesEnAttente = ristournes.filter(r => r.statut === "en_attente_paiement").reduce((sum, r) => sum + r.montantRistourne, 0)
  const nombreCommandes = ristournes.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ristournes Partenaires</h1>
          <p className="text-muted-foreground">Suivi de vos ristournes automatiques sur les commandes validées</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter Relevé
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ristournes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRistournes.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Cette période</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ristournesPayees.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Montant reçu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{ristournesEnAttente.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Paiement en cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nombreCommandes}</div>
            <p className="text-xs text-muted-foreground">Avec ristournes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ristournes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ristournes">Ristournes ({ristournes.length})</TabsTrigger>
          <TabsTrigger value="paiements">Paiements ({historiquePaiements.length})</TabsTrigger>
          <TabsTrigger value="taux">Taux de Ristournes</TabsTrigger>
        </TabsList>

        <TabsContent value="ristournes" className="space-y-4">
          {/* Ristournes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Détail des Ristournes</CardTitle>
              <CardDescription>Ristournes automatiques calculées sur vos commandes validées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Ristourne</TableHead>
                      <TableHead>Commande</TableHead>
                      <TableHead>École</TableHead>
                      <TableHead>Type Livre</TableHead>
                      <TableHead>Montant Commande</TableHead>
                      <TableHead>Taux</TableHead>
                      <TableHead>Ristourne</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ristournes.map((ristourne) => (
                      <TableRow key={ristourne.id}>
                        <TableCell className="font-mono text-sm">{ristourne.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{ristourne.commandeId}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(ristourne.dateCommande).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{ristourne.ecole}</div>
                        </TableCell>
                        <TableCell>{getTypeLivreBadge(ristourne.typeLivre)}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{ristourne.montantCommande.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ristourne.tauxRistourne}%</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-green-600">{ristourne.montantRistourne.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(ristourne.statut)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="paiements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>Paiements de ristournes reçus via Mobile Money</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Paiement</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Mode de Paiement</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historiquePaiements.map((paiement) => (
                      <TableRow key={paiement.id}>
                        <TableCell>{new Date(paiement.date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{paiement.periode}</TableCell>
                        <TableCell>
                          <div className="font-bold text-green-600">{paiement.montant.toLocaleString()} FCFA</div>
                        </TableCell>
                        <TableCell>{paiement.method}</TableCell>
                        <TableCell className="font-mono text-sm">{paiement.reference}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Effectué
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taux" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taux de Ristournes Actuels</CardTitle>
              <CardDescription>Grille tarifaire des ristournes par type de livre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tauxRistournes.map((taux) => (
                  <div key={taux.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Percent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium capitalize">{taux.description}</div>
                        <div className="text-sm text-muted-foreground">Type: {taux.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{taux.taux}%</div>
                      <div className="text-sm text-muted-foreground">Ristourne</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Information :</strong> Les taux de ristournes sont identiques pour tous les partenaires 
              et peuvent être modifiés à tout moment par LAHA Éditions. Les ristournes sont calculées 
              automatiquement sur chaque commande validée et totalement réglée par l'école.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Ristournes Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution des Ristournes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Janvier 2024</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-sm font-semibold">165,060 FCFA</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Décembre 2023</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                  <span className="text-sm font-semibold">135,200 FCFA</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Novembre 2023</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                  <span className="text-sm font-semibold">115,800 FCFA</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calcul de Ristourne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Exemple de Calcul</div>
                <div className="text-sm text-blue-600 mt-1">
                  Commande: 450,000 FCFA (Livres Secondaires)<br/>
                  Taux: 15%<br/>
                  Ristourne: 67,500 FCFA
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Les ristournes sont calculées automatiquement dès que la commande 
                est validée et le paiement confirmé par l'école.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
