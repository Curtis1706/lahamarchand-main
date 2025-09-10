// Script de test pour vérifier Better Auth
import { authClient } from "@/lib/auth-client"

async function testBetterAuthClient() {
  console.log("🧪 Test du client Better Auth...")
  
  try {
    // Test de création d'un utilisateur
    console.log("📝 Test d'inscription...")
    const signUpResult = await authClient.signUp.email({
      email: "test@example.com",
      password: "testpassword123",
      name: "Test User",
      role: "CLIENT"
    })
    
    if (signUpResult.error) {
      console.log("ℹ️ Utilisateur existe déjà ou erreur:", signUpResult.error.message)
    } else {
      console.log("✅ Inscription réussie:", signUpResult.data)
    }
    
    // Test de connexion
    console.log("🔐 Test de connexion...")
    const signInResult = await authClient.signIn.email({
      email: "test@example.com",
      password: "testpassword123"
    })
    
    if (signInResult.error) {
      console.log("❌ Erreur de connexion:", signInResult.error.message)
    } else {
      console.log("✅ Connexion réussie:", signInResult.data)
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du test:", error)
  }
}

// Exécuter le test
testBetterAuthClient()



