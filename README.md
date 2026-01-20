# Ship Air Guard

Ship Air Guard est une application de surveillance de la qualité de l'air maritime développée avec Next.js 16, NextAuth, Prisma et PostgreSQL.

## 🚀 Installation et Configuration

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/ship-air-guard.git
cd ship-air-guard
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration de la base de données

#### Option A : PostgreSQL Local
1. Installer PostgreSQL sur votre machine
2. Créer une base de données : `ship_air_guard`
3. Noter les informations de connexion (username, password, port)

#### Option B : PostgreSQL Cloud (Recommandé)
Utiliser un service comme :
- [Supabase](https://supabase.com) (gratuit)
- [Railway](https://railway.app) 
- [PlanetScale](https://planetscale.com)
- [Neon](https://neon.tech)

### 4. Variables d'environnement
1. Copier le fichier d'exemple :
```bash
cp .env.example .env
```

2. Modifier `.env` avec vos vraies valeurs :
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ship_air_guard"
NEXTAUTH_SECRET="votre-secret-genere"
NEXTAUTH_URL="http://localhost:3000"
```

⚠️ **Important** : Générer un secret NextAuth sécurisé :
```bash
openssl rand -base64 32
```

### 5. Migration de la base de données
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Lancer l'application
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🔐 Fonctionnalités d'Authentification

- **Inscription** : `/register`  
- **Connexion** : `/login`
- **Dashboard protégé** : `/dashboard`
- **Profil utilisateur** : `/dashboard/profile`

## 📊 Fonctionnalités Principales

- 📈 **Monitoring temps réel** : CO2, VOC, Température
- 🎯 **Tableaux de bord visuels** avec Chart.js
- 🔒 **Authentification sécurisée** avec NextAuth
- 💰 **Système d'abonnements** (Free, Starter, Pro, Enterprise)
- 📱 **Design responsive** avec TailwindCSS

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 16, React 19, TailwindCSS
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js
- **Graphiques** : Chart.js + React Chart.js 2
- **Validation** : Zod
- **Icons** : Lucide React

## 📁 Structure du Projet

```
├── app/                   # App Router de Next.js
│   ├── (auth)/           # Pages d'authentification
│   ├── api/              # Routes API
│   ├── components/       # Composants React
│   ├── dashboard/        # Pages protégées
│   └── globals.css       # Styles globaux
├── lib/                  # Utilitaires et configuration
├── prisma/               # Schéma et migrations DB
├── actions/              # Server Actions Next.js
└── types/                # Types TypeScript
```

## 🚨 Dépannage

### Erreur de connexion à la base de données
- Vérifier que PostgreSQL est démarré
- Contrôler la `DATABASE_URL` dans `.env`
- Exécuter `npx prisma migrate reset` si nécessaire

### Erreur d'authentification
- Vérifier `NEXTAUTH_SECRET` et `NEXTAUTH_URL`
- Effacer les cookies du navigateur
- Redémarrer le serveur de développement

### Erreur Prisma
```bash
# Régénérer le client Prisma
npx prisma generate

# Réinitialiser la DB (ATTENTION : efface les données)
npx prisma migrate reset
```

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.

---

**Développé avec ❤️ pour la surveillance environnementale maritime**
