"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  Download, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface PaymentData {
  payments: Array<{
    id: string
    amount: number
    paid: boolean
    createdAt: string
    workTitle: string
    workDiscipline: string
    status: string
    paymentMethod: string
    period: string
  }>
  stats: {
    totalRoyalties: number
    paidRoyalties: number
    pendingRoyalties: number
    totalPayments: number
    pendingPayments: number
  }
  monthlyData: Array<{
    month: string
    royalties: number
    paid: number
    pending: number
  }>
  user: {
    name: string
    email: string
    role: string
  }
}

export default function PaiementsPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPaymentData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/author/payments", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch payment data")
      }
      
      const data = await response.json()
      setPaymentData(data)
      setError(null)
    } catch (err) {
      console.error("❌ Payment fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPaymentData()
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

  const getStatusBadge = (status: string, paid: boolean) => {
    if (paid) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Payé</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">En attente</Badge>
    }
  }

  const getStatusIcon = (paid: boolean) => {
    return paid ? CheckCircle : Clock
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

  if (error || !paymentData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paiements et Royalties</h1>
            <p className="text-muted-foreground">Suivi de vos droits d'auteur et paiements</p>
          </div>
          <Button variant="outline" onClick={fetchPaymentData} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>❌ {error}</p>
              <Button variant="outline" onClick={fetchPaymentData} className="mt-4">
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
          <h1 className="text-3xl font-bold tracking-tight">Paiements et Royalties</h1>
          <p className="text-muted-foreground">Suivi de vos droits d'auteur et paiements</p>
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
          <Button variant="outline" onClick={fetchPaymentData} disabled={refreshing}>
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
            <CardTitle className="text-sm font-medium">Total des Royalties</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paymentData.stats.totalRoyalties)}</div>
            <p className="text-xs text-muted-foreground">Depuis le début</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Royalties Payées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paymentData.stats.paidRoyalties)}</div>
            <p className="text-xs text-muted-foreground">{paymentData.stats.totalPayments} paiements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(paymentData.stats.pendingRoyalties)}</div>
            <p className="text-xs text-muted-foreground">{paymentData.stats.pendingPayments} paiements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Paiement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentData.stats.totalRoyalties > 0 
                ? Math.round((paymentData.stats.paidRoyalties / paymentData.stats.totalRoyalties) * 100)
                : 0}%
            </div>
            <Progress 
              value={paymentData.stats.totalRoyalties > 0 
                ? (paymentData.stats.paidRoyalties / paymentData.stats.totalRoyalties) * 100
                : 0
              } 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="payments">Historique des Paiements</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Monthly Royalties Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Royalties</CardTitle>
                <CardDescription>Royalties générées et payées par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={paymentData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="royalties" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total" />
                    <Area type="monotone" dataKey="paid" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Payées" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Statut des Paiements</CardTitle>
                <CardDescription>Répartition des royalties par statut</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: "Payées", value: paymentData.stats.paidRoyalties, color: "#22c55e" },
                    { name: "En attente", value: paymentData.stats.pendingRoyalties, color: "#f59e0b" }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>Détail de tous vos paiements de royalties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentData.payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun paiement trouvé</p>
                  </div>
                ) : (
                  paymentData.payments.map((payment) => {
                    const StatusIcon = getStatusIcon(payment.paid)
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${payment.paid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{payment.workTitle}</h4>
                            <p className="text-sm text-muted-foreground">{payment.workDiscipline} • {payment.period}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(payment.amount)}</div>
                          {getStatusBadge(payment.status, payment.paid)}
                          <p className="text-xs text-muted-foreground">{payment.paymentMethod}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des Paiements</CardTitle>
                <CardDescription>Métriques de performance des paiements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux de paiement</span>
                  <span className="text-lg font-bold">
                    {paymentData.stats.totalRoyalties > 0 
                      ? Math.round((paymentData.stats.paidRoyalties / paymentData.stats.totalRoyalties) * 100)
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={paymentData.stats.totalRoyalties > 0 
                    ? (paymentData.stats.paidRoyalties / paymentData.stats.totalRoyalties) * 100
                    : 0
                  } 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Paiements en attente</span>
                  <span className="text-lg font-bold">{paymentData.stats.pendingPayments}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Montant moyen par paiement</span>
                  <span className="text-lg font-bold">
                    {paymentData.stats.totalPayments > 0 
                      ? formatCurrency(paymentData.stats.paidRoyalties / paymentData.stats.totalPayments)
                      : formatCurrency(0)
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations Bancaires</CardTitle>
                <CardDescription>Configuration des paiements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Méthode de paiement par défaut</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Virement bancaire</span>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Fréquence des paiements</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Mensuel</span>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Taux de royalty</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">15% du prix de vente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}