# Spécifications des Données — Earnings Radar

Ce dossier contient les fichiers de données du calendrier financier utilisé par l'application Earnings Radar.

## 1. Structure et Schéma

Le fichier de production se trouve à l'emplacement `data/calendar.json` (et répliqué dans `public/data/calendar.json` pour la distribution statique de la PWA).
Il respecte strictement le schéma défini dans `data/calendar.schema.json` et validé par Zod (`src/validation/earnings-schemas.ts`).

### Format de l'objet racine

```json
{
  "metadata": {
    "schemaVersion": 1,
    "generatedAt": "2026-10-29T12:00:00.000Z",
    "lastSuccessfulFetchAt": "2026-10-29T12:00:00.000Z",
    "provider": "Alpha Vantage / Financial Feed",
    "status": "success",
    "eventCount": 42,
    "markets": ["US", "EU"],
    "warnings": []
  },
  "events": [
    {
      "id": "US_AAPL_2026-10-29_after_close",
      "symbol": "AAPL",
      "companyName": "Apple Inc.",
      "market": "US",
      "exchange": "NASDAQ",
      "country": "US",
      "announcementDate": "2026-10-29",
      "announcementTime": "16:30",
      "timeZone": "America/New_York",
      "session": "after_close",
      "dateStatus": "confirmed",
      "fiscalPeriod": "2026-09-30",
      "epsEstimate": 1.60,
      "revenueEstimate": 94500000000,
      "currency": "USD",
      "sourceName": "Apple Investor Relations",
      "sourceUrl": "https://investor.apple.com",
      "fetchedAt": "2026-10-29T12:00:00.000Z"
    }
  ]
}
```

## 2. Origine des Données et Limitations

- **Marché US (NYSE, Nasdaq)** : Fourni par le flux financier d'Alpha Vantage (`EARNINGS_CALENDAR`) et les communiqués de presse d'entreprises.
- **Marché Europe (Euronext, Xetra, LSE, SIX)** : Les publications des indices majeurs (CAC 40, DAX, FTSE 100, SMI) proviennent des déclarations financières réglementées et calendriers officiels.
- **Transparence sur le plan gratuit Alpha Vantage** : Le plan standard gratuit d'Alpha Vantage est limité à 25 requêtes par jour et ne couvre pas l'ensemble des places boursières européennes. L'application affiche explicitement cette provenance.

## 3. Statut des Dates

- `confirmed` : Date formellement annoncée ou confirmée par l'entreprise (communiqué officiel de relations investisseurs).
- `estimated` : Date estimée par modèle algorithmique ou consensus d'analystes.
- `unverified` : Date rapportée sans confirmation vérifiable ou soumise à caution.

## 4. Politique de Rétention et Atomicité

1. **Publication atomique** : Toute nouvelle génération s'effectue dans `calendar.tmp.json`. Le fichier est validé par Zod et le script de détection d'anomalies.
2. **Préservation en cas d'erreur** : Si le fournisseur API échoue (dépassement de quota, panne réseau, données corrompues), le script interrompt la mise à jour et conserve intégralement la dernière version valide.
3. **Aucune donnée fictive** : Les données de production ne contiennent jamais de simulation non étiquetée. Les jeux d'essais sont strictement confinés au dossier `tests/fixtures/`.
