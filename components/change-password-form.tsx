"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ChangePasswordFormProps {
  userEmail: string
  onSuccess?: () => void
}

export function ChangePasswordForm({ userEmail, onSuccess }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères")
      setIsLoading(false)
      return
    }

    try {
      // Appel API pour changer le mot de passe
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        credentials: 'include'
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Erreur lors du changement de mot de passe")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/dashboard")
        }
      }, 2000)

    } catch (error) {
      console.error("Erreur:", error)
      setError("Une erreur est survenue")
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-green-600">Mot de passe changé !</CardTitle>
          <CardDescription>
            Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé...
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Changer votre mot de passe</CardTitle>
          <CardDescription>
            Pour des raisons de sécurité, veuillez changer votre mot de passe temporaire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mot de passe temporaire"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe sécurisé"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez le nouveau mot de passe"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Changement en cours..." : "Changer le mot de passe"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Mot de passe temporaire : <strong>password123</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



