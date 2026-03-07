# Image Service API Documentation

This document provides technical documentation for developers working with the image service and providers.

## Architecture Overview

The image service uses a provider pattern to support multiple image sources:

```
┌─────────────────────────────────────┐
│      imageService.ts (Facade)       │  ← High-level API
└────────────┬────────────────────────┘
             │
             ├─────────────────────────────────┐
             │                                 │
    ┌────────▼──────────┐          ┌──────────▼────────────┐
    │  IImageProvider   │          │   ImageMetadata       │
    │   (Interface)     │          │      (Type)           │
    └────────┬──────────┘          └───────────────────────┘
             │
    ┌────────┴─────────┬───────────────┬──────────────────┐
    │                  │               │                  │
┌───▼────────┐  ┌──────▼──────┐  ┌────▼──────────┐  ┌────▼────────┐
│   Local    │  │   Google    │  │    Hybrid     │  │   Future    │
│  Provider  │  │    Drive    │  │   Provider    │  │  Providers  │
│            │  │   Provider  │  │ (Combines    │  │  (S3, etc)  │
│            │  │             │  │  multiple)   │  │             │
└────────────┘  └─────────────┘  └──────────────┘  └─────────────┘
```

## Core Interfaces

### IImageProvider

All image providers must implement this interface:

```typescript
interface IImageProvider {
  // Get all images from the provider's root
  getImages(): Promise<ImageMetadata[]>;
  
  // Get images from a specific directory/folder
  getImagesFromDirectory(directory: string): Promise<ImageMetadata[]>;
  
  // Check if the provider is properly configured
  isConfigured(): Promise<boolean>;
  
  // Optional: Clear any cached data
  clearCache?(): Promise<void>;
}
```

### ImageMetadata

Image information returned by providers:

```typescript
interface ImageMetadata {
  id: string;              // Unique identifier (file path or Drive ID)
  url: string;             // Direct URL to the image
  thumbnailUrl?: string;   // Optional thumbnail URL
  name?: string;           // Original filename
  mimeType?: string;       // MIME type (e.g., "image/jpeg")
  createdAt?: string;      // ISO date string
  modifiedAt?: string;     // ISO date string
}
```

## Provider Configuration Types

### LocalProviderConfig

```typescript
interface LocalProviderConfig extends ImageProviderConfig {
  type: "local";
  baseDirectory: string;  // Relative to public/images/
  priority?: number;      // For hybrid mode (lower = higher priority)
}
```

### GoogleDriveProviderConfig

```typescript
interface GoogleDriveProviderConfig extends ImageProviderConfig {
  type: "google-drive";
  folderId: string;              // Google Drive folder ID
  serviceAccountKey?: string;    // Optional, uses env var if not provided
  includeSubfolders?: boolean;   // Default: false
  cacheEnabled?: boolean;        // Default: true
  cacheDuration?: number;        // Default: 5 minutes (in milliseconds)
  priority?: number;             // For hybrid mode
}
```

### HybridProviderConfig

```typescript
interface HybridProviderConfig extends ImageProviderConfig {
  type: "hybrid";
  providers: (LocalProviderConfig | GoogleDriveProviderConfig)[];
}
```

## Image Service API

### Basic Functions (Backward Compatible)

These functions return simple string arrays of image URLs:

```typescript
// Get images from a specific directory
await getImagesFromDirectory(directory: string): Promise<string[]>

// Get specific collections
await getHeroAlbumImages(): Promise<string[]>
await getGalleryImages(): Promise<string[]>
await getThrowbackPhotos(): Promise<string[]>
await getPrenupPhotos(): Promise<string[]>

// Validate image path (for local images)
await validateImagePath(imagePath: string): Promise<boolean>

// Clear cache
await clearImageCache(): Promise<void>
```

### Metadata Functions (New)

These functions return full metadata for each image:

```typescript
// Get images with metadata from a directory
await getImagesMetadataFromDirectory(directory: string): Promise<ImageMetadata[]>

// Get specific collections with metadata
await getHeroAlbumImagesMetadata(): Promise<ImageMetadata[]>
await getGalleryImagesMetadata(): Promise<ImageMetadata[]>
await getThrowbackPhotosMetadata(): Promise<ImageMetadata[]>
await getPrenupPhotosMetadata(): Promise<ImageMetadata[]>
```

## Using Providers Directly

### Local Provider

```typescript
import { createLocalProvider } from "@/services/providers";

const provider = createLocalProvider("gallery");
const images = await provider.getImages();
```

### Google Drive Provider

```typescript
import { createGoogleDriveProvider } from "@/services/providers";

const provider = createGoogleDriveProvider({
  folderId: "your-folder-id",
  cacheEnabled: true,
  cacheDuration: 10 * 60 * 1000, // 10 minutes
});

const images = await provider.getImages();

// Get images from a subfolder
const subfolder = await provider.getImagesFromDirectory("prenup");

// Clear cache
await provider.clearCache();
```

### Hybrid Provider

```typescript
import { createHybridProvider } from "@/services/providers";

const provider = createHybridProvider([
  {
    type: "local",
    baseDirectory: "gallery",
    priority: 1, // Higher priority (loaded first)
  },
  {
    type: "google-drive",
    folderId: "your-folder-id",
    cacheEnabled: true,
    priority: 2, // Lower priority (backup)
  },
]);

const images = await provider.getImages();
```

