"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  RefreshCw,
  FileText,
  User,
  Calendar,
  BookOpen,
} from "lucide-react"

interface Project {
  id: string
  title: string
  description: string | null
  status: string
  createdAt: string
  submittedAt: string | null
  reviewedAt: string | null
  discipline: {
    id: string
    name: string
  }
  concepteur: {
    id: string
    name: string
    email: string
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
}

interface ProjectStats {
  total: number
  submitted: number
  underReview: number
  pendingReview: number
}

export default function PDGProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<ProjectStats>({ total: 0, submitted: 0, underReview: 0, pendingReview: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false)
  const [validationAction, setValidationAction] = useState<"accept" | "reject" | null>(null)
  const [workData, setWorkData] = useState({
    isbn: "",
    price: 0,
    tva: 0.18,
    stock: 0
  })
  const [rejectionReason, setRejectionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProjects = async () => {
    try {
      setRefreshing(true)
      console.log("👑 Fetching PDG projects...")
      
      const response = await fetch("/api/pdg/projects", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      
      console.log("👑 PDG projects response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("✅ PDG projects data loaded:", data)
        setProjects(data.projects || [])
        setStats(data.stats || { total: 0, submitted: 0, underReview: 0, pendingReview: 0 })
        setError(null)
      } else {
        const errorData = await response.json()
        console.log("⚠️ PDG projects API error:", errorData)
        setError(`Erreur API: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error("❌ PDG projects fetch error:", err)
      setError(`Erreur de connexion: ${err.message}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Soumis</Badge>
      case "UNDER_REVIEW":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En révision</Badge>
      case "ACCEPTED":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Accepté</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejeté</Badge>
      case "DRAFT":
        return <Badge variant="secondary">Brouillon</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const openValidationDialog = (project: Project, action: "accept" | "reject") => {
    setSelectedProject(project)
    setValidationAction(action)
    setIsValidationDialogOpen(true)
    
    if (action === "accept") {
      // Générer un ISBN automatique
      const isbn = `978-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9) + 1}`
      setWorkData({
        isbn,
        price: 0,
        tva: 0.18,
        stock: 0
      })
    }
  }

  const handleValidation = async () => {
    if (!selectedProject || !validationAction) return

    try {
      setIsSubmitting(true)
      console.log(`👑 ${validationAction}ing project:`, selectedProject.id)

      const response = await fetch("/api/pdg/projects", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          action: validationAction,
          workData: validationAction === "accept" ? workData : undefined,
          rejectionReason: validationAction === "reject" ? rejectionReason : undefined
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Project validation result:", result)
        
        // Rafraîchir la liste des projets
        await fetchProjects()
        
        // Fermer le dialog
        setIsValidationDialogOpen(false)
        setSelectedProject(null)
        setValidationAction(null)
        setRejectionReason("")
      } else {
        const errorData = await response.json()
        console.error("❌ Validation error:", errorData)
        setError(`Erreur de validation: ${errorData.error}`)
      }
    } catch (err) {
      console.error("❌ Validation error:", err)
      setError(`Erreur de validation: ${err.message}`)
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Validation des Projets</h1>
            <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Droit exclusif PDG
            </Badge>
          </div>
          <p className="text-muted-foreground">Validez ou refusez les projets soumis par les concepteurs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchProjects} disabled={refreshing}>
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Projets en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soumis</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">En attente de révision</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Révision</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underReview}</div>
            <p className="text-xs text-muted-foreground">En cours d'évaluation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Réviser</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReview}</div>
            <p className="text-xs text-muted-foreground">Sans réviseur assigné</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des projets */}
      <Card>
        <CardHeader>
          <CardTitle>Projets en Attente de Validation</CardTitle>
          <CardDescription>
            {projects.length === 0 
              ? "Aucun projet en attente de validation" 
              : `${projects.length} projet${projects.length > 1 ? 's' : ''} en attente de validation`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun projet en attente de validation</p>
              <p className="text-sm text-muted-foreground mt-2">
                Les projets soumis par les concepteurs apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          {getStatusBadge(project.status)}
                        </div>
                        
                        {project.description && (
                          <p className="text-muted-foreground text-sm">{project.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{project.concepteur.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{project.discipline.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Soumis le {new Date(project.submittedAt || project.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openValidationDialog(project, "accept")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accepter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openValidationDialog(project, "reject")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Refuser
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de validation */}
      <Dialog open={isValidationDialogOpen} onOpenChange={setIsValidationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {validationAction === "accept" ? "Accepter le Projet" : "Refuser le Projet"}
            </DialogTitle>
            <DialogDescription>
              {validationAction === "accept" 
                ? "Transformez ce projet en œuvre officielle en définissant les informations commerciales."
                : "Refusez ce projet en précisant la raison du refus."
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">{selectedProject.title}</h4>
                <p className="text-sm text-muted-foreground">
                  par {selectedProject.concepteur.name} • {selectedProject.discipline.name}
                </p>
              </div>

              {validationAction === "accept" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={workData.isbn}
                      onChange={(e) => setWorkData({ ...workData, isbn: e.target.value })}
                      placeholder="978-xxx-xxxx-x"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (FCFA)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={workData.price}
                      onChange={(e) => setWorkData({ ...workData, price: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tva">TVA</Label>
                    <Input
                      id="tva"
                      type="number"
                      step="0.01"
                      value={workData.tva}
                      onChange={(e) => setWorkData({ ...workData, tva: Number(e.target.value) })}
                      placeholder="0.18"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Initial</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={workData.stock}
                      onChange={(e) => setWorkData({ ...workData, stock: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="reason">Raison du refus</Label>
                  <Textarea
                    id="reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Expliquez pourquoi ce projet est refusé..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsValidationDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleValidation}
              disabled={isSubmitting || (validationAction === "accept" && (!workData.isbn || workData.price <= 0)) || (validationAction === "reject" && !rejectionReason.trim())}
              className={validationAction === "accept" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {validationAction === "accept" ? "Acceptation..." : "Refus..."}
                </>
              ) : (
                <>
                  {validationAction === "accept" ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accepter et Créer l'Œuvre
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Refuser le Projet
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

