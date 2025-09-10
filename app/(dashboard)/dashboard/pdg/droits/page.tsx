"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/ui/stats-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DollarSign, Search, Eye, Download, CreditCard, CheckCircle, Clock, Calculator } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const royaltyData = [
  { month: "Jan", dus: 2700000, verses: 2500000, enAttente: 200000 },
  { month: "Fév", dus: 3037500, verses: 3037500, enAttente: 0 },
  { month: "Mar", dus: 2655000, verses: 2400000, enAttente: 255000 },
  { month: "Avr", dus: 3420000, verses: 3200000, enAttente: 220000 },
  { month: "Mai", dus: 3195000, verses: 3195000, enAttente: 0 },
  { month: "Jun", dus: 3780000, verses: 0, enAttente: 3780000 },
]

const pendingPayments = [
  {
    id: "PAY001",
    beneficiaire: "Jean Mbongo",
    type: "Auteur",
    oeuvre: "Histoire du Gabon Moderne",
    montant: 234000,
    periode: "Juin 2024",
    ventes: 156,
    taux: 15,
  },
  {
    id: "PAY002",
    beneficiaire: "Marie Nzé",
    type: "Concepteur",
    oeuvre: "Mathématiques Appliquées",
    montant: 189000,
    periode: "Juin 2024",
    ventes: 105,
    taux: 18,
  },
  {
    id: "PAY003",
    beneficiaire: "Paul Obame",
    type: "Auteur",
    oeuvre: "Contes et Légendes",
    montant: 156750,
    periode: "Juin 2024",
    ventes: 125,
    taux: 12.5,
  },
]

const recentPayments = [
  {
    id: "PAY004",
    beneficiaire: "Sophie Mba",
    montant: 145000,
    date: "2024-01-10",
    statut: "Payé",
    methode: "Virement",
  },
  {
    id: "PAY005",
    beneficiaire: "Centre Culturel",
    montant: 89000,
    date: "2024-01-08",
    statut: "Payé",
    methode: "Chèque",
  },
  {
    id: "PAY006",
    beneficiaire: "Librairie Moderne",
    montant: 234000,
    date: "2024-01-05",
    statut: "En cours",
    methode: "Virement",
  },
]

const topEarners = [
  { nom: "Jean Mbongo", droits: 1456000, oeuvres: 8, moyenne: 182000 },
  { nom: "Marie Nzé", droits: 1234000, oeuvres: 5, moyenne: 246800 },
  { nom: "Paul Obame", droits: 987000, oeuvres: 12, moyenne: 82250 },
  { nom: "Sophie Mba", droits: 756000, oeuvres: 3, moyenne: 252000 },
]