## Environment Variables

The image service automatically reads configuration from environment variables:

```env
# Required for all modes
IMAGE_SOURCE_TYPE=local|google-drive|hybrid

# Required for google-drive and hybrid modes
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
GOOGLE_DRIVE_FOLDER_ID=your-main-folder-id

# Optional: Specific folders for each collection
GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID=folder-id
GOOGLE_DRIVE_GALLERY_FOLDER_ID=folder-id
GOOGLE_DRIVE_THROWBACK_FOLDER_ID=folder-id
GOOGLE_DRIVE_PRENUP_FOLDER_ID=folder-id
```

## Code Examples

### Example 1: Using in a Server Component (Next.js)

```typescript
import { getGalleryImagesMetadata } from "@/services/imageService";

export default async function GalleryPage() {
  const images = await getGalleryImagesMetadata();

  return (
    <div>
      {images.map((image) => (
        <img
          key={image.id}
          src={image.url}
          alt={image.name}
          title={`Uploaded: ${image.createdAt}`}
        />
      ))}
    </div>
  );
}
```

### Example 2: Using in an API Route

```typescript
import { NextResponse } from "next/server";
import { getGalleryImagesMetadata } from "@/services/imageService";

export async function GET() {
  try {
    const images = await getGalleryImagesMetadata();
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
```

### Example 3: Creating a Custom Provider

```typescript
import { IImageProvider, ImageMetadata } from "@/types/imageProvider";

export class CustomProvider implements IImageProvider {
  async getImages(): Promise<ImageMetadata[]> {
    // Your implementation
    return [];
  }

  async getImagesFromDirectory(directory: string): Promise<ImageMetadata[]> {
    // Your implementation
    return [];
  }

  async isConfigured(): Promise<boolean> {
    return true;
  }

  async clearCache(): Promise<void> {
    // Optional implementation
  }
}
```

## Caching Strategy

### Google Drive Provider Caching

The Google Drive provider implements caching to improve performance:

- **Default cache duration**: 5 minutes
- **Cache key**: Based on folder ID and directory path
- **Cache invalidation**: Automatic after expiration
- **Manual clearing**: Use `clearImageCache()` or `provider.clearCache()`

```typescript
// Cache configuration
const provider = createGoogleDriveProvider({
  folderId: "your-folder-id",
  cacheEnabled: true,
  cacheDuration: 10 * 60 * 1000, // 10 minutes
});
```

### Cache Management

```typescript
// Clear all caches
import { clearImageCache } from "@/services/imageService";
await clearImageCache();

// Clear specific provider cache
const provider = createGoogleDriveProvider({ folderId: "..." });
await provider.clearCache();
```

## Error Handling

All provider methods return Promises and should be wrapped in try-catch:

```typescript
try {
  const images = await getGalleryImages();
  // Use images
} catch (error) {
  console.error("Failed to fetch images:", error);
  // Handle error (show fallback UI, etc.)
}
```

## Performance Considerations

### Local Provider
- ✅ Fast (filesystem access)
- ✅ No rate limits
- ✅ Works offline
- ❌ Requires deployment to update images

### Google Drive Provider
- ✅ Easy to update images (just upload to Drive)
- ✅ No deployment needed
- ⚠️ Slower (API calls)
- ⚠️ API rate limits apply
- ⚠️ Requires internet connection

### Hybrid Provider
- ✅ Best of both worlds
- ✅ Fast for local images
- ✅ Easy updates via Google Drive
- ⚠️ More complex configuration

## Testing

### Mock Providers for Testing

```typescript
const mockProvider: IImageProvider = {
  getImages: jest.fn().mockResolvedValue([]),
  getImagesFromDirectory: jest.fn().mockResolvedValue([]),
  isConfigured: jest.fn().mockResolvedValue(true),
  clearCache: jest.fn().mockResolvedValue(undefined),
};
```

## Migration Guide

### From Old API (Sync) to New API (Async)

Old code:
```typescript
export default function MyComponent() {
  const images = getGalleryImages();
  // ...
}
```

New code:
```typescript
export default async function MyComponent() {
  const images = await getGalleryImages();
  // ...
}
```

### From String URLs to Metadata

Old code:
```typescript
const images = await getGalleryImages();
// images: string[] = ["/images/gallery/1.jpg", ...]
```

New code:
```typescript
const images = await getGalleryImagesMetadata();
// images: ImageMetadata[] = [{ id: "...", url: "/images/gallery/1.jpg", ... }]
```

## Troubleshooting

### Common Issues

**Images not loading**
- Check `IMAGE_SOURCE_TYPE` environment variable
- Verify folder permissions (Google Drive)
- Check console for error messages
- Ensure service account has "Viewer" access

**Slow loading**
- Enable caching (default: enabled)
- Increase cache duration
- Consider hybrid mode with local fallback

**API rate limits**
- Reduce the number of API calls
- Increase cache duration
- Use local provider for development

**Cache not working**
- Verify `cacheEnabled: true` in config
- Check cache duration setting
- Clear and rebuild cache

## Future Enhancements

Potential future providers:
- AWS S3 Provider
- Azure Blob Storage Provider
- Cloudinary Provider
- Custom CDN Provider

## Contributing

When adding new providers:
1. Implement the `IImageProvider` interface
2. Add configuration types
3. Export from `/services/providers/index.ts`
4. Add tests
5. Update documentation
