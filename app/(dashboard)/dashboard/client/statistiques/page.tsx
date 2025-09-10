"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts"
import { ShoppingCart, BookOpen, Heart, TrendingUp, Download, Star, Calendar, Gift, User, ArrowUp, ArrowDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface StatsData {
  metrics: {
    totalOrders: number
    totalBooks: number
    totalAmount: number
    deliveredOrders: number
    averageOrderValue: number
    averageBooksPerOrder: number
    monthlyFrequency: number
  }
  purchaseHistory: Array<{
    month: string
    commandes: number
    montant: number
    livres: number
  }>
  categoryPreferences: Array<{
    name: string
    value: number
    amount: number
    color: string
  }>
  topAuthors: Array<{
    name: string
    books: number
    amount: number
  }>
  recentOrders: Array<{
    id: string
    date: string
    items: number
    total: number
    status: string
  }>
  comparison: {
    currentMonth: { orders: number; amount: number }
    previousMonth: { orders: number; amount: number }
    growth: {
      orders: number
      amount: number
      ordersPercent: number
      amountPercent: number
    }
  }
  profile: {
    level: string
    points: number
    nextLevelPoints: number
  }
}

export default function ClientStatistiques() {
  const { user } = useAuth()
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch('/api/client/stats', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const data = await response.json()
        setStatsData(data)
      } catch (err) {
        console.error('Stats fetch error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos statistiques...</p>
        </div>
      </div>
    )
  }

  if (error || !statsData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: {error || 'Données non disponibles'}</p>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Statistiques</h1>
          <p className="text-muted-foreground">Analyse de vos habitudes d'achat et préférences</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Exporter l'historique
        </Button>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.metrics.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {statsData.comparison.growth.orders > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{statsData.comparison.growth.orders}</span>
                </>
              ) : statsData.comparison.growth.orders < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{statsData.comparison.growth.orders}</span>
                </>
              ) : (
                <span>Stable</span>
              )}
              <span className="ml-1">ce mois</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livres Achetés</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.metrics.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              Moy. {statsData.metrics.averageBooksPerOrder}/commande
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.metrics.totalAmount.toLocaleString()} FCFA</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {statsData.comparison.growth.amount > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{statsData.comparison.growth.amount.toLocaleString()}</span>
                </>
              ) : statsData.comparison.growth.amount < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{statsData.comparison.growth.amount.toLocaleString()}</span>
                </>
              ) : (
                <span>Stable</span>
              )}
              <span className="ml-1">ce mois</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.metrics.averageOrderValue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">
              {statsData.metrics.monthlyFrequency.toFixed(1)} commandes/mois
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="achats">Mes Achats</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="recommandations">Recommandations</TabsTrigger>
          <TabsTrigger value="fidelite">Fidélité</TabsTrigger>
        </TabsList>

        <TabsContent value="achats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution de mes Achats</CardTitle>
                <CardDescription>Historique mensuel de vos commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={statsData.purchaseHistory}>
                    <defs>
                      <linearGradient id="colorCommandes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'montant' ? `${Number(value).toLocaleString()} FCFA` : value,
                        name === 'montant' ? 'Montant' : name === 'commandes' ? 'Commandes' : 'Livres'
                      ]}
                    />
                    <Area type="monotone" dataKey="commandes" stackId="1" stroke="#8884d8" fillOpacity={1} fill="url(#colorCommandes)" />
                    <Area type="monotone" dataKey="livres" stackId="2" stroke="#82ca9d" fillOpacity={1} fill="url(#colorMontant)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commandes Récentes</CardTitle>
                <CardDescription>Vos derniers achats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statsData.recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(order.date).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <span>{order.items} article{order.items > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total.toLocaleString()} FCFA</p>
                        <Badge variant={
                          order.status === "DELIVERED" ? "default" :
                          order.status === "VALIDATED" ? "secondary" :
                          order.status === "PENDING" ? "outline" : "destructive"
                        }>
                          {order.status === "DELIVERED" ? "Livré" :
                           order.status === "VALIDATED" ? "Validé" :
                           order.status === "PENDING" ? "En attente" :
                           order.status === "CANCELLED" ? "Annulé" : order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Catégories Préférées</CardTitle>
                <CardDescription>Répartition de vos achats par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                {statsData.categoryPreferences.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.categoryPreferences}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statsData.categoryPreferences.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} livres (${props.payload.amount.toLocaleString()} FCFA)`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="mx-auto h-12 w-12 mb-4" />
                    <p>Aucune donnée de préférence disponible</p>
                    <p className="text-sm">Commandez des livres pour voir vos préférences !</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Habitudes d'Achat</CardTitle>
                <CardDescription>Analyse de vos comportements d'achat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fréquence d'achat</span>
                    <span>{statsData.metrics.monthlyFrequency.toFixed(1)} fois/mois</span>
                  </div>
                  <Progress value={Math.min(statsData.metrics.monthlyFrequency * 20, 100)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Panier moyen</span>
                    <span>{statsData.metrics.averageOrderValue.toLocaleString()} FCFA</span>
                  </div>
                  <Progress value={Math.min((statsData.metrics.averageOrderValue / 50000) * 100, 100)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Livres par commande</span>
                    <span>{statsData.metrics.averageBooksPerOrder.toFixed(1)} livres</span>
                  </div>
                  <Progress value={Math.min(statsData.metrics.averageBooksPerOrder * 20, 100)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Statut fidélité</span>
                    <span>Niveau {statsData.profile.level}</span>
                  </div>
                  <Progress value={
                    statsData.profile.level === 'Gold' ? 100 :
                    statsData.profile.level === 'Silver' ? 66 : 33
                  } />
                </div>
                
                {/* Top auteurs préférés */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Vos auteurs préférés</h4>
                  <div className="space-y-2">
                    {statsData.topAuthors.slice(0, 3).map((author, index) => (
                      <div key={author.name} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm">{author.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{author.books} livre{author.books > 1 ? 's' : ''}</div>
                          <div className="text-xs text-muted-foreground">{author.amount.toLocaleString()} FCFA</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Profil: {statsData.profile.level === 'Gold' ? 'Lecteur Expert' : 
                             statsData.profile.level === 'Silver' ? 'Lecteur Assidu' : 'Lecteur Débutant'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {statsData.categoryPreferences.length > 0 
                      ? `Vous préférez les ${statsData.categoryPreferences[0].name.toLowerCase()} avec ${statsData.metrics.totalOrders} commande${statsData.metrics.totalOrders > 1 ? 's' : ''} passée${statsData.metrics.totalOrders > 1 ? 's' : ''}`
                      : 'Commencez à acheter pour découvrir votre profil de lecteur'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommandations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations Personnalisées</CardTitle>
                <CardDescription>Basées sur vos achats précédents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-16 bg-blue-100 rounded flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Physique Quantique Moderne</h4>
                      <p className="text-sm text-muted-foreground">Dr. Jean Nkomo</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">4.7 • Sciences</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">6,500 FCFA</p>
                      <Badge variant="secondary">95% match</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-16 bg-green-100 rounded flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Mathématiques Appliquées</h4>
                      <p className="text-sm text-muted-foreground">Prof. Marie Obame</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">4.5 • Sciences</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">5,800 FCFA</p>
                      <Badge variant="secondary">88% match</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-16 bg-purple-100 rounded flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Chimie Organique</h4>
                      <p className="text-sm text-muted-foreground">Dr. Paul Mba</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">4.6 • Sciences</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">7,200 FCFA</p>
                      <Badge variant="secondary">82% match</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendances Populaires</CardTitle>
                <CardDescription>Ce que lisent les autres clients comme vous</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">Intelligence Artificielle</p>
                      <p className="text-sm text-muted-foreground">Tendance #1 cette semaine</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Développement Durable</p>
                      <p className="text-sm text-muted-foreground">+45% d'intérêt</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Histoire Contemporaine</p>
                      <p className="text-sm text-muted-foreground">Populaire ce mois</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fidelite" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Programme de Fidélité</CardTitle>
                <CardDescription>Vos points et avantages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <p className="text-sm text-muted-foreground">Points de fidélité</p>
                  <Badge className="mt-2">Client Gold</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prochain niveau (Platinum)</span>
                    <span className="text-sm font-medium">753 points restants</span>
                  </div>
                  <Progress value={62} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Avantages actuels:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 5% de réduction sur tous les achats</li>
                    <li>• Livraison gratuite dès 10,000 FCFA</li>
                    <li>• Accès prioritaire aux nouveautés</li>
                    <li>• Support client prioritaire</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Récompenses Disponibles</CardTitle>
                <CardDescription>Échangez vos points contre des avantages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Livre gratuit</p>
                        <p className="text-sm text-muted-foreground">Valeur jusqu'à 5,000 FCFA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">500 pts</p>
                      <Button size="sm" variant="outline">
                        Échanger
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Réduction 10%</p>
                        <p className="text-sm text-muted-foreground">Sur votre prochain achat</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">200 pts</p>
                      <Button size="sm" variant="outline">
                        Échanger
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Livraison premium</p>
                        <p className="text-sm text-muted-foreground">Livraison express gratuite</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">1,500 pts</p>
                      <Button size="sm" variant="outline" disabled>
                        Indisponible
                      </Button>
                    </div>
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
