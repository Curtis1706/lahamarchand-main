"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  Download,
  RefreshCw,
  Calendar,
  CreditCard
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface RoyaltyData {
  royalties: Array<{
    id: string
    workId: string
    userId: string
    amount: number
    paid: boolean
    createdAt: string
    work: {
      id: string
      title: string
      discipline: {
        name: string
      }
    }
    user: {
      name: string
      email: string
    }
  }>
  stats: {
    totalPending: number
    totalAmount: number
    authorsCount: number
    oldestPending: string | null
  }
}

interface PaymentHistory {
  payments: Array<{
    id: string
    workId: string
    userId: string
    amount: number
    paid: boolean
    createdAt: string
    work: {
      id: string
      title: string
      discipline: {
        name: string
      }
    }
    user: {
      name: string
      email: string
    }
  }>
  stats: {
    totalPaid: number
    totalAmount: number
    authorsCount: number
    lastPayment: string | null
  }
}

export default function RoyaltiesPage() {
  const [royaltyData, setRoyaltyData] = useState<RoyaltyData | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedRoyalties, setSelectedRoyalties] = useState<string[]>([])
  const [processingPayment, setProcessingPayment] = useState(false)

  const fetchRoyaltyData = async () => {
    try {
      setRefreshing(true)
      
      // Récupérer les royalties en attente
      const pendingResponse = await fetch("/api/royalties/calculate", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
      
      if (!pendingResponse.ok) {
        throw new Error("Failed to fetch pending royalties")
      }
      
      const pendingData = await pendingResponse.json()
      setRoyaltyData(pendingData)

      // Récupérer l'historique des paiements
      const historyResponse = await fetch("/api/royalties/pay", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
      
      if (!historyResponse.ok) {
        throw new Error("Failed to fetch payment history")
      }
      
      const historyData = await historyResponse.json()
      setPaymentHistory(historyData)

      setError(null)
    } catch (err) {
      console.error("❌ Royalty fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRoyaltyData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF"
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const handleSelectRoyalty = (royaltyId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoyalties([...selectedRoyalties, royaltyId])
    } else {
      setSelectedRoyalties(selectedRoyalties.filter(id => id !== royaltyId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && royaltyData) {
      setSelectedRoyalties(royaltyData.royalties.map(r => r.id))
    } else {
      setSelectedRoyalties([])
    }
  }

  const handlePaySelected = async () => {
    if (selectedRoyalties.length === 0) return

    try {
      setProcessingPayment(true)
      
      const response = await fetch("/api/royalties/pay", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          royaltyIds: selectedRoyalties,
          paymentMethod: "Virement bancaire",
          paymentDate: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to process payments")
      }
      
      const result = await response.json()
      console.log("✅ Payments processed:", result)
      
      // Actualiser les données
      await fetchRoyaltyData()
      setSelectedRoyalties([])
      
    } catch (err) {
      console.error("❌ Payment processing error:", err)
      setError(err instanceof Error ? err.message : "Payment processing failed")
    } finally {
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Royalties</h1>
            <p className="text-muted-foreground">Gestion des droits d'auteur et paiements</p>
          </div>
          <Button variant="outline" onClick={fetchRoyaltyData} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>❌ {error}</p>
              <Button variant="outline" onClick={fetchRoyaltyData} className="mt-4">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Royalties</h1>
          <p className="text-muted-foreground">Gestion des droits d'auteur et paiements</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>Taux de royalty: 15%</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Paiements mensuels</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>Virement bancaire</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRoyaltyData} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {royaltyData?.stats.totalAmount ? formatCurrency(royaltyData.stats.totalAmount) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {royaltyData?.stats.totalPending || 0} royalties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auteurs Concernés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{royaltyData?.stats.authorsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Auteurs en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payé</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {paymentHistory?.stats.totalAmount ? formatCurrency(paymentHistory.stats.totalAmount) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentHistory?.stats.totalPaid || 0} paiements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Paiement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {royaltyData?.stats.totalAmount && paymentHistory?.stats.totalAmount 
                ? Math.round((paymentHistory.stats.totalAmount / (royaltyData.stats.totalAmount + paymentHistory.stats.totalAmount)) * 100)
                : 0}%
            </div>
            <Progress 
              value={royaltyData?.stats.totalAmount && paymentHistory?.stats.totalAmount 
                ? (paymentHistory.stats.totalAmount / (royaltyData.stats.totalAmount + paymentHistory.stats.totalAmount)) * 100
                : 0
              } 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">En Attente ({royaltyData?.stats.totalPending || 0})</TabsTrigger>
          <TabsTrigger value="history">Historique ({paymentHistory?.stats.totalPaid || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Royalties en Attente de Paiement</CardTitle>
                  <CardDescription>Royalties générées en attente de versement aux auteurs</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectAll(selectedRoyalties.length !== royaltyData?.royalties.length)}
                  >
                    {selectedRoyalties.length === royaltyData?.royalties.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </Button>
                  <Button 
                    onClick={handlePaySelected}
                    disabled={selectedRoyalties.length === 0 || processingPayment}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Payer Sélectionnés ({selectedRoyalties.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {royaltyData?.royalties.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune royalty en attente</p>
                  </div>
                ) : (
                  royaltyData?.royalties.map((royalty) => (
                    <div key={royalty.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Checkbox
                        checked={selectedRoyalties.includes(royalty.id)}
                        onCheckedChange={(checked) => handleSelectRoyalty(royalty.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{royalty.work.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {royalty.user.name} • {royalty.work.discipline.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Créé le {formatDate(royalty.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(royalty.amount)}</div>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          En attente
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>Historique de tous les paiements de royalties effectués</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory?.payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun paiement dans l'historique</p>
                  </div>
                ) : (
                  paymentHistory?.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{payment.work.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {payment.user.name} • {payment.work.discipline.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Payé le {formatDate(payment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(payment.amount)}</div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Payé
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
