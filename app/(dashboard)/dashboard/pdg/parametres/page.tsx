"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Bell, Users, Database, Globe } from "lucide-react"

export default function ParametresPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Configurez les paramètres de votre plateforme LAHA</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="integration">Intégrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informations générales
              </CardTitle>
              <CardDescription>Configurez les informations de base de votre plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Nom de la plateforme</Label>
                  <Input id="platform-name" defaultValue="LAHA Marchand - Gabon" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-version">Version</Label>
                  <Input id="platform-version" defaultValue="1.0.0" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-description">Description</Label>
                <Textarea
                  id="platform-description"
                  defaultValue="Plateforme de gestion du livre et des œuvres intellectuelles au Gabon"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email de contact</Label>
                  <Input id="contact-email" type="email" defaultValue="contact@laha-gabon.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Téléphone support</Label>
                  <Input id="support-phone" defaultValue="+241 XX XX XX XX" />
                </div>
              </div>
              <Button>Sauvegarder les modifications</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres métier</CardTitle>
              <CardDescription>Configurez les règles de gestion spécifiques au marché gabonais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taux-droits">Taux droits d'auteur (%)</Label>
                  <Input id="taux-droits" type="number" defaultValue="10" min="0" max="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seuil-stock">Seuil alerte stock</Label>
                  <Input id="seuil-stock" type="number" defaultValue="10" min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delai-validation">Délai validation (jours)</Label>
                  <Input id="delai-validation" type="number" defaultValue="7" min="1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="devise">Devise par défaut</Label>
                <Select defaultValue="xaf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xaf">Franc CFA (XAF)</SelectItem>
                    <SelectItem value="eur">Euro (EUR)</SelectItem>
                    <SelectItem value="usd">Dollar US (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
              <CardDescription>Configurez les paramètres de sécurité et d'authentification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Authentification à deux facteurs (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Obligatoire pour les rôles PDG et Représentant</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} disabled />
                  <Badge variant="secondary">Obligatoire</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Politique des mots de passe</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Longueur minimale</Label>
                    <Input id="min-length" type="number" defaultValue="8" min="6" max="20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry-days">Expiration (jours)</Label>
                    <Input id="expiry-days" type="number" defaultValue="90" min="30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Exigences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label className="text-sm">Majuscules requises</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label className="text-sm">Chiffres requis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label className="text-sm">Caractères spéciaux requis</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Sessions et connexions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Timeout session (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="30" min="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Tentatives max</Label>
                    <Input id="max-attempts" type="number" defaultValue="5" min="3" />
                  </div>
                </div>
              </div>

              <Button>Sauvegarder les paramètres de sécurité</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Paramètres de notification
              </CardTitle>
              <CardDescription>Configurez les notifications système et utilisateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notifications par email</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Stock faible</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Nouveaux dépôts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Validation en attente</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Paiements droits d'auteur</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Fréquence des rapports</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rapport-quotidien">Rapport quotidien</Label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Activé</SelectItem>
                        <SelectItem value="disabled">Désactivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rapport-hebdo">Rapport hebdomadaire</Label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Activé</SelectItem>
                        <SelectItem value="disabled">Désactivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button>Sauvegarder les paramètres</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>Configurez les paramètres par défaut pour les nouveaux utilisateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Validation automatique</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Auteurs</Label>
                      <p className="text-xs text-muted-foreground">Validation automatique des comptes auteurs</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Partenaires</Label>
                      <p className="text-xs text-muted-foreground">Validation automatique des comptes partenaires</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Clients</Label>
                      <p className="text-xs text-muted-foreground">Validation automatique des comptes clients</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Permissions par défaut</h4>
                <div className="space-y-2">
                  <Label htmlFor="default-role">Rôle par défaut</Label>
                  <Select defaultValue="client">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="auteur">Auteur</SelectItem>
                      <SelectItem value="partenaire">Partenaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button>Sauvegarder les paramètres</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Paramètres système
              </CardTitle>
              <CardDescription>Configurez les paramètres techniques de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Sauvegarde automatique</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Sauvegarde quotidienne</Label>
                    <p className="text-sm text-muted-foreground">
                      Sauvegarde automatique de la base de données chaque jour à 2h00
                    </p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">Rétention (jours)</Label>
                    <Input id="backup-retention" type="number" defaultValue="30" min="7" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-time">Heure de sauvegarde</Label>
                    <Input id="backup-time" type="time" defaultValue="02:00" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cache-duration">Durée cache (minutes)</Label>
                    <Input id="cache-duration" type="number" defaultValue="15" min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-upload">Taille max upload (MB)</Label>
                    <Input id="max-upload" type="number" defaultValue="10" min="1" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Logs et monitoring</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Logs détaillés</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Monitoring performance</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Alertes système</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button>Sauvegarder les paramètres système</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations externes</CardTitle>
              <CardDescription>Configurez les intégrations avec les services externes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Services de paiement</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Mobile Money Gabon</Label>
                      <p className="text-sm text-muted-foreground">Airtel Money, Moov Money</p>
                    </div>
                    <Badge variant="success">Connecté</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Cartes bancaires</Label>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                    </div>
                    <Badge variant="secondary">Non configuré</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Services de messagerie</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Email SMTP</Label>
                      <p className="text-sm text-muted-foreground">Service d'envoi d'emails</p>
                    </div>
                    <Badge variant="success">Connecté</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">SMS Gateway</Label>
                      <p className="text-sm text-muted-foreground">Notifications SMS</p>
                    </div>
                    <Badge variant="secondary">Non configuré</Badge>
                  </div>
                </div>
              </div>

              <Button>Configurer les intégrations</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
