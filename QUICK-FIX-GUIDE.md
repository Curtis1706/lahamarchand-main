# 🔧 RÉSOLUTION RAPIDE - ERREUR CRÉATION DE PROJET

## 🎯 Problème identifié
L'erreur "Internal Server Error" lors de la création de projet vient du fait que :
1. **Schéma Prisma modifié** mais migrations non appliquées
2. **Table Project** n'existe pas encore dans la base de données
3. **API** essaie d'accéder à une table inexistante

## ✅ Solution implémentée
L'API des projets a été modifiée pour :
- **Gérer gracieusement** l'absence de la table Project
- **Retourner une réponse simulée** si la base de données n'est pas prête
- **Permettre le test** de l'interface même sans base de données

## 🚀 COMMENT RÉSOUDRE DÉFINITIVEMENT

### **Option 1 : Configuration automatique (Recommandée)**
```bash
node configure-database.js
```

### **Option 2 : Commandes manuelles**
```bash
npx prisma generate
npx prisma migrate dev --name add-project-model
node configure-database.js
```

### **Option 3 : Script PowerShell (Windows)**
```powershell
.\configure-database.ps1
```

### **Option 4 : Commandes individuelles**
```bash
# 1. Générer le client Prisma
npx prisma generate

# 2. Appliquer les migrations
npx prisma migrate dev --name add-project-model

# 3. Si la migration échoue, réinitialiser
npx prisma migrate reset --force

# 4. Créer les données de base
node configure-database.js
```

## 📊 Ce qui sera créé

### **✅ Tables de base de données**
- `Project` : Projets en cours de conception
- `Work` : Œuvres validées et publiées
- `Discipline` : Disciplines académiques
- `User` : Utilisateurs (Auteur, Concepteur, PDG)

### **✅ Données de test**
- **10 disciplines** : Mathématiques, Français, Physique, etc.
- **3 utilisateurs** :
  - `auteur@test.com` / `password123`
  - `concepteur@test.com` / `password123`
  - `pdg@test.com` / `password123`

## 🎯 Après la configuration

1. **Redémarrer le serveur** : `npm run dev`
2. **Se connecter** : `concepteur@test.com` / `password123`
3. **Accéder aux projets** : `/dashboard/concepteur/projets`
4. **Tester la création** : Le projet sera maintenant persisté en base

## 🔍 Vérification du succès

Après la configuration, vous devriez voir :
- ✅ **Pas d'erreur** "Internal Server Error"
- ✅ **Création de projet** fonctionnelle
- ✅ **Projets persistés** en base de données
- ✅ **Message de succès** au lieu de simulation

## 🆘 Si l'erreur persiste

1. **Vérifier les logs** dans la console du navigateur
2. **Vérifier les logs** du serveur Next.js
3. **Redémarrer** le serveur après configuration
4. **Vider le cache** du navigateur (Ctrl+F5)

## 📞 Support

Si le problème persiste après ces étapes, vérifiez :
- ✅ Node.js installé et à jour
- ✅ Prisma CLI disponible (`npx prisma --version`)
- ✅ Base de données SQLite accessible
- ✅ Permissions d'écriture dans le dossier du projet

## 🎉 Mode simulation activé

En attendant la configuration complète, l'API fonctionne en **mode simulation** :
- ✅ **Création de projet** possible
- ✅ **Interface fonctionnelle**
- ⚠️ **Données temporaires** (non persistées)
- 📝 **Message d'avertissement** affiché


