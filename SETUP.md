# 🛠️ Guide d'Installation Rapide - Ship Air Guard

## ⚡ Installation en 5 minutes

### 1️⃣ Clone & Install
```bash
git clone [votre-repo-url]
cd ship-air-guard
npm install
```

### 2️⃣ Base de données (Supabase - Gratuit)
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte gratuit
3. Créer un nouveau projet
4. Dans Settings → Database : copier la "Connection string"

### 3️⃣ Variables d'environnement
```bash
# Copier le fichier exemple
cp .env.example .env

# Générer un secret sécurisé
openssl rand -base64 32
```

Modifier `.env` :
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DATABASE]"
NEXTAUTH_SECRET="le-secret-genere-ci-dessus"
NEXTAUTH_URL="http://localhost:3000"
```

### 4️⃣ Configuration de la base
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5️⃣ Démarrer l'app
```bash
npm run dev
```

## ✅ Vérification
- Site : [http://localhost:3000](http://localhost:3000)
- Inscription : [http://localhost:3000/register](http://localhost:3000/register)
- Connexion : [http://localhost:3000/login](http://localhost:3000/login)

## 🆘 En cas de problème

### Base de données
```bash
# Si erreur Prisma
npx prisma migrate reset
npx prisma generate
```

### Authentification  
```bash
# Générer un nouveau secret
openssl rand -base64 32
# Puis redémarrer : Ctrl+C, npm run dev
```

### Cache
```bash
# Nettoyer le cache Next.js
rm -rf .next
npm run dev
```

**🎉 Votre app devrait maintenant fonctionner !**