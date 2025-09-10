# Guide de Déploiement Lahamarchand

## Variables d'environnement requises

### Base de données
```
DATABASE_URL="postgresql://username:password@host:5432/database"
```

### NextAuth.js
```
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Étapes de déploiement

### 1. Préparer la base de données PostgreSQL

#### Option A: Vercel Postgres (Recommandé)
1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Créer un nouveau projet
3. Ajouter Vercel Postgres dans l'onglet Storage
4. Copier la `DATABASE_URL` générée

#### Option B: Base de données externe
- Supabase (gratuit jusqu'à 500MB)
- PlanetScale (gratuit jusqu'à 1GB)
- Railway (gratuit jusqu'à 1GB)

### 2. Configurer les variables d'environnement sur Vercel

Dans le dashboard Vercel :
1. Aller dans Settings > Environment Variables
2. Ajouter :
   - `DATABASE_URL` : URL de votre base PostgreSQL
   - `NEXTAUTH_URL` : URL de votre app (ex: https://lahamarchand.vercel.app)
   - `NEXTAUTH_SECRET` : Clé secrète (générez avec `openssl rand -base64 32`)

### 3. Déployer

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Suivre les instructions
```

### 4. Migrations de base de données

Après le déploiement, exécuter les migrations :

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npx prisma generate
```

## Scripts de déploiement

Ajouter dans package.json :
```json
{
  "scripts": {
    "deploy": "vercel --prod",
    "db:deploy": "prisma migrate deploy",
    "db:generate": "prisma generate"
  }
}
```

## Vérifications post-déploiement

1. ✅ Application accessible
2. ✅ Connexion à la base de données
3. ✅ Authentification fonctionnelle
4. ✅ Toutes les fonctionnalités testées
5. ✅ Variables d'environnement correctes
