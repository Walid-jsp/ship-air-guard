# Guide Déploiement - Ship Air Guard

## 🚀 Déploiement sur Vercel (Recommandé)

### 1. Préparer la base de données
```bash
# Base de données de production (Supabase/Railway/PlanetScale)
DATABASE_URL="postgresql://prod-url"
```

### 2. Variables d'environnement Vercel
Dans le dashboard Vercel, ajouter :
```env
DATABASE_URL=postgresql://votre-db-prod
NEXTAUTH_SECRET=secret-production-super-long
NEXTAUTH_URL=https://votre-app.vercel.app
```

### 3. Déployer
```bash
npx vercel --prod
```

## 🐳 Déploiement avec Docker

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/ship_air_guard
      - NEXTAUTH_SECRET=your-production-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=ship_air_guard
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## ⚡ Déploiement rapide
```bash
# Build de production
npm run build

# Démarrer en production
npm start
```