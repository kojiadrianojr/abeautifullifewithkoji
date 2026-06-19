# Scripts Directory

Build-time and utility scripts for the wedding website.

## Available Scripts

### sync-images.ts

Syncs images from Google Drive to `public/images/` at build time.

```bash
npm run sync-images
```

Runs automatically before `npm run build` via the `prebuild` script.

**Prerequisites:**
- `IMAGE_SOURCE_TYPE=google-drive` (or legacy `direct-google-drive`)
- `GOOGLE_SERVICE_ACCOUNT_KEY` and `GOOGLE_DRIVE_FOLDER_ID` in `.env.local`
- See [GOOGLE_DRIVE_SETUP.md](../documentation/GOOGLE_DRIVE_SETUP.md)

**What it does:**
- Authenticates with Google Drive API
- Lists images in each collection folder
- Downloads new/changed files only
- Removes local files no longer in Drive

### optimize-images.ts

Converts JPEG/PNG images in `public/images/` to WebP and resizes for web display.

```bash
npm run optimize-images
npm run optimize-images -- --force   # Re-optimize all files
```

Runs automatically after `sync-images` in the `prebuild` script.

### test-google-drive.ts

Validates Google Drive configuration and lists images per collection.

```bash
npm run test-drive
```

### clear-cache.js

Triggers a full rebuild to refresh images after Drive changes.

```bash
npm run clear-cache
npm run clear-cache -- --dev   # Instructions for dev server restart
```

## Creating New Scripts

1. Create a TypeScript file in this directory with `#!/usr/bin/env tsx`
2. Load env with `dotenv` if needed: `config({ path: ".env.local" })`
3. Add an npm script in `package.json`
4. Document here

## Dependencies

- `tsx` — TypeScript execution
- `dotenv` — environment variable loading
- `googleapis` — Google Drive API (sync-images, test-drive only)
- `sharp` — image optimization (optimize-images)
