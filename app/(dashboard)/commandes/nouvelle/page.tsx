"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Minus,
  ShoppingCart,
  User,
  CreditCard,
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"

export default function NouvelleCommandePage() {
  const [orderType, setOrderType] = useState("")
  const [isGuestOrder, setIsGuestOrder] = useState(false)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Mathématiques Appliquées au Développement",
      isbn: "978-2-1234-5678-9",
      price: 25000,
      quantity: 1,
      stock: 45,
    },
  ])

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  })

  const availableBooks = [
    {
      id: 1,
      title: "Mathématiques Appliquées au Développement",
      isbn: "978-2-1234-5678-9",
      price: 25000,
      stock: 45,
      discipline: "Sciences",
    },
    {
      id: 2,
      title: "Introduction à la Physique Quantique",
      isbn: "978-2-1234-5679-6",
      price: 30000,
      stock: 23,
      discipline: "Sciences",
    },
    {
      id: 3,
      title: "Histoire du Gabon Moderne",
      isbn: "978-2-1234-5680-2",
      price: 18000,
      stock: 67,
      discipline: "Histoire",
    },
    {
      id: 4,
      title: "Littérature Gabonaise Contemporaine",
      isbn: "978-2-1234-5681-9",
      price: 22000,
      stock: 34,
      discipline: "Littérature",
    },
  ]

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const addToCart = (book: any) => {
    const existingItem = cartItems.find((item) => item.id === book.id)
    if (existingItem) {
      updateQuantity(book.id, existingItem.quantity + 1)
    } else {
      setCartItems([...cartItems, { ...book, quantity: 1 }])
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle Commande</h1>
          <p className="text-muted-foreground">Créer une commande client ou partenaire</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Type de Commande
              </CardTitle>
              <CardDescription>Sélectionnez le type de client pour cette commande</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    orderType === "particulier" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setOrderType("particulier")}
                >
                  <div className="font-medium">Client Particulier</div>
                  <div className="text-sm text-muted-foreground">Commande individuelle</div>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    orderType === "partenaire" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setOrderType("partenaire")}
                >
                  <div className="font-medium">Partenaire</div>
                  <div className="text-sm text-muted-foreground">Librairie, distributeur</div>
                </div>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  orderType === "institution" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setOrderType("institution")}
              >
                <div className="font-medium">Institution</div>
                <div className="text-sm text-muted-foreground">École, université, administration</div>
              </div>

              {orderType === "particulier" && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="guest-order" checked={isGuestOrder} onCheckedChange={setIsGuestOrder} />
                  <Label htmlFor="guest-order">Commande invité (sans compte)</Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Information */}
          {orderType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isGuestOrder ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guest-name">Nom Complet *</Label>
                      <Input
                        id="guest-name"
                        value={guestInfo.name}
                        onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                        placeholder="Nom et prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-phone">Téléphone *</Label>
                      <Input
                        id="guest-phone"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                        placeholder="+241 XX XX XX XX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-email">Email</Label>
                      <Input
                        id="guest-email"
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-city">Ville *</Label>
                      <Select
                        value={guestInfo.city}
                        onValueChange={(value) => setGuestInfo({ ...guestInfo, city: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="libreville">Libreville</SelectItem>
                          <SelectItem value="port-gentil">Port-Gentil</SelectItem>
                          <SelectItem value="franceville">Franceville</SelectItem>
                          <SelectItem value="oyem">Oyem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="guest-address">Adresse de Livraison *</Label>
                      <Textarea
                        id="guest-address"
                        value={guestInfo.address}
                        onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                        placeholder="Adresse complète avec quartier"
                        rows={2}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="existing-client">Sélectionner le Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Rechercher un client existant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marie">Marie Nzamba - Particulier</SelectItem>
                        <SelectItem value="librairie">Librairie Centrale - Partenaire</SelectItem>
                        <SelectItem value="universite">Université des Sciences - Institution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sélection des Articles
              </CardTitle>
              <CardDescription>Choisissez les livres à commander</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {availableBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {book.isbn} • {book.discipline}
                        </div>
                        <div className="text-sm">
                          <Badge variant="outline">{book.stock} en stock</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{book.price.toLocaleString()} FCFA</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => addToCart(book)} disabled={book.stock === 0}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Cart Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Panier ({totalItems})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun article sélectionné</p>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.price.toLocaleString()} FCFA</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{totalAmount.toLocaleString()} FCFA</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment & Delivery */}
          {cartItems.length > 0 && orderType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paiement & Livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Mode de Paiement</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="especes">Espèces</SelectItem>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                      <SelectItem value="virement">Virement Bancaire</SelectItem>
                      {orderType === "partenaire" && <SelectItem value="credit">Crédit</SelectItem>}
                      {orderType === "institution" && <SelectItem value="bon">Bon de Commande</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-date">Date de Livraison</Label>
                  <Input id="delivery-date" type="date" />
                </div>

                {orderType === "partenaire" && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Cette commande nécessitera une validation PDG avant traitement.</AlertDescription>
                  </Alert>
                )}

                <Button className="w-full" size="lg">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer la Commande
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
