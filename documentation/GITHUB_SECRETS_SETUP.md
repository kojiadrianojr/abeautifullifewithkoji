# GitHub Secrets Setup Guide

Configure GitHub Secrets for Vercel deployment via GitHub Actions.

## Required vs Optional

| Scenario | Secrets needed |
|----------|----------------|
| Local images only | None |
| Custom domain | `NEXT_PUBLIC_BASE_URL` |
| Google Drive build sync | `GOOGLE_SERVICE_ACCOUNT_KEY`, `IMAGE_SOURCE_TYPE`, `GOOGLE_DRIVE_FOLDER_ID` |

## How to Add Secrets

1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add name and value
4. Repeat for each secret

## Secret Reference

### `NEXT_PUBLIC_BASE_URL` (Optional)

Your production URL, e.g. `https://www.yourwedding.com`

### `GOOGLE_SERVICE_ACCOUNT_KEY` (Drive sync)

Single-line JSON service account key. Convert with:
```bash
jq -c . service-account-key.json
```

See [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) for creating the service account.

### `IMAGE_SOURCE_TYPE` (Drive sync)

Set to `google-drive` to enable build-time Drive sync. Default is `local`.

### `GOOGLE_DRIVE_FOLDER_ID` (Drive sync)

Parent folder ID from the Drive URL.

### Per-collection folder IDs (Optional)

- `GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID`
- `GOOGLE_DRIVE_GALLERY_FOLDER_ID`
- `GOOGLE_DRIVE_THROWBACK_FOLDER_ID`
- `GOOGLE_DRIVE_PRENUP_FOLDER_ID`
- `GOOGLE_DRIVE_DRESS_CODE_FOLDER_ID`

### Vercel deployment secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Maintenance mode (Optional)

- `NEXT_PUBLIC_MAINTENANCE_MODE`
- `NEXT_PUBLIC_MAINTENANCE_TOKEN`

## Example: Google Drive Setup

```
GOOGLE_SERVICE_ACCOUNT_KEY     = {"type":"service_account",...}
IMAGE_SOURCE_TYPE              = google-drive
GOOGLE_DRIVE_FOLDER_ID         = 1a2b3c4d5e6f...
GOOGLE_DRIVE_GALLERY_FOLDER_ID = 1u2v3w4x5y6z...  (optional)
```

## Testing

```bash
# Local
cp .env.local.example .env.local
# Fill in values
npm run test-drive
npm run build

# CI
git push origin main
# Check Actions → Deploy to Vercel
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Invalid JSON | Use `jq -c` for single-line service account key |
| Secret not found | Check exact name (case-sensitive) |
| Images not syncing | Verify `IMAGE_SOURCE_TYPE=google-drive` and folder sharing |
| Build succeeds but no new images | Check `public/images` cache in workflow |

## Security

- Never commit `.env.local` or service account JSON files
- Grant service account **Viewer** access only
- Rotate keys periodically

## Related Docs

- [ENV_VARIABLES_QUICK_REFERENCE.md](ENV_VARIABLES_QUICK_REFERENCE.md)
- [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md)
- [IMAGE_SOURCES.md](IMAGE_SOURCES.md)
