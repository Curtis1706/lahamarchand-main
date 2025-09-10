"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthNavigation } from "@/components/auth-navigation"
import { signIn, getSession } from "next-auth/react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Récupérer la session pour obtenir le rôle
        const session = await getSession()
        if (session?.user?.role) {
          const role = session.user.role.toLowerCase()
          console.log("Redirection vers:", `/dashboard/${role}`)
          router.push(`/dashboard/${role}`)
        } else {
          console.log("Pas de rôle trouvé, redirection vers /dashboard")
          router.push("/dashboard")
        }
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setError("Une erreur est survenue")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AuthNavigation showBackButton={true} backHref="/select-account" />
      
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte LAHA MARCHAND
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            <p>Comptes de test :</p>
            <p>• PDG: pdg@lahamarchand.com / password123</p>
            <p>• Client: client@lahamarchand.com / password123</p>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/select-account" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}