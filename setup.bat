@echo off
REM 🚀 Script de setup automatique pour Ship Air Guard (Windows)
REM Usage: setup.bat

echo 🛠️  Configuration de Ship Air Guard...

REM 1. Vérifier si .env existe
if not exist .env (
    echo 📋 Création du fichier .env...
    copy .env.example .env
    echo.
    echo ✅ Fichier .env créé. IMPORTANT: Modifier les variables avant de continuer!
    echo.
    echo 🔑 Pour générer un secret NextAuth:
    echo    Utiliser un générateur en ligne ou Node.js
    echo    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    echo.
    echo 📊 Configurer votre base de données PostgreSQL dans .env
    echo    DATABASE_URL="postgresql://username:password@localhost:5432/ship_air_guard"
    echo.
    pause
)

REM 2. Installation des dépendances
echo 📦 Installation des dépendances...
call npm install

REM 3. Génération du client Prisma
echo 🏗️  Génération du client Prisma...
call npx prisma generate

REM 4. Migration de la base de données
echo 🗄️  Migration de la base de données...
call npx prisma migrate dev --name init

REM 5. Vérification
echo.
echo ✅ Setup terminé!
echo.
echo 🚀 Pour démarrer l'application:
echo    npm run dev
echo.
echo 🌐 Application disponible sur: http://localhost:3000
echo 📊 Dashboard Prisma: npm run db:studio
echo.
echo 🔐 Pages importantes:
echo    • Inscription: /register
echo    • Connexion: /login
echo    • Dashboard: /dashboard
echo.
pause