#!/bin/bash

# 🚀 Script de setup automatique pour Ship Air Guard
# Usage: chmod +x setup.sh && ./setup.sh

echo "🛠️  Configuration de Ship Air Guard..."

# 1. Vérifier si .env existe
if [ ! -f .env ]; then
    echo "📋 Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé. IMPORTANT: Modifier les variables avant de continuer!"
    echo ""
    echo "🔑 Générer un secret NextAuth:"
    echo "   openssl rand -base64 32"
    echo ""
    echo "📊 Configurer votre base de données PostgreSQL dans .env"
    echo "   DATABASE_URL=\"postgresql://username:password@localhost:5432/ship_air_guard\""
    echo ""
    read -p "Appuyer sur Entrée quand vous avez configuré le fichier .env..."
fi

# 2. Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# 3. Génération du client Prisma
echo "🏗️  Génération du client Prisma..."
npx prisma generate

# 4. Migration de la base de données
echo "🗄️  Migration de la base de données..."
npx prisma migrate dev --name init

# 5. Vérification
echo ""
echo "✅ Setup terminé!"
echo ""
echo "🚀 Pour démarrer l'application:"
echo "   npm run dev"
echo ""
echo "🌐 Application disponible sur: http://localhost:3000"
echo "📊 Dashboard Prisma: npm run db:studio"
echo ""
echo "🔐 Pages importantes:"
echo "   • Inscription: /register"
echo "   • Connexion: /login" 
echo "   • Dashboard: /dashboard"