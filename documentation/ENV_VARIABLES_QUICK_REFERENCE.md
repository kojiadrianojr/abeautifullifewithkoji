# Environment Variables Quick Reference

Quick reference for environment variables. See [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) for detailed setup.

## Scenarios

### Scenario 1: Basic Deployment (Local Images)

**Required secrets:** NONE

Push to `main` and deploy. Images live in `public/images/`.

---

### Scenario 2: Custom Domain

**Required:**
- `NEXT_PUBLIC_BASE_URL` = `https://www.yourwedding.com`

---

### Scenario 3: Google Drive Images (Build-Time Sync)

**Required:**
- `GOOGLE_SERVICE_ACCOUNT_KEY` = `{"type":"service_account",...}`
- `IMAGE_SOURCE_TYPE` = `google-drive`
- `GOOGLE_DRIVE_FOLDER_ID` = `1a2b3c4d5e6f...`

**Optional per-collection folder IDs:**
- `GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID`
- `GOOGLE_DRIVE_GALLERY_FOLDER_ID`
- `GOOGLE_DRIVE_THROWBACK_FOLDER_ID`
- `GOOGLE_DRIVE_PRENUP_FOLDER_ID`
- `GOOGLE_DRIVE_DRESS_CODE_FOLDER_ID`

**Setup:**
1. Create service account and enable Drive API
2. Share folders with service account
3. Add secrets to GitHub / `.env.local`
4. Run `npm run test-drive` to validate

---

## Variable Reference

### GOOGLE_SERVICE_ACCOUNT_KEY

Single-line JSON string. Convert with:
```bash
jq -c . service-account-key.json
```

### GOOGLE_DRIVE_FOLDER_ID

Extract from URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`

### IMAGE_SOURCE_TYPE

| Value | Behavior |
|-------|----------|
| `local` | No Drive sync; use `public/images/` |
| `google-drive` | Sync from Drive at build, serve local |
| `direct-google-drive` | Legacy alias for `google-drive` |

## Checklist

- [ ] `.env.local` created from `.env.local.example`
- [ ] For Drive sync: service account has Viewer access to folders
- [ ] For Drive sync: `npm run test-drive` passes
- [ ] `NEXT_PUBLIC_BASE_URL` set for production

## Related Docs

- [IMAGE_SOURCES.md](IMAGE_SOURCES.md)
- [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md)
- [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
