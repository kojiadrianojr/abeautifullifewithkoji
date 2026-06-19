# Image Service API

Server-side image loading from `public/images/`.

> **Note:** Google Drive sync happens at build time only. This service always reads local files.

## Import

```typescript
import {
  getHeroAlbumImages,
  getGalleryImages,
  getThrowbackPhotos,
  getPrenupPhotos,
  getDressCodePhotos,
  getDressCodePhotosMetadata,
} from "@/services/imageService";
```

Do not import from `@/services` barrel — use the direct path in server components.

## Functions

### Collection helpers

| Function | Directory | Returns |
|----------|-----------|---------|
| `getHeroAlbumImages()` | `hero-album` | `string[]` (URLs) |
| `getGalleryImages()` | `gallery` | `string[]` |
| `getThrowbackPhotos()` | `throwback` | `string[]` |
| `getPrenupPhotos()` | `prenup` | `string[]` |
| `getDressCodePhotos()` | `dress-code` | `string[]` |

### Metadata variants

| Function | Returns |
|----------|---------|
| `getHeroAlbumImagesMetadata()` | `ImageMetadata[]` |
| `getGalleryImagesMetadata()` | `ImageMetadata[]` |
| `getThrowbackPhotosMetadata()` | `ImageMetadata[]` |
| `getPrenupPhotosMetadata()` | `ImageMetadata[]` |
| `getDressCodePhotosMetadata()` | `ImageMetadata[]` |

### Generic helpers

```typescript
getImagesFromDirectory(directory: string): Promise<string[]>
getImagesMetadataFromDirectory(directory: string): Promise<ImageMetadata[]>
validateImagePath(): Promise<boolean>
```

## ImageMetadata

```typescript
interface ImageMetadata {
  id: string;
  url: string;           // e.g. "/images/gallery/photo.webp"
  thumbnailUrl?: string;
  name?: string;
  mimeType?: string;
  createdAt?: string;
  modifiedAt?: string;
}
```

## Usage in Server Components

```typescript
// src/app/page.tsx
const [heroImages, throwbackPhotos] = await Promise.all([
  getHeroAlbumImages(),
  getThrowbackPhotos(),
]);
```

## Provider

Runtime uses `LocalImageProvider` (`src/services/providers/localProvider.ts`):

- Reads from `public/images/<collection>/`
- Returns URLs as `/images/<collection>/<filename>`
- Sorts files naturally (1.jpg, 2.jpg, 10.jpg)

## Build-Time Sync

To populate `public/images/` from Google Drive:

```env
IMAGE_SOURCE_TYPE=google-drive
GOOGLE_SERVICE_ACCOUNT_KEY=...
GOOGLE_DRIVE_FOLDER_ID=...
```

```bash
npm run sync-images   # or npm run build (runs sync in prebuild)
```

See [IMAGE_SOURCES.md](IMAGE_SOURCES.md) for full setup.

## Related Docs

- [GOOGLE_DRIVE_IMPLEMENTATION.md](GOOGLE_DRIVE_IMPLEMENTATION.md)
- [IMAGE_SOURCES.md](IMAGE_SOURCES.md)
