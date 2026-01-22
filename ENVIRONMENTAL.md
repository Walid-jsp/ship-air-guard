# 🌊 Module Surveillance Environnementale Maritime

## 📋 Vue d'ensemble

Le module de surveillance environnementale de Ship Air Guard récupère et affiche en temps réel les données météorologiques et de qualité de l'air pour le **Vieux-Port de Marseille** (43.2951°N, 5.3744°E).

## 🎯 Objectifs

- **Surveillance maritime** : Focus sur la pollution SO₂ émise par les navires
- **Sécurité équipage** : Alertes qualité de l'air en temps réel  
- **Conformité réglementaire** : Respect des seuils OMS et IMO
- **Analyse dispersion** : Données météo pour prédire la propagation des polluants

## 🔗 APIs Utilisées

### Open-Meteo (Gratuit, sans clé API)
- **Météo** : https://api.open-meteo.com/v1/forecast
- **Qualité de l'air** : https://air-quality-api.open-meteo.com/v1/air-quality

## 📊 Données Récupérées

### 🌤️ Météorologie (Dispersion des polluants)
- **Température** : °C à 2m d'altitude
- **Vitesse du vent** : km/h à 10m d'altitude  
- **Direction du vent** : Degrés (convertis en points cardinaux)

### 🏭 Qualité de l'Air (Focus maritime)
- **PM10** : Particules fines (µg/m³)
- **PM2.5** : Particules très fines (µg/m³) 
- **NO₂** : Dioxyde d'azote (µg/m³)
- **SO₂** : ⚠️ **Dioxyde de soufre** (µg/m³) - **Critique navires**
- **O₃** : Ozone (µg/m³)

## ⚡ Fonctionnement

### 🔄 Cycle de mise à jour (Toutes les minutes)
1. **Appels parallèles** aux APIs Open-Meteo (`Promise.all`)
2. **Combinaison des données** météo + qualité de l'air
3. **Sauvegarde en base** (PostgreSQL via Prisma)
4. **Affichage temps réel** dans le dashboard
5. **Évaluation automatique** des niveaux de risque

### 🎨 Interface utilisateur
- **Cartes dynamiques** avec codes couleurs (Vert/Orange/Rouge)
- **Statut global** de la qualité de l'air
- **Conseils maritimes** adaptés aux conditions
- **Légendes explicatives** des seuils et unités

## 📁 Structure des fichiers

```
├── hooks/useEnvironmentalData.ts      # Hook React pour la récupération
├── components/EnvironmentalMonitor.tsx # Composant d'affichage principal  
├── types/environmental.ts             # Types TypeScript
├── utils/environmental.ts             # Fonctions utilitaires
├── prisma/schema.prisma              # Modèle BDD EnvironmentalData
└── app/api/environmental/            # APIs REST
    ├── save/route.ts                 # Sauvegarde des données
    ├── history/route.ts              # Historique et statistiques
    ├── current/route.ts              # Test API directe
    └── clear-cache/route.ts          # Nettoyage anciennes données
```

## 🎛️ Configuration

### 🌍 Coordonnées géographiques (modifiables)
```typescript
// types/environmental.ts
export const MARSEILLE_OLD_PORT = {
  name: 'Vieux-Port de Marseille',
  latitude: 43.2951,
  longitude: 5.3744,
  timezone: 'Europe/Paris'
} as const;
```

### ⏱️ Fréquence de mise à jour
```typescript
// hooks/useEnvironmentalData.ts  
const UPDATE_INTERVAL = 60000; // 1 minute = 60000ms
```

### 📏 Seuils d'alerte (OMS + réglementation maritime)
```typescript
// types/environmental.ts
export const ENVIRONMENTAL_THRESHOLDS = {
  pm10: { good: 20, moderate: 50, poor: 100 },      // µg/m³
  sulphurDioxide: { good: 20, moderate: 100, poor: 350 }, // ⚠️ Critique
  // ... autres seuils
};
```

## 🚀 Utilisation

### Dans le Dashboard
```tsx
import EnvironmentalMonitor from '@/components/EnvironmentalMonitor';

export default function Dashboard() {
  return (
    <div>
      {/* ... autres composants ... */}
      <EnvironmentalMonitor />
    </div>
  );
}
```

### Hook autonome
```tsx
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

const { data, loading, error, lastUpdate, refetch } = useEnvironmentalData();
```

## 🗄️ Base de données

### Modèle Prisma
```prisma
model EnvironmentalData {
  id              String    @id @default(cuid())
  timestamp       DateTime  @default(now())
  latitude        Float     @default(43.2951)
  longitude       Float     @default(5.3744)
  
  // Météo
  temperature     Float?    // °C
  windSpeed       Float?    // km/h
  windDirection   Float?    // °
  
  // Qualité de l'air  
  pm10           Float?     // µg/m³
  pm25           Float?     // µg/m³
  nitrogenDioxide Float?    // µg/m³
  sulphurDioxide  Float?    // µg/m³ (critique navires)
  ozone          Float?     // µg/m³
  
  dataSource     String    @default("open-meteo")
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

## 📡 APIs REST

### GET /api/environmental/current
Test direct des APIs Open-Meteo
```json
{
  "success": true,
  "data": {
    "weather": { "temperature": 18.5, "windSpeed": 12.3 },
    "airQuality": { "pm10": 15.2, "sulphurDioxide": 8.1 }
  }
}
```

### GET /api/environmental/history
Historique avec statistiques
```bash
GET /api/environmental/history?limit=100&hours=24
```

### DELETE /api/environmental/clear-cache
Nettoyage automatique (>30 jours)

## 🧪 Tests

### Page de test intégrée
```
/test-environmental
```
Teste la connectivité avec les APIs externes en temps réel.

## ⚠️ Seuils Critiques

### Dioxyde de Soufre (SO₂) - Focus Maritime
- **✅ Bon** : ≤ 20 µg/m³
- **🟠 Modéré** : 21-100 µg/m³  
- **🔴 Critique** : > 100 µg/m³

> Le SO₂ est particulièrement surveillé car émis massivement par les navires utilisant du fuel lourd (HFO). Indicateur clé de la pollution maritime.

### Particules Fines (PM2.5)
- **✅ Bon** : ≤ 10 µg/m³
- **🟠 Modéré** : 11-25 µg/m³
- **🔴 Critique** : > 25 µg/m³

## 🔧 Maintenance

### Nettoyage automatique
Les données de plus de 30 jours sont supprimées automatiquement pour optimiser les performances.

### Gestion des erreurs
- **Retry automatique** en cas d'échec API
- **Fallback gracieux** si une API est indisponible
- **Logs détaillés** pour le debugging

## 🎯 Améliorations futures

- [ ] **Alertes par email/SMS** si seuils dépassés
- [ ] **Graphiques historiques** avec Chart.js
- [ ] **Prédictions IA** basées sur l'historique
- [ ] **Export PDF** des rapports environnementaux
- [ ] **API webhook** pour systèmes externes
- [ ] **Géofencing** pour plusieurs zones portuaires

---

**Développé avec ❤️ pour la surveillance environnementale maritime**