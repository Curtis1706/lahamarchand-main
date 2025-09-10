"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  AlertTriangle, 
  Download, 
  Calendar, 
  User, 
  RefreshCw, 
  FileText, 
  BookOpen,
  Users,
  UserCheck,
  UserX,
  Shield,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean | null
  createdAt: string
  discipline?: {
    id: string
    name: string
  } | null
  _count: {
    projects: number
    works: number
  }
}

interface Discipline {
  id: string
  name: string
}

interface UserStats {
  total: number
  concepteurs: number
  concepteursEnAttente: number
  actifs: number
  suspendus: number
}

export default function GestionUtilisateursPage() {
  const [users, setUsers] = useState<User[]>([])
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [stats, setStats] = useState<UserStats>({ 
    total: 0, 
    concepteurs: 0, 
    concepteursEnAttente: 0, 
    actifs: 0, 
    suspendus: 0 
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"validate" | "suspend" | "activate" | "delete" | "change_role" | "create" | null>(null)
  const [selectedDiscipline, setSelectedDiscipline] = useState("")
  const [actionReason, setActionReason] = useState("")
  const [newRole, setNewRole] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const fetchData = async () => {
    try {
      setRefreshing(true)
      console.log("👑 Fetching users management data...")
      
      // Récupérer les utilisateurs
      const usersResponse = await fetch("/api/pdg/users", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      
      // Récupérer les disciplines
      const disciplinesResponse = await fetch("/api/disciplines", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      
      console.log("👑 Users response status:", usersResponse.status)
      console.log("👑 Disciplines response status:", disciplinesResponse.status)
      
      if (usersResponse.ok && disciplinesResponse.ok) {
        const usersData = await usersResponse.json()
        const disciplinesData = await disciplinesResponse.json()
        
        console.log("✅ Users data loaded:", usersData)
        console.log("✅ Disciplines data loaded:", disciplinesData)
        
        setUsers(usersData.users || [])
        setStats(usersData.stats || { total: 0, concepteurs: 0, concepteursEnAttente: 0, actifs: 0, suspendus: 0 })
        setDisciplines(disciplinesData.disciplines || [])
        setError(null)
      } else {
        const errorData = await usersResponse.json()
        console.log("⚠️ Users API error:", errorData)
        setError(`Erreur API: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error("❌ Users management fetch error:", err)
      setError(`Erreur de connexion: ${err.message}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      PDG: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "PDG" },
      CONCEPTEUR: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Concepteur" },
      AUTEUR: { color: "bg-green-100 text-green-800 border-green-200", label: "Auteur" },
      CLIENT: { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Client" },
      PARTENAIRE: { color: "bg-orange-100 text-orange-800 border-orange-200", label: "Partenaire" },
      REPRESENTANT: { color: "bg-indigo-100 text-indigo-800 border-indigo-200", label: "Représentant" }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig] || { color: "bg-gray-100 text-gray-800 border-gray-200", label: role }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getStatusBadge = (user: User) => {
    if (user.emailVerified) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Suspendu</Badge>
    }
  }

  const openActionDialog = (user: User | null, action: "validate" | "suspend" | "activate" | "delete" | "change_role" | "create") => {
    setSelectedUser(user)
    setActionType(action)
    setIsActionDialogOpen(true)
    setSelectedDiscipline("")
    setActionReason("")
    setNewRole("")
  }

  const handleAction = async () => {
    if (!selectedUser && actionType !== "create") return

    try {
      setIsSubmitting(true)
      console.log(`👑 ${actionType}ing user:`, selectedUser?.id)

      const requestBody: any = {
        action: actionType === "validate" ? "validate_concepteur" : 
                actionType === "suspend" ? "suspend_user" :
                actionType === "activate" ? "activate_user" :
                actionType === "delete" ? "delete_user" :
                actionType === "change_role" ? "change_role" :
                actionType === "create" ? "create_user" : "",
        userId: selectedUser?.id
      }

      if (actionType === "validate") {
        requestBody.data = {
          disciplineId: selectedDiscipline,
          reason: actionReason
        }
      } else if (actionType === "suspend" || actionType === "delete") {
        requestBody.data = { reason: actionReason }
      } else if (actionType === "change_role") {
        requestBody.data = {
          newRole: newRole,
          reason: actionReason
        }
      } else if (actionType === "create") {
        requestBody.data = {
          name: actionReason, // Utilisé temporairement pour le nom
          email: selectedDiscipline, // Utilisé temporairement pour l'email
          role: newRole,
          disciplineId: selectedDiscipline
        }
      }

      const response = await fetch("/api/pdg/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ User action result:", result)
        
        // Rafraîchir la liste des utilisateurs
        await fetchData()
        
        // Fermer le dialog
        setIsActionDialogOpen(false)
        setSelectedUser(null)
        setActionType(null)
        setActionReason("")
        setSelectedDiscipline("")
        setNewRole("")
      } else {
        const errorData = await response.json()
        console.error("❌ User action error:", errorData)
        setError(`Erreur d'action: ${errorData.error}`)
      }
    } catch (err: any) {
      console.error("❌ User action error:", err)
      setError(`Erreur d'action: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gestion complète des comptes utilisateurs - Validation, suspension, modification des rôles
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => openActionDialog(null, "create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer Utilisateur
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Actualisation...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Erreur</h3>
                <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tous les comptes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concepteurs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.concepteurs}</div>
            <p className="text-xs text-muted-foreground">Créateurs de contenu</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.concepteursEnAttente}</div>
            <p className="text-xs text-muted-foreground">Validation PDG requise</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.actifs}</div>
            <p className="text-xs text-muted-foreground">Comptes validés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspendus</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspendus}</div>
            <p className="text-xs text-muted-foreground">Comptes désactivés</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="PDG">PDG</SelectItem>
                  <SelectItem value="CONCEPTEUR">Concepteur</SelectItem>
                  <SelectItem value="AUTEUR">Auteur</SelectItem>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="PARTENAIRE">Partenaire</SelectItem>
                  <SelectItem value="REPRESENTANT">Représentant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tous ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            En Attente ({stats.concepteursEnAttente})
          </TabsTrigger>
          <TabsTrigger value="concepteurs" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Concepteurs ({stats.concepteurs})
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Journal d'Audit
          </TabsTrigger>
        </TabsList>

        {/* Onglet Tous les Utilisateurs */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Tous les Utilisateurs ({filteredUsers.length})
              </CardTitle>
              <CardDescription>
                Gestion complète des comptes utilisateurs de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {searchTerm || roleFilter !== "all" ? "Essayez de modifier vos critères de recherche" : "Créez votre premier utilisateur"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Discipline</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Projets/Œuvres</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          {user.discipline ? (
                            <Badge variant="outline">{user.discipline.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(user)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user._count.projects} projets</div>
                            <div>{user._count.works} œuvres</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.role === "CONCEPTEUR" && !user.emailVerified && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openActionDialog(user, "validate")}
                                className="text-green-600 hover:text-green-700"
                                title="Valider le concepteur"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {user.emailVerified ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openActionDialog(user, "suspend")}
                                className="text-orange-600 hover:text-orange-700"
                                title="Suspendre l'utilisateur"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openActionDialog(user, "activate")}
                                className="text-green-600 hover:text-green-700"
                                title="Activer l'utilisateur"
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openActionDialog(user, "change_role")}
                              className="text-blue-600 hover:text-blue-700"
                              title="Modifier le rôle"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openActionDialog(user, "delete")}
                              className="text-red-600 hover:text-red-700"
                              title="Supprimer l'utilisateur"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet En Attente */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Concepteurs en Attente de Validation ({stats.concepteursEnAttente})
              </CardTitle>
              <CardDescription>
                Concepteurs nécessitant une validation et attribution de discipline
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.filter(u => u.role === "CONCEPTEUR" && !u.emailVerified).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <p className="text-muted-foreground">Aucun concepteur en attente</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tous les concepteurs ont été validés
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepteur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(u => u.role === "CONCEPTEUR" && !u.emailVerified)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openActionDialog(user, "validate")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Valider
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openActionDialog(user, "delete")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Refuser
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Concepteurs */}
        <TabsContent value="concepteurs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Concepteurs Validés ({stats.concepteurs})
              </CardTitle>
              <CardDescription>
                Liste des concepteurs avec leurs disciplines attribuées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.filter(u => u.role === "CONCEPTEUR").length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun concepteur trouvé</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepteur</TableHead>
                      <TableHead>Discipline</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Projets/Œuvres</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(u => u.role === "CONCEPTEUR")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.discipline ? (
                              <Badge variant="outline">{user.discipline.name}</Badge>
                            ) : (
                              <span className="text-muted-foreground">Non attribuée</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(user)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{user._count.projects} projets</div>
                              <div>{user._count.works} œuvres</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {user.emailVerified ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openActionDialog(user, "suspend")}
                                  className="text-orange-600 hover:text-orange-700"
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openActionDialog(user, "activate")}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Journal d'Audit */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Journal d'Audit
              </CardTitle>
              <CardDescription>
                Historique des actions effectuées par le PDG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Journal d'audit</p>
                <p className="text-sm text-muted-foreground mt-2">
                  L'historique des actions PDG apparaîtra ici.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog d'action */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "validate" && "Valider le Concepteur"}
              {actionType === "suspend" && "Suspendre l'Utilisateur"}
              {actionType === "activate" && "Activer l'Utilisateur"}
              {actionType === "delete" && "Supprimer l'Utilisateur"}
              {actionType === "change_role" && "Modifier le Rôle"}
              {actionType === "create" && "Créer un Utilisateur"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "validate" && "Validez ce concepteur et attribuez-lui une discipline."}
              {actionType === "suspend" && "Suspendre cet utilisateur en précisant la raison."}
              {actionType === "activate" && "Réactiver cet utilisateur."}
              {actionType === "delete" && "Supprimer définitivement cet utilisateur."}
              {actionType === "change_role" && "Modifier le rôle de cet utilisateur."}
              {actionType === "create" && "Créer un nouvel utilisateur avec un rôle spécifique."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedUser && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">{selectedUser.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email} • {getRoleBadge(selectedUser.role)}
                </p>
              </div>
            )}

            {actionType === "validate" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discipline">Discipline</Label>
                  <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplines.map((discipline) => (
                        <SelectItem key={discipline.id} value={discipline.id}>
                          {discipline.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Raison (optionnel)</Label>
                  <Textarea
                    id="reason"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Raison de la validation..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {actionType === "change_role" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newRole">Nouveau Rôle</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONCEPTEUR">Concepteur</SelectItem>
                      <SelectItem value="AUTEUR">Auteur</SelectItem>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="PARTENAIRE">Partenaire</SelectItem>
                      <SelectItem value="REPRESENTANT">Représentant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Raison</Label>
                  <Textarea
                    id="reason"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Raison du changement de rôle..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {actionType === "create" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Nom de l'utilisateur"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={selectedDiscipline}
                    onChange={(e) => setSelectedDiscipline(e.target.value)}
                    placeholder="email@example.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONCEPTEUR">Concepteur</SelectItem>
                      <SelectItem value="AUTEUR">Auteur</SelectItem>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="PARTENAIRE">Partenaire</SelectItem>
                      <SelectItem value="REPRESENTANT">Représentant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {(actionType === "suspend" || actionType === "delete") && (
              <div className="space-y-2">
                <Label htmlFor="reason">Raison</Label>
                <Textarea
                  id="reason"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={`Raison de la ${actionType === "suspend" ? "suspension" : "suppression"}...`}
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActionDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={isSubmitting || 
                (actionType === "validate" && !selectedDiscipline) ||
                ((actionType === "suspend" || actionType === "delete" || actionType === "change_role") && !actionReason.trim()) ||
                (actionType === "create" && (!actionReason.trim() || !selectedDiscipline.trim() || !newRole))
              }
              className={
                actionType === "validate" || actionType === "activate" || actionType === "create" ? "bg-green-600 hover:bg-green-700" :
                actionType === "suspend" ? "bg-orange-600 hover:bg-orange-700" :
                actionType === "delete" ? "bg-red-600 hover:bg-red-700" :
                actionType === "change_role" ? "bg-blue-600 hover:bg-blue-700" : ""
              }
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  {actionType === "validate" && (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Valider le Concepteur
                    </>
                  )}
                  {actionType === "suspend" && (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Suspendre
                    </>
                  )}
                  {actionType === "activate" && (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activer
                    </>
                  )}
                  {actionType === "delete" && (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </>
                  )}
                  {actionType === "change_role" && (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier le Rôle
                    </>
                  )}
                  {actionType === "create" && (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer l'Utilisateur
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}