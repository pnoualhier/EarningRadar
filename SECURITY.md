# Politique de Sécurité — Earnings Radar

## 1. Gestion des Secrets et Isolation des Clés API

- **Aucune clé dans le frontend** : La clé d'API financière `ALPHA_VANTAGE_API_KEY` n'est **jamais** exposée au navigateur web. Elle n'est accessible que dans le cadre des scripts Node.js s'exécutant dans GitHub Actions ou en local pour la génération de données.
- **Aucune variable VITE_\*** : La clé ne porte aucun préfixe `VITE_` pour empêcher Vite de l'injecter dans le bundle client statique.
- **Masquage dans les logs** : Tous les messages d'erreur et journaux d'exécution sanitizent et remplacent automatiquement toute occurrence de la clé par `[REDACTED_API_KEY]`.
- **Exclusion Git** : Les fichiers d'environnement (`.env`, `.env.local`) sont ignorés par Git.

## 2. Procédure de Rotation de Clé

En cas de compromission suspectée ou avérée de la clé `ALPHA_VANTAGE_API_KEY` :
1. Se connecter à la console du fournisseur (Alpha Vantage) et générer une nouvelle clé API.
2. Mettre à jour le secret de dépôt GitHub sous : `Settings > Secrets and variables > Actions > ALPHA_VANTAGE_API_KEY`.
3. Révoquer immédiatement l'ancienne clé dans la console Alpha Vantage.
4. Déclencher manuellement le workflow `update-earnings.yml` pour valider la connectivité.

## 3. Signalement des Vulnérabilités

Pour signaler une faille de sécurité :
- Ne créez pas d'issue publique.
- Contactez l'équipe de maintenance par e-mail sécurisé à l'adresse du propriétaire du dépôt ou via les Security Advisories de GitHub.
- Une réponse d'accusé de réception sera fournie sous 48 heures ouvrées.

## 4. Règles de Validation des Données

- Les données entrantes sont systématiquement validées par des schémas stricts Zod (`src/validation/earnings-schemas.ts`).
- Toute anomalie bloquante (date incohérente, doublon d'identifiant, métrique corrompue) interrompt immédiatement la publication.
- Le dernier calendrier de données valide est préservé sans altération.

## 5. Limites de Sécurité de l'Application

- Earnings Radar est une application statique client (PWA) ne stockant aucun mot de passe ni donnée financière confidentielle d'utilisateurs.
- Aucune transaction ou ordre de bourse ne peut être passé via cette application.
