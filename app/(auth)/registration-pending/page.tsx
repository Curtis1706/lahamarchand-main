"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Clock, Mail, CheckCircle, Info } from "lucide-react"
import Link from "next/link"

export default function RegistrationPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Inscription en attente</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Votre demande de compte a été soumise avec succès
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Votre compte est en cours de validation par nos équipes. Vous recevrez un email de confirmation une fois
              votre compte activé.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Inscription soumise</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <span>Validation en cours (24-48h)</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg opacity-50">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span>Notification par email</span>
            </div>
          </div>

          <Alert variant="destructive">
            <AlertDescription>
              <strong>Important :</strong> Vérifiez régulièrement vos emails et votre dossier spam. Le processus de
              validation peut prendre jusqu'à 48 heures ouvrables.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Link href="/login">
              <Button variant="outline" className="w-full bg-transparent">
                Retour à la connexion
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
