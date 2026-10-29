# 📡 Earnings Radar

**Earnings Radar** est une Progressive Web App (PWA) responsive et résiliente dédiée à l'affichage des calendriers de publication des résultats financiers des entreprises cotées sur les marchés américains (NYSE, Nasdaq) et européens (Euronext Paris, XETRA, London Stock Exchange, SIX Swiss Exchange).

---

## 🚀 Fonctionnalités Clés

- **Vue Hebdomadaire & Quotidienne** : Grille du lundi au vendredi sur desktop et vue adaptative avec sélecteur de jour sur mobile.
- **Organisation par Session de Marché** :
  - *Avant ouverture* (BMO — Before Market Open)
  - *Pendant la séance*
  - *Après clôture* (AMC — After Market Close)
  - *Horaire indéterminé*
- **Sélecteur de Marché** : Filtrage instantané entre États-Unis, Europe et tous les marchés.
- **Recherche & Filtres** : Recherche textuelle rapide par symbole (ex. `AAPL`, `MC.PA`) ou nom d'entreprise, combinée avec des filtres par statut et session.
- **Fiabilité des Dates Explicite** :
  - `Confirmé` : Validé par communiqué officiel ou relations investisseurs.
  - `Estimé` : Issu de modèles de consensus ou d'historique de publication.
  - `À vérifier` : Donnée non encore formellement validée.
- **Fiche Détaillée** : Modal présentant la place boursière, pays, consensus BPA (EPS) et chiffre d'affaires, lien vers la source et horodatage de collecte.
- **PWA & Résilience Hors Ligne** : Mise en cache par Service Worker (Workbox) et localStorage ; consultation fluide sans connexion Internet avec badge d'avertissement.
- **Automatisation Sécurisée** : Workflow GitHub Actions pour la mise à jour quotidienne atomique des données sans exposition de clés API au navigateur.

---

## 🛠️ Architecture Technique

```text
earnings-radar/
├── .github/workflows/       # CI, collecte quotidienne et déploiement
├── data/                   # Dataset de production et schéma JSON
├── public/                 # Manifest PWA, icônes PNG/SVG et fallback hors ligne
├── scripts/                # Scripts Node.js de collecte, validation et publication
├── src/
│   ├── app/                # Racine React, router et providers
│   ├── components/         # Composants UI (Header, Grille, Fiches, Badges, etc.)
│   ├── features/           # Logique métier (Calendrier, Recherche, Préférences)
│   ├── hooks/              # Hooks React (useCalendarData, useNetworkStatus, usePreferences)
│   ├── lib/                # Utilitaires de dates, formatages financiers et stockage
│   ├── services/           # Abstraction client, repository et providers API
│   ├── styles/             # Variables CSS, tokens et feuilles de style
│   ├── types/              # Modèle TypeScript strict
│   └── validation/         # Schémas Zod pour validation à l'exécution
└── tests/                  # Fixtures, tests unitaires et tests de composants
```

---

## 📋 Prérequis

- **Node.js** : version 20 ou 22 (LTS recommandée).
- **Gestionnaire de paquets** : `npm`.

---

## 💻 Installation & Démarrage Local

1. **Cloner le dépôt et installer les dépendances** :
   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application est disponible sur [http://localhost:3000](http://localhost:3000).

3. **Lancer la validation des données du calendrier** :
   ```bash
   npm run data:validate
   ```

4. **Lancer la suite de tests** :
   ```bash
   npm run test:run
   ```

5. **Construire pour la production** :
   ```bash
   npm run build
   ```

---

## 🔑 Configuration d'Alpha Vantage

La clé API n'est requise **que** pour exécuter le script de mise à jour des données (`npm run data:update`). Elle n'est jamais transmise au navigateur ni présente dans le bundle de production.

1. Créez un fichier `.env` local basé sur `.env.example` :
   ```dotenv
   ALPHA_VANTAGE_API_KEY=votre_cle_alpha_vantage
   ```
2. Sur GitHub, renseignez le secret de dépôt :
   `Settings > Secrets and variables > Actions > New repository secret`
   Nom : `ALPHA_VANTAGE_API_KEY`.

### Limites et Couverture du Fournisseur
- **Couverture US** : Alpha Vantage fournit une couverture complète des tickers NYSE et NASDAQ.
- **Couverture Européenne** : Le plan gratuit standard d'Alpha Vantage (limité à 25 requêtes/jour) ne couvre pas nativement l'ensemble des places boursières européennes (Euronext, Xetra, etc.). L'adaptateur d'Earnings Radar complète ces informations par les communiqués officiels des relations investisseurs des émetteurs.

---

## 📱 Installation de la PWA

- **Chrome / Edge / Android** : Cliquez sur le bouton « Installer l'application » présent dans l'en-tête pour installer Earnings Radar directement sur votre système.
- **Safari iOS** : Appuyez sur le bouton de partage Safari, puis sélectionnez « Sur l'écran d'accueil ».

---

## ⚖️ Avertissement Légal

Earnings Radar est un outil informatif de visualisation de calendriers financiers. Aucune information affichée ne constitue un conseil en investissement ou une incitation à l'achat ou à la vente de titres financiers.
