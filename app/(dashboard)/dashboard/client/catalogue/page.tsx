"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  DollarSign,
  User,
  Hash,
  Calendar,
  Star,
  Eye,
  ShoppingBag,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Work {
  id: string
  title: string
  isbn?: string
  price: number
  discipline: string
  disciplineId: string
  author: string
  concepteur: string
  createdAt: string
  totalSales: number
  priceFormatted: string
  availability: string
}

interface CartItem {
  work: Work
  quantity: number
}

interface Discipline {
  id: string
  name: string
}

export default function CataloguePage() {
  const { user } = useAuth()
  const [works, setWorks] = useState<Work[]>([])
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Charger les données du catalogue
  useEffect(() => {
    async function fetchCatalogData() {
      try {
        setLoading(true)
        const response = await fetch('/api/client/catalog', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch catalog data')
        }
        
        const data = await response.json()
        setWorks(data.works)
        setDisciplines(data.disciplines)
      } catch (err) {
        console.error('Catalog fetch error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCatalogData()
  }, [])

  // Appliquer les filtres (les œuvres sont déjà filtrées côté API pour être ON_SALE)
  const filteredWorks = works.filter((work: Work) => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.concepteur.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDiscipline = disciplineFilter === "all" || work.disciplineId === disciplineFilter
    
    let matchesPrice = true
    if (priceFilter === "low") matchesPrice = work.price < 15000
    else if (priceFilter === "medium") matchesPrice = work.price >= 15000 && work.price < 30000
    else if (priceFilter === "high") matchesPrice = work.price >= 30000
    
    return matchesSearch && matchesDiscipline && matchesPrice
  })

  // Ajouter au panier
  const addToCart = (work: Work) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.work.id === work.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.work.id === work.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { work, quantity: 1 }]
      }
    })
  }

  // Retirer du panier
  const removeFromCart = (workId: string) => {
    setCart(prevCart => prevCart.filter(item => item.work.id !== workId))
  }

  // Modifier la quantité dans le panier
  const updateQuantity = (workId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(workId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.work.id === workId
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    }
  }

  // Calculer le total du panier
  const cartTotal = cart.reduce((total, item) => total + (item.work.price * item.quantity), 0)
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Passer commande
  const handleCheckout = async () => {
    if (!user) {
      alert("Vous devez être connecté pour passer commande")
      return
    }

    if (cart.length === 0) {
      alert("Votre panier est vide")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("🛒 Creating order...")
      console.log("User:", user)
      console.log("Cart:", cart)

      const orderData = {
        items: cart.map(item => ({
          workId: item.work.id,
          quantity: item.quantity
        }))
      }

      console.log("Order data:", orderData)

      const response = await fetch('/api/client/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const result = await response.json()
      console.log("✅ Order created:", result)

      alert("Commande passée avec succès !")
      setCart([])
      setIsCartOpen(false)
    } catch (error) {
      console.error("❌ Checkout error:", error)
      alert(`Erreur lors de la création de la commande: ${error instanceof Error ? error.message : error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du catalogue...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec panier */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground lg:text-3xl break-words">
            Catalogue des Œuvres
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Découvrez et commandez les œuvres disponibles
          </p>
        </div>
        
        <Button 
          onClick={() => setIsCartOpen(!isCartOpen)} 
          className="relative"
          variant={cart.length > 0 ? "default" : "outline"}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Panier
          {cartItemsCount > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">
              {cartItemsCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Panier (collapsible) */}
      {isCartOpen && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Mon Panier ({cartItemsCount} article{cartItemsCount > 1 ? 's' : ''})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-muted-foreground">Votre panier est vide</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.work.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.work.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.work.discipline}</p>
                      <p className="text-sm font-medium">{item.work.price.toLocaleString()} FCFA</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.work.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.work.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.work.id)}
                      >
                        Retirer
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold">{cartTotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCart([])}>
                      Vider le panier
                    </Button>
                    <Button 
                      onClick={handleCheckout} 
                      disabled={isSubmitting || cart.length === 0}
                      className="flex-1"
                    >
                      {isSubmitting ? "Commande en cours..." : "Passer commande"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recherche et filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre, discipline ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Toutes les disciplines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les disciplines</SelectItem>
                {disciplines.map((discipline) => (
                  <SelectItem key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tous les prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="low">Moins de 15 000 FCFA</SelectItem>
                <SelectItem value="medium">15 000 - 30 000 FCFA</SelectItem>
                <SelectItem value="high">Plus de 30 000 FCFA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredWorks.length} œuvre{filteredWorks.length > 1 ? 's' : ''} disponible{filteredWorks.length > 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Catalogue des œuvres */}
      {filteredWorks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune œuvre disponible avec ces critères</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work: Work) => (
            <Card key={work.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{work.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center gap-1 text-sm">
                        <BookOpen className="h-3 w-3" />
                        {work.discipline}
                      </div>
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-xs">
                    En vente
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {work.isbn && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      ISBN: {work.isbn}
                    </div>
                  )}
                  {work.author && work.author !== "Auteur inconnu" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      Auteur: {work.author}
                    </div>
                  )}
                  {work.concepteur && work.concepteur !== "Concepteur inconnu" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-3 w-3" />
                      Concepteur: {work.concepteur}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Publié le {new Date(work.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-xl font-bold text-green-600">
                        {work.price.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-2 h-3 w-3" />
                    Aperçu
                  </Button>
                  <Button 
                    onClick={() => addToCart(work)}
                    size="sm" 
                    className="flex-1"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}