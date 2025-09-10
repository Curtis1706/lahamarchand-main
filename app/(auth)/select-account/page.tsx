"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Store, 
  PenTool, 
  Palette, 
  Building2, 
  ShoppingCart,
  CheckCircle,
  Clock,
  Shield,
  Users,
  BookOpen,
  TrendingUp
} from "lucide-react"
import { AuthNavigation } from "@/components/auth-navigation"
import Link from "next/link"

const accountTypes = [
  {
    id: "client",
    title: "Client",
    description: "Commandes et suivi de livraisons",
    icon: ShoppingCart,
    color: "bg-blue-500",
    features: [
      "Commandes en ligne",
      "Suivi des livraisons",
      "Historique des achats",
      "Notifications de stock"
    ],
    validation: "Automatique",
    validationIcon: CheckCircle,
    validationColor: "text-green-600",
    popular: true
  },
  {
    id: "partenaire",
    title: "Partenaire",
    description: "Librairie ou point de vente",
    icon: Store,
    color: "bg-green-500",
    features: [
      "Gestion du stock",
      "Commandes en gros",
      "Rapports de ventes",
      "Support commercial"
    ],
    validation: "Validation représentant",
    validationIcon: Clock,
    validationColor: "text-yellow-600"
  },
  {
    id: "auteur",
    title: "Auteur",
    description: "Suivi des droits et ventes",
    icon: PenTool,
    color: "bg-purple-500",
    features: [
      "Suivi des droits d'auteur",
      "Statistiques de ventes",
      "Gestion des œuvres",
      "Paiements automatiques"
    ],
    validation: "Validation PDG",
    validationIcon: Shield,
    validationColor: "text-blue-600"
  },
  {
    id: "concepteur",
    title: "Concepteur",
    description: "Création d'œuvres par discipline",
    icon: Palette,
    color: "bg-pink-500",
    features: [
      "Création d'œuvres",
      "Gestion par discipline",
      "Validation des projets",
      "Collaboration avec auteurs"
    ],
    validation: "Validation PDG + justificatifs",
    validationIcon: Shield,
    validationColor: "text-blue-600"
  },
  {
    id: "representant",
    title: "Représentant",
    description: "Gestion commerciale et partenaires",
    icon: Users,
    color: "bg-orange-500",
    features: [
      "Gestion des partenaires",
      "Validation des comptes",
      "Rapports commerciaux",
      "Support client"
    ],
    validation: "Accès restreint",
    validationIcon: Shield,
    validationColor: "text-red-600"
  },
  {
    id: "pdg",
    title: "PDG",
    description: "Administration complète",
    icon: Building2,
    color: "bg-gray-800",
    features: [
      "Administration complète",
      "Gestion des utilisateurs",
      "Validation des comptes",
      "Rapports globaux"
    ],
    validation: "Accès restreint",
    validationIcon: Shield,
    validationColor: "text-red-600"
  }
]

export default function AccountSelectionPage() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const router = useRouter()

  const handleAccountSelection = (accountId: string) => {
    setSelectedAccount(accountId)
    
    // Rediriger vers la page d'inscription avec le rôle sélectionné
    setTimeout(() => {
      router.push(`/register?role=${accountId}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AuthNavigation showBackButton={false} showHomeButton={false} />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choisissez votre type de compte
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rejoignez la plateforme LAHA MARCHAND en tant que membre de notre écosystème du livre au Gabon
          </p>
        </div>

        {/* Account Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {accountTypes.map((account) => {
            const IconComponent = account.icon
            const ValidationIcon = account.validationIcon
            
            return (
              <Card 
                key={account.id}
                className={`relative transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  selectedAccount === account.id ? 'ring-2 ring-primary' : ''
                } ${account.popular ? 'border-primary' : ''}`}
                onClick={() => handleAccountSelection(account.id)}
              >
                {account.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${account.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{account.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {account.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Fonctionnalités :</h4>
                    <ul className="space-y-1">
                      {account.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Validation */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <ValidationIcon className={`w-4 h-4 ${account.validationColor}`} />
                      <span className={`text-sm font-medium ${account.validationColor}`}>
                        {account.validation}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full mt-4"
                    variant={account.popular ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAccountSelection(account.id)
                    }}
                  >
                    Choisir {account.title}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <Alert className="max-w-2xl mx-auto">
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Besoin d'aide ?</strong> Chaque type de compte offre des fonctionnalités spécifiques 
              adaptées à votre rôle dans l'écosystème du livre. Vous pourrez toujours modifier votre profil 
              après validation par notre équipe.
            </AlertDescription>
          </Alert>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
