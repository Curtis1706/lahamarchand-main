# 🔧 GUIDE DE CONFIGURATION PERMANENTE

## 🎯 Objectif
Configurer la base de données pour que les projets soient stockés de manière permanente et que le PDG puisse les voir et les valider.

## 🚀 ÉTAPES À SUIVRE

### **Étape 1 : Appliquer les migrations Prisma**

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev --name add-project-model
```

Si la migration échoue, réinitialisez la base de données :

```bash
npx prisma migrate reset --force
```

### **Étape 2 : Créer les données de base**

```bash
node setup-db-final.js
```

### **Étape 3 : Vérifier la configuration**

1. Redémarrer le serveur : `npm run dev`
2. Se connecter comme concepteur : `concepteur@test.com` / `password123`
3. Créer un projet
4. Se connecter comme PDG : `pdg@test.com` / `password123`
5. Vérifier que le projet apparaît dans la liste PDG

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
- **3 projets de test** : Manuel Mathématiques, Histoire Gabon, Contes Gabonais

## 🔍 Vérification du succès

Après la configuration, vous devriez voir :
- ✅ **Projets persistés** en base de données
- ✅ **PDG peut voir** les projets soumis
- ✅ **Workflow complet** Projet → Validation → Œuvre
- ✅ **Pas de mode temporaire** dans les messages

## 🆘 Si les migrations échouent

### **Option 1 : Réinitialiser complètement**
```bash
npx prisma migrate reset --force
npx prisma generate
node setup-db-final.js
```

### **Option 2 : Supprimer et recréer**
```bash
# Supprimer la base de données
rm prisma/dev.db

# Recréer
npx prisma migrate dev --name init
npx prisma generate
node setup-db-final.js
```

### **Option 3 : Vérifier le schéma**
Vérifiez que le fichier `prisma/schema.prisma` contient bien le modèle `Project`.

## 📞 Support

Si le problème persiste :
1. Vérifiez que Node.js est installé
2. Vérifiez que Prisma CLI est disponible (`npx prisma --version`)
3. Vérifiez les permissions d'écriture dans le dossier
4. Redémarrez le serveur après configuration

## 🎉 Résultat attendu

Une fois configuré :
- ✅ **Projets créés** par le concepteur sont persistés
- ✅ **PDG peut voir** tous les projets soumis
- ✅ **Validation** des projets par le PDG
- ✅ **Création d'œuvres** automatique lors de la validation
- ✅ **Workflow complet** fonctionnel