export default function DroitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])

  const filteredPayments = pendingPayments.filter(
    (payment) =>
      payment.beneficiaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.oeuvre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.montant, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Droits</h1>
          <p className="text-muted-foreground">Calcul et paiement des droits d'auteur et concepteurs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Recalculer droits
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter rapport
          </Button>
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button disabled={selectedPayments.length === 0}>
                <CreditCard className="h-4 w-4 mr-2" />
                Effectuer paiements ({selectedPayments.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Effectuer les paiements</DialogTitle>
                <DialogDescription>Traitement des droits sélectionnés</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Résumé des paiements</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nombre de bénéficiaires:</span>
                      <p className="font-semibold">{selectedPayments.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Montant total:</span>
                      <p className="font-semibold">
                        {pendingPayments
                          .filter((p) => selectedPayments.includes(p.id))
                          .reduce((sum, p) => sum + p.montant, 0)
                          .toLocaleString()}{" "}
                        FCFA
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Méthode de paiement</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virement">Virement bancaire</SelectItem>
                      <SelectItem value="cheque">Chèque</SelectItem>
                      <SelectItem value="especes">Espèces</SelectItem>
                      <SelectItem value="mobile">Paiement mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Confirmer les paiements</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Droits en Attente"
          value={`${totalPending.toLocaleString()} FCFA`}
          description="À payer ce mois"
          icon={Clock}
          trend={{ value: 0, label: "stable", type: "neutral" }}
        />
        <StatsCard
          title="Droits Versés"
          value="3,195,000 FCFA"
          description="Mois dernier"
          icon={CheckCircle}
          trend={{ value: 12, label: "vs précédent", type: "positive" }}
        />
        <StatsCard
          title="Bénéficiaires Actifs"
          value="47"
          description="Auteurs et concepteurs"
          icon={DollarSign}
          trend={{ value: 3, label: "nouveaux", type: "positive" }}
        />
        <StatsCard
          title="Taux Moyen"
          value="15.2%"
          description="Droits sur ventes"
          icon={Calculator}
          trend={{ value: 0.5, label: "points", type: "positive" }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Royalty Evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Évolution des Droits
            </CardTitle>
            <CardDescription>Droits dus vs versés (6 derniers mois)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={royaltyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, ""]} />
                <Bar dataKey="dus" fill="hsl(var(--accent))" name="Dus" />
                <Bar dataKey="verses" fill="hsl(var(--primary))" name="Versés" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Earners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Top Bénéficiaires
            </CardTitle>
            <CardDescription>Classement par droits générés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEarners.map((earner, index) => (
                <div key={earner.nom} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{earner.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        {earner.oeuvres} œuvres • Moy: {earner.moyenne.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{earner.droits.toLocaleString()} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            En Attente ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Paiements Récents
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculateur
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par bénéficiaire ou œuvre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Mois en cours</SelectItem>
                    <SelectItem value="previous">Mois précédent</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedPayments.length === filteredPayments.length) {
                      setSelectedPayments([])
                    } else {
                      setSelectedPayments(filteredPayments.map((p) => p.id))
                    }
                  }}
                >
                  {selectedPayments.length === filteredPayments.length ? "Désélectionner tout" : "Sélectionner tout"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments List */}
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPayments([...selectedPayments, payment.id])
                          } else {
                            setSelectedPayments(selectedPayments.filter((id) => id !== payment.id))
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{payment.beneficiaire}</h3>
                          <Badge variant="secondary">{payment.type}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {payment.oeuvre} • {payment.periode}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ventes:</span>
                            <p className="font-medium">{payment.ventes} exemplaires</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Taux:</span>
                            <p className="font-medium">{payment.taux}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Calcul:</span>
                            <p className="font-medium">Auto</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Statut:</span>
                            <Badge variant="outline">En attente</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{payment.montant.toLocaleString()} FCFA</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Paiements Récents
              </CardTitle>
              <CardDescription>Historique des derniers versements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={payment.statut === "Payé" ? "default" : "outline"}>{payment.statut}</Badge>
                      <div>
                        <p className="font-medium">{payment.beneficiaire}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.id} • {payment.date} • {payment.methode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{payment.montant.toLocaleString()} FCFA</p>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculateur de Droits
              </CardTitle>
              <CardDescription>Simulation et calcul manuel des droits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="calc-oeuvre">Œuvre</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une œuvre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="histoire-gabon">Histoire du Gabon Moderne</SelectItem>
                        <SelectItem value="maths-appliquees">Mathématiques Appliquées</SelectItem>
                        <SelectItem value="contes-gabon">Contes et Légendes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calc-ventes">Nombre de ventes</Label>
                    <Input id="calc-ventes" type="number" placeholder="156" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calc-prix">Prix unitaire (FCFA)</Label>
                    <Input id="calc-prix" type="number" placeholder="15000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calc-taux">Taux de droits (%)</Label>
                    <Input id="calc-taux" type="number" placeholder="15" />
                  </div>
                  <Button className="w-full">Calculer</Button>
                </div>
                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-medium mb-4">Résultat du calcul</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Chiffre d'affaires:</span>
                      <span className="font-medium">2,340,000 FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux appliqué:</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Droits dus:</span>
                        <span className="font-bold text-primary">351,000 FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
