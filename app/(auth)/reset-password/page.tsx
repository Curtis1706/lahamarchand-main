"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate password reset request
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Email envoyé</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Un lien de réinitialisation a été envoyé à votre adresse email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Vérifiez votre boîte de réception et vos spams. Le lien expire dans 15 minutes.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsSuccess(false)}>
                Renvoyer l'email
              </Button>
              <Link href="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Mot de passe oublié</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Saisissez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
