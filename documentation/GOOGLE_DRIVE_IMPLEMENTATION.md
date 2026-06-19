# Google Drive Implementation

Technical details for the build-time Google Drive image sync.

## Architecture

```
src/lib/googleDrive/          # Shared Drive API module (build-time only)
├── config.ts                 # Collection names, env parsing, isDriveSyncEnabled()
├── client.ts                 # createDriveClient() — service account auth
├── folders.ts                # resolveCollectionFolderId()
├── files.ts                  # listImageFiles(), downloadFile(), orphan cleanup
└── index.ts                  # Public exports

scripts/
├── sync-images.ts            # Prebuild sync orchestrator
├── test-google-drive.ts      # Configuration validation
└── optimize-images.ts        # WebP conversion (post-sync)

src/services/
├── imageService.ts           # Runtime — always reads public/images/
└── providers/
    └── localProvider.ts      # Local filesystem provider
```

## Build Pipeline

```
npm run build
  └── prebuild
        ├── sync-images.ts    (if IMAGE_SOURCE_TYPE=google-drive)
        └── optimize-images.ts
  └── next build
        └── page.tsx fetches images via imageService (local only)
```

## Module: `src/lib/googleDrive/`

### `config.ts`

- `IMAGE_COLLECTIONS` — `hero-album`, `gallery`, `throwback`, `prenup`, `dress-code`
- `isDriveSyncEnabled()` — returns true for `google-drive` or legacy `direct-google-drive`
- `getDriveConfig()` — parses `GOOGLE_DRIVE_*` env vars

### `client.ts`

- `createDriveClient()` — authenticates with `drive.readonly` scope

### `folders.ts`

- `resolveCollectionFolderId()` — uses configured ID or searches for subfolder by name

### `files.ts`

- `listImageFiles()` — lists images in a folder
- `downloadFile()` — streams file to disk
- `isLocalCopyUpToDate()` — skips unchanged files (checks original and WebP mtime)
- `removeOrphanedLocalImages()` — deletes local files removed from Drive

## Runtime Image Service

`imageService.ts` is a thin facade over `localProvider`. It does not call Google APIs.

```typescript
const provider = createLocalProvider("");
export async function getGalleryImages() {
  return metadataToUrls(await provider.getImagesFromDirectory("gallery"));
}
```

## Environment Variables (Build-Time)

| Variable | Purpose |
|----------|---------|
| `IMAGE_SOURCE_TYPE` | `local` or `google-drive` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Service account JSON |
| `GOOGLE_DRIVE_FOLDER_ID` | Parent folder |
| `GOOGLE_DRIVE_*_FOLDER_ID` | Per-collection overrides |

## CI Caching

`.github/workflows/deploy.yml` caches `public/images/` weekly so unchanged Drive files are not re-downloaded on every commit.

## Removed Features

The following were removed to simplify the codebase:

- **Hybrid mode** — runtime local + Drive mixing
- **Runtime Drive provider** — `directGoogleDriveProvider.ts`, `hybridProvider.ts`
- **Google Sheets RSVP sync** — `googleFormsService.ts`, `sync-rsvp.ts`
- **Runtime image cache** — `IMAGE_CACHE_ENABLED`, `clearImageCache()`

## Related Docs

- [IMAGE_SOURCES.md](IMAGE_SOURCES.md)
- [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md)
