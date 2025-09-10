"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Send,
  Search,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight,
  BookOpen
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Project {
  id: string
  title: string
  description: string | null
  status: string
  discipline: {
    id: string
    name: string
  }
  reviewer: {
    id: string
    name: string
    email: string
  } | null
  work: {
    id: string
    title: string
    isbn: string
    status: string
  } | null
  createdAt: string
  updatedAt: string
  submittedAt: string | null
  reviewedAt: string | null
}

interface ProjectsResponse {
  projects: Project[]
  stats: {
    total: number
    draft: number
    submitted: number
    underReview: number
    accepted: number
    rejected: number
  }
  user: {
    name: string
    email: string
    role: string
  }
}

interface Discipline {
  id: string
  name: string
}

export default function ConcepteurProjectsPage() {
  const [projectsData, setProjectsData] = useState<ProjectsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [disciplinesLoading, setDisciplinesLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    disciplineId: ""
  })

  const fetchProjectsData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/concepteur/projects", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch projects data")
      }
      
      const data = await response.json()
      setProjectsData(data)
      setError(null)
    } catch (err) {
      console.error("❌ Projects fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchDisciplines = async () => {
    try {
      setDisciplinesLoading(true)
      const response = await fetch("/api/disciplines")
      if (response.ok) {
        const data = await response.json()
        setDisciplines(data || [])
        console.log("✅ Disciplines loaded:", data.length)
      }
    } catch (err) {
      console.error("❌ Disciplines fetch error:", err)
    } finally {
      setDisciplinesLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectsData()
    fetchDisciplines()
  }, [])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800">Brouillon</Badge>
      case "SUBMITTED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">Soumis</Badge>
      case "UNDER_REVIEW":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">En révision</Badge>
      case "ACCEPTED":
        return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">Accepté</Badge>
      case "REJECTED":
        return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">Refusé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <FileText className="h-4 w-4 text-gray-600" />
      case "SUBMITTED":
        return <Send className="h-4 w-4 text-blue-600" />
      case "UNDER_REVIEW":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleCreateProject = async () => {
    try {
      const response = await fetch("/api/concepteur/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create project")
      }
      
      const data = await response.json()
      console.log("✅ Project created:", data.message)
      
      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        disciplineId: ""
      })
      setIsCreateDialogOpen(false)
      
      // Refresh data
      await fetchProjectsData()
      
    } catch (err) {
      console.error("❌ Create project error:", err)
      setError(err instanceof Error ? err.message : "Failed to create project")
    }
  }

  const handleUpdateProject = async () => {
    if (!selectedProject) return

    try {
      const response = await fetch("/api/concepteur/projects", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          ...formData
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update project")
      }
      
      const data = await response.json()
      console.log("✅ Project updated:", data.message)
      
      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        disciplineId: ""
      })
      setSelectedProject(null)
      setIsEditDialogOpen(false)
      
      // Refresh data
      await fetchProjectsData()
      
    } catch (err) {
      console.error("❌ Update project error:", err)
      setError(err instanceof Error ? err.message : "Failed to update project")
    }
  }

  const handleSubmitProject = async (projectId: string) => {
    try {
      const response = await fetch("/api/concepteur/projects", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          status: "SUBMITTED"
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to submit project")
      }
      
      console.log("✅ Project submitted")
      await fetchProjectsData()
      
    } catch (err) {
      console.error("❌ Submit project error:", err)
      setError(err instanceof Error ? err.message : "Failed to submit project")
    }
  }

  const openEditDialog = (project: Project) => {
    setSelectedProject(project)
    setFormData({
      title: project.title,
      description: project.description || "",
      disciplineId: project.discipline.id
    })
    setIsEditDialogOpen(true)
  }

  // Filtrer les projets
  const filteredProjects = projectsData?.projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

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

  if (error || !projectsData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: {error || 'Données non disponibles'}</p>
        <Button onClick={fetchProjectsData} className="mt-4" disabled={refreshing}>
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
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Mes Projets</h1>
          <p className="text-muted-foreground">Créez et gérez vos projets en cours de conception</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/concepteur'}>
            <Eye className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/concepteur/oeuvres'}>
            <BookOpen className="mr-2 h-4 w-4" />
            Mes Œuvres
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau projet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau projet</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de base pour créer un nouveau projet.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre du projet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description du projet..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discipline">Discipline *</Label>
                  <Select value={formData.disciplineId} onValueChange={(value) => setFormData({ ...formData, disciplineId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={disciplinesLoading ? "Chargement..." : "Sélectionner une discipline"} />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinesLoading ? (
                        <SelectItem value="loading" disabled>Chargement...</SelectItem>
                      ) : (
                        disciplines.map((discipline) => (
                          <SelectItem key={discipline.id} value={discipline.id}>
                            {discipline.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateProject}>
                    Créer le projet
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsData.stats.total}</div>
            <p className="text-xs text-muted-foreground">projets créés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{projectsData.stats.draft}</div>
            <p className="text-xs text-muted-foreground">en cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soumis</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{projectsData.stats.submitted}</div>
            <p className="text-xs text-muted-foreground">en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{projectsData.stats.accepted}</div>
            <p className="text-xs text-muted-foreground">validés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refusés</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{projectsData.stats.rejected}</div>
            <p className="text-xs text-muted-foreground">non validés</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="SUBMITTED">Soumis</SelectItem>
              <SelectItem value="UNDER_REVIEW">En révision</SelectItem>
              <SelectItem value="ACCEPTED">Accepté</SelectItem>
              <SelectItem value="REJECTED">Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={fetchProjectsData} disabled={refreshing}>
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

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun projet trouvé</p>
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer votre premier projet
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(project.status)}
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    
                    {project.description && (
                      <p className="text-muted-foreground text-sm">{project.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Discipline:</span>
                        <p className="font-medium">{project.discipline.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Créé:</span>
                        <p className="font-medium">{formatDate(project.createdAt)}</p>
                      </div>
                      {project.submittedAt && (
                        <div>
                          <span className="text-muted-foreground">Soumis:</span>
                          <p className="font-medium">{formatDate(project.submittedAt)}</p>
                        </div>
                      )}
                    </div>

                    {project.reviewer && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Validateur:</span>
                        <p className="font-medium">{project.reviewer.name}</p>
                      </div>
                    )}

                    {project.work && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Devenu œuvre: {project.work.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-3 w-3" />
                      Voir
                    </Button>
                    {project.status === "DRAFT" && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(project)}>
                          <Edit className="mr-2 h-3 w-3" />
                          Modifier
                        </Button>
                        <Button size="sm" onClick={() => handleSubmitProject(project.id)}>
                          <Send className="mr-2 h-3 w-3" />
                          Soumettre
                        </Button>
                      </>
                    )}
                    {project.status === "ACCEPTED" && project.work && (
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/dashboard/concepteur/oeuvres'}>
                        <ArrowRight className="mr-2 h-3 w-3" />
                        Voir l'œuvre
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
            <DialogDescription>
              Modifiez les informations du projet sélectionné.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titre *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre du projet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du projet..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discipline">Discipline *</Label>
              <Select value={formData.disciplineId} onValueChange={(value) => setFormData({ ...formData, disciplineId: value })}>
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateProject}>
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}