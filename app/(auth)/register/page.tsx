"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Upload, FileText, AlertCircle, Info } from "lucide-react"
import { AuthNavigation } from "@/components/auth-navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

const roles = [
  { value: "client", label: "Client", description: "Commandes et suivi de livraisons", validation: "Automatique" },
  {
    value: "partenaire",
    label: "Partenaire",
    description: "Librairie ou point de vente",
    validation: "Validation représentant",
  },
  { value: "auteur", label: "Auteur", description: "Suivi des droits et ventes", validation: "Validation PDG" },
  {
    value: "concepteur",
    label: "Concepteur",
    description: "Création d'œuvres par discipline",
    validation: "Validation PDG + justificatifs",
  },
]

const disciplines = [
  "Sciences",
  "Littérature",
  "Philosophie",
  "Arts",
  "Histoire",
  "Géographie",
  "Mathématiques",
  "Physique",
  "Chimie",
  "Biologie",
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedDiscipline, setSelectedDiscipline] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [error, setError] = useState("")
  const router = useRouter()

  // Récupérer le rôle depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const roleFromUrl = urlParams.get('role')
    if (roleFromUrl && roles.some(role => role.value === roleFromUrl)) {
      setSelectedRole(roleFromUrl)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validation côté client
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      setIsLoading(false)
      return
    }

    if (!selectedRole) {
      setError("Veuillez sélectionner un rôle")
      setIsLoading(false)
      return
    }

    // Validation spécifique pour concepteur
    if (selectedRole === "concepteur" && !selectedDiscipline) {
      setError("Veuillez sélectionner votre discipline")
      setIsLoading(false)
      return
    }

    try {
      console.log("Tentative d'inscription pour:", email, "Rôle:", selectedRole, "Discipline:", selectedDiscipline)
      
      const requestBody: any = {
        name: `${firstName} ${lastName}`,
        email,
        password,
        role: selectedRole.toUpperCase(),
      }

      // Ajouter la discipline si c'est un concepteur
      if (selectedRole === "concepteur" && selectedDiscipline) {
        requestBody.discipline = selectedDiscipline
      }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log("Résultat de l'inscription:", result)

      if (!response.ok) {
        setError(result.error || "Erreur lors de la création du compte")
        setIsLoading(false)
        return
      }

      // Inscription réussie
      console.log("Inscription réussie:", result)
      if (selectedRole === "client") {
        router.push("/login?registered=true")
      } else {
        router.push("/registration-pending")
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      setError("Une erreur est survenue lors de la création du compte")
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const selectedRoleInfo = roles.find((role) => role.value === selectedRole)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AuthNavigation showBackButton={true} backHref="/select-account" />
      
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Créer un compte LAHA</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Rejoignez la plateforme de gestion du marché du livre au Gabon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input id="firstName" name="firstName" placeholder="Votre prénom" required autoComplete="given-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input id="lastName" name="lastName" placeholder="Votre nom" required autoComplete="family-name" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" placeholder="votre@email.com" required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input id="phone" type="tel" placeholder="+241 XX XX XX XX" required autoComplete="tel" />
              </div>
            </div>

            {/* Rôle demandé */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="role">Rôle demandé *</Label>
                <Link 
                  href="/select-account" 
                  className="text-sm text-primary hover:underline"
                >
                  Changer de rôle
                </Link>
              </div>
              
              {selectedRole ? (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{selectedRoleInfo?.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedRoleInfo?.validation}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoleInfo?.description}
                  </p>
                </div>
              ) : (
                <Select value={selectedRole} onValueChange={setSelectedRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{role.label}</span>
                            <Badge variant="outline" className="text-xs">
                              {role.validation}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {selectedRoleInfo && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Processus de validation :</strong> {selectedRoleInfo.validation}
                    {selectedRole !== "client" &&
                      " - Vous recevrez un email de confirmation une fois votre compte validé."}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Discipline pour concepteur */}
            {selectedRole === "concepteur" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discipline">Discipline *</Label>
                  <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplines.map((discipline) => (
                        <SelectItem key={discipline} value={discipline}>
                          {discipline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Vous serez rattaché uniquement à cette discipline. Ce choix ne pourra être modifié qu'avec
                    validation PDG.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="justification">Justificatifs et expérience *</Label>
                  <Textarea
                    id="justification"
                    placeholder="Décrivez votre expérience, vos qualifications et vos réalisations dans cette discipline..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Documents justificatifs *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Téléchargez vos justificatifs (CV, diplômes, portfolio, publications)
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Formats acceptés : PDF, DOC, DOCX, JPG, PNG • Max 10MB par fichier
                    </p>
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("fileUpload")?.click()}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Choisir des fichiers
                    </Button>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Fichiers sélectionnés :</Label>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Informations supplémentaires pour partenaire */}
            {selectedRole === "partenaire" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nom de l'établissement *</Label>
                  <Input id="businessName" placeholder="Nom de votre librairie/point de vente" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Adresse *</Label>
                  <Textarea
                    id="businessAddress"
                    placeholder="Adresse complète de votre établissement"
                    className="min-h-[80px]"
                    required
                  />
                </div>
              </div>
            )}

            {/* Mot de passe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe sécurisé"
                    required
                    autoComplete="new-password"
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
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères, incluant majuscules, minuscules et chiffres
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Conditions */}
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="terms" className="rounded border-border mt-1" required />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                J'accepte les{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  politique de confidentialité
                </Link>
                {selectedRole === "concepteur" && (
                  <span>
                    {" "}
                    ainsi que les{" "}
                    <Link href="/concepteur-terms" className="text-primary hover:underline">
                      conditions spécifiques aux concepteurs
                    </Link>
                  </span>
                )}
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Création du compte..." : "Créer mon compte"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
