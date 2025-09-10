"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, Bell, Upload, Eye, EyeOff, Key } from "lucide-react"

export default function ProfilPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Upload className="h-4 w-4" />
                    Changer la photo
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Taille max: 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" defaultValue="Dupont" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" defaultValue="+241 XX XX XX XX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <div className="flex items-center h-10 px-3 py-2 border border-input bg-muted rounded-md">
                    <Badge variant="outline" className="capitalize">
                      PDG
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  placeholder="Parlez-nous de vous..."
                  rows={4}
                  defaultValue="Directeur général de LAHA Marchand, passionné par la promotion de la littérature gabonaise."
                />
              </div>

              <Button>Sauvegarder les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
              <CardDescription>Gérez la sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Changer le mot de passe</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe actuel"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" placeholder="Nouveau mot de passe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirmer le mot de passe" />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Authentification à deux facteurs (2FA)</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">2FA activée</Label>
                    <p className="text-sm text-muted-foreground">
                      Protection supplémentaire requise pour votre rôle PDG
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} disabled />
                    <Badge variant="secondary">Obligatoire</Badge>
                  </div>
                </div>
                <Button variant="outline">Reconfigurer 2FA</Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Sessions actives</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Session actuelle</Label>
                      <p className="text-sm text-muted-foreground">Chrome sur Windows • Libreville, Gabon</p>
                      <p className="text-xs text-muted-foreground">Dernière activité: maintenant</p>
                    </div>
                    <Badge variant="success">Actuelle</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Mobile</Label>
                      <p className="text-sm text-muted-foreground">Safari sur iPhone • Libreville, Gabon</p>
                      <p className="text-xs text-muted-foreground">Dernière activité: il y a 2 heures</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Révoquer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notification
              </CardTitle>
              <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notifications par email</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Alertes importantes</Label>
                      <p className="text-xs text-muted-foreground">Stock faible, erreurs système</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Nouvelles commandes</Label>
                      <p className="text-xs text-muted-foreground">Notifications de nouvelles commandes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Rapports hebdomadaires</Label>
                      <p className="text-xs text-muted-foreground">Résumé des activités de la semaine</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Validations en attente</Label>
                      <p className="text-xs text-muted-foreground">Comptes utilisateurs à valider</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notifications push</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Notifications dans le navigateur</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Sons de notification</Label>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Fréquence</h4>
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">Regrouper les notifications</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiatement</SelectItem>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidiennement</SelectItem>
                      <SelectItem value="weekly">Hebdomadairement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button>Sauvegarder les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'affichage</CardTitle>
              <CardDescription>Personnalisez l'interface selon vos préférences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Langue et région</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select defaultValue="africa-libreville">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa-libreville">Africa/Libreville</SelectItem>
                        <SelectItem value="europe-paris">Europe/Paris</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Affichage</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Mode sombre</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Affichage compact</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Animations réduites</Label>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Dashboard</h4>
                <div className="space-y-2">
                  <Label htmlFor="default-view">Vue par défaut</Label>
                  <Select defaultValue="overview">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Vue d'ensemble</SelectItem>
                      <SelectItem value="stock">Gestion du stock</SelectItem>
                      <SelectItem value="sales">Ventes</SelectItem>
                      <SelectItem value="reports">Rapports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button>Sauvegarder les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
