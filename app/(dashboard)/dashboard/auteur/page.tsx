"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/ui/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Eye,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Calculator,
  RefreshCw,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface AuthorDashboardData {
  stats: {
    totalWorks: number
    publishedWorks: number
    totalSales: number
    totalRoyaltiesGenerated: number
    totalRoyaltiesPaid: number
    totalRoyaltiesPending: number
  }
  recentWorks: Array<{
    id: string
    title: string
    discipline: string
    status: string
    sales: number
    royaltiesGenerated: number
    royaltiesPaid: number
    royaltiesPending: number
    createdAt: string
    lastPayment: string | null
    nextPayment: string | null
  }>
  recentPayments: Array<{
    id: string
    amount: number
    paid: boolean
    createdAt: string
    workTitle: string
    workDiscipline: string
    status: string
  }>
  monthlyData: Array<{
    month: string
    sales: number
    royalties: number
    royaltiesPaid: number
  }>
  notifications: Array<{
    id: string
    type: string
    title: string
    message: string
    time: string
    urgent: boolean
    icon: string
  }>
  user: {
    name: string
    email: string
    role: string
  }
}

export default function AuteurDashboard() {
  const [dashboardData, setDashboardData] = useState<AuthorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/author/dashboard", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch dashboard data")
      }
      
      const data = await response.json()
      setDashboardData(data)
      setError(null)
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
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

  if (error || !dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: {error || 'Données non disponibles'}</p>
        <Button onClick={fetchDashboardData} className="mt-4" disabled={refreshing}>
          {refreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Rechargement...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Author Context */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Tableau de Bord Auteur</h1>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Acteur Passif
              </Badge>
            </div>
            <p className="text-muted-foreground">Suivi de vos œuvres publiées et perception de vos droits financiers</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calculator className="h-4 w-4" />
                <span>Taux de royalty: 15%</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Paiements mensuels</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>Lecture seule - Pas de création</span>
              </div>
            </div>
          </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/auteur/notifications'}>
            <Bell className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <Badge variant="destructive" className="ml-2 text-xs">
              {dashboardData.notifications.length}
            </Badge>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/auteur/paiements'}>
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Rapport fiscal</span>
              <span className="sm:hidden">Rapport</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/auteur/ventes'}>
              <Eye className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Mes œuvres</span>
              <span className="sm:hidden">Œuvres</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Royalty Focus */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Œuvres Publiées"
          value={dashboardData.stats.publishedWorks.toString()}
          description="Livres en vente"
          icon={BookOpen}
          trend={{ value: 12, label: "% ce mois", type: "positive" }}
        />
        <StatsCard
          title="Ventes Totales"
          value={dashboardData.stats.totalSales.toString()}
          description="Exemplaires vendus"
          icon={TrendingUp}
          trend={{ value: 8, label: "% cette semaine", type: "positive" }}
        />
        <StatsCard
          title="Droits En Attente"
          value={formatCurrency(dashboardData.stats.totalRoyaltiesPending)}
          description="À recevoir prochainement"
          icon={Clock}
          trend={{ value: 5, label: "% en attente", type: "neutral" }}
        />
        <StatsCard
          title="Total Perçu"
          value={formatCurrency(dashboardData.stats.totalRoyaltiesPaid)}
          description="Droits versés cumulés"
          icon={CreditCard}
          trend={{ value: 15, label: "% ce mois", type: "positive" }}
        />
      </div>

      {/* Notifications Panel for Authors */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-green-600" />
            Notifications Automatiques
          </CardTitle>
          <CardDescription>Mises à jour sur vos ventes, calculs et paiements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {dashboardData.notifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2" />
              <p>Aucune notification récente</p>
            </div>
          ) : (
            dashboardData.notifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notif.message}</p>
                  <p className="text-xs text-muted-foreground">{notif.time}</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              </div>
            ))
          )}
          <Button variant="ghost" size="sm" className="w-full" onClick={() => window.location.href = '/dashboard/auteur/notifications'}>
            <Eye className="mr-2 h-4 w-4" />
            Voir toutes les notifications
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Charts with Royalty Tracking */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Evolution with Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution des Ventes & Droits
            </CardTitle>
            <CardDescription>Ventes et droits générés avec notifications automatiques</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "ventes"
                        ? `${value} exemplaires`
                        : name === "notifications"
                          ? `${value} notifications`
                          : `${value.toLocaleString()} FCFA`,
                      name === "ventes" ? "Ventes" : name === "notifications" ? "Notifications" : "Droits",
                    ]}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="droits"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Royalty Payments Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Suivi des Droits d'Auteur
            </CardTitle>
            <CardDescription>Droits dus, versés et en attente de paiement</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} FCFA`, ""]}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="royaltiesPaid" fill="hsl(var(--primary))" name="Versés" />
                  <Bar dataKey="royalties" fill="hsl(var(--chart-3))" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Works and Payments Tracking */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Enhanced My Works with Detailed Royalty Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Mes Œuvres & Droits
            </CardTitle>
            <CardDescription>Performance détaillée et suivi des royalties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentWorks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-4" />
                <p>Aucune œuvre trouvée</p>
                <Button className="mt-4" size="sm" onClick={() => window.location.href = '/dashboard/auteur/ventes'}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Voir mes œuvres
                </Button>
              </div>
            ) : (
              dashboardData.recentWorks.map((work) => (
                <div key={work.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{work.title}</h4>
                      <Badge
                        variant={work.status === "ON_SALE" ? "default" : "outline"}
                        className={work.status === "SUBMITTED" ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" : ""}
                      >
                        {work.status === "SUBMITTED" && <Clock className="mr-1 h-3 w-3" />}
                        {work.status === "ON_SALE" ? "En vente" : 
                         work.status === "SUBMITTED" ? "Soumis" : 
                         work.status === "ACCEPTED" ? "Accepté" : work.status}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {work.sales} ventes
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Droits générés:</span>
                      <p className="font-semibold text-primary">{formatCurrency(work.royaltiesGenerated)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Droits versés:</span>
                      <p className="font-semibold text-green-600">{formatCurrency(work.royaltiesPaid)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progression des paiements</span>
                      <span className="font-medium">
                        {work.royaltiesGenerated > 0 ? Math.round((work.royaltiesPaid / work.royaltiesGenerated) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={work.royaltiesGenerated > 0 ? (work.royaltiesPaid / work.royaltiesGenerated) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Dernier: {work.lastPayment ? formatDate(work.lastPayment) : "Aucun"}</span>
                    {work.nextPayment && <span>Prochain: {formatDate(work.nextPayment)}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" disabled>
                      <Eye className="mr-2 h-3 w-3" />
                      Consultation seule
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1" disabled>
                      <Calculator className="mr-2 h-3 w-3" />
                      Calculs automatiques
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Enhanced Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Historique des Paiements
            </CardTitle>
            <CardDescription>Suivi complet des versements et notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="mx-auto h-12 w-12 mb-4" />
                <p>Aucun paiement trouvé</p>
                <Button className="mt-4" size="sm" onClick={() => window.location.href = '/dashboard/auteur/paiements'}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Voir les paiements
                </Button>
              </div>
            ) : (
              dashboardData.recentPayments.map((payment) => (
                <div key={payment.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{payment.workTitle}</h4>
                      <div className="text-xs text-muted-foreground">
                        {payment.workDiscipline} • Virement bancaire
                      </div>
                    </div>
                    <Badge
                      variant={payment.paid ? "default" : "outline"}
                      className={payment.paid ? "" : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"}
                    >
                      {payment.paid && <CheckCircle className="mr-1 h-3 w-3" />}
                      {!payment.paid && <Clock className="mr-1 h-3 w-3" />}
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">{formatCurrency(payment.amount)}</span>
                      <p className="text-xs text-muted-foreground">
                        {payment.paid ? `Payé le ${formatDate(payment.createdAt)}` : "Date à confirmer"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {payment.paid && (
                        <Button size="sm" variant="outline" disabled>
                          <Download className="mr-2 h-3 w-3" />
                          Reçu automatique
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" disabled>
                        <FileText className="mr-2 h-3 w-3" />
                        Consultation seule
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
