# Environment Variables Setup Summary

## Overview

Environment variables control build-time Google Drive sync, deployment settings, and maintenance mode. Runtime image loading always uses `public/images/`.

## Key Files

| File | Purpose |
|------|---------|
| `.env.local.example` | Local development template |
| `.env.production.example` | Docker/production template |
| `.github/workflows/deploy.yml` | CI secrets for Vercel build |

## Scenarios

### Local images only (default)

No secrets required. Images in `public/images/`.

### Google Drive build sync

```env
IMAGE_SOURCE_TYPE=google-drive
GOOGLE_SERVICE_ACCOUNT_KEY=...
GOOGLE_DRIVE_FOLDER_ID=...
```

Images sync at build time via `scripts/sync-images.ts`.

### Custom domain

```env
NEXT_PUBLIC_BASE_URL=https://www.yourwedding.com
```

## Local Development

```bash
cp .env.local.example .env.local
# Edit values
npm run test-drive   # If using Drive
npm run dev
```

## CI / GitHub Secrets

Add secrets in Repository Settings → Secrets → Actions. See [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md).

## RSVP

RSVP uses a Google Forms link in `config/wedding.json`. No Sheets API or sync script — responses stay in Google Forms/Sheets only.

## Related Docs

- [ENV_VARIABLES_QUICK_REFERENCE.md](ENV_VARIABLES_QUICK_REFERENCE.md)
- [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
- [IMAGE_SOURCES.md](IMAGE_SOURCES.md)
- [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md)
