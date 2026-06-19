# Google Drive Setup

Set up Google Drive as a build-time image source for your wedding website.

## What This Does

- Photos live in Google Drive folders you manage
- `scripts/sync-images.ts` downloads them to `public/images/` before each build
- The website serves local static files — no runtime Drive API calls

## Prerequisites

- A Google account with the wedding photos in Drive
- A Google Cloud project with the **Google Drive API** enabled

## Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **Google Drive API** (APIs & Services → Library)
4. Create a service account (APIs & Services → Credentials → Create Credentials → Service Account)
5. Create a JSON key for the service account and download it

## Step 2: Share Drive Folders

Share each image folder with the service account email (e.g. `your-sa@project.iam.gserviceaccount.com`) with **Viewer** permission.

Get folder IDs from the URL:
```
https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                    ^^^^^^^^^^^^^^^^^^^^
                                    This is the folder ID
```

## Step 3: Configure Environment Variables

Add to `.env.local`:

```env
IMAGE_SOURCE_TYPE=google-drive

GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'

# Parent folder (with subfolders: hero-album, gallery, throwback, prenup, dress-code)
GOOGLE_DRIVE_FOLDER_ID=your-main-folder-id

# Or specify each collection folder individually:
# GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID=...
# GOOGLE_DRIVE_GALLERY_FOLDER_ID=...
# GOOGLE_DRIVE_THROWBACK_FOLDER_ID=...
# GOOGLE_DRIVE_PRENUP_FOLDER_ID=...
# GOOGLE_DRIVE_DRESS_CODE_FOLDER_ID=...
```

Convert multi-line JSON to a single line:
```bash
jq -c . service-account-key.json
```

## Step 4: Test and Sync

```bash
npm run test-drive     # Verify credentials and folder access
npm run sync-images    # Download images to public/images/
npm run dev            # Preview the site
```

`npm run build` runs sync automatically via the `prebuild` script.

## GitHub Actions / Vercel Secrets

Set these repository secrets for CI builds:

| Secret | Required |
|--------|----------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Yes |
| `IMAGE_SOURCE_TYPE` | Yes (`google-drive`) |
| `GOOGLE_DRIVE_FOLDER_ID` | Yes |
| `GOOGLE_DRIVE_*_FOLDER_ID` | Optional per collection |

See [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) for details.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "GOOGLE_SERVICE_ACCOUNT_KEY not set" | Add key to `.env.local` |
| "No folder found" | Check folder ID and service account sharing |
| "Failed to authenticate" | Verify JSON key format and Drive API is enabled |
| Images not updating | Run `npm run sync-images` or `npm run build` |

## Related Docs

- [IMAGE_SOURCES.md](IMAGE_SOURCES.md) — image source overview
- [GOOGLE_DRIVE_IMPLEMENTATION.md](GOOGLE_DRIVE_IMPLEMENTATION.md) — code architecture
