# Google Drive Image Display Fix - March 7, 2026

## Problem

Google Drive images were not displaying on the website even though the image URLs worked when accessed directly in a browser.

### Root Cause

The Google Drive provider was generating URLs in the format:
```
https://drive.usercontent.google.com/download?id=FILE_ID&export=view&authuser=0
```

This URL format requires authentication with the service account credentials. When the browser tries to load these images directly using `<img src="...">` tags, it doesn't have the service account credentials, resulting in failed image loads.

## Solution

Implemented an **API proxy endpoint** that acts as a bridge between the browser and Google Drive:

1. **Browser** requests image from `/api/images/[fileId]`
2. **API endpoint** authenticates with Google Drive using service account
3. **API endpoint** fetches the image binary data
4. **API endpoint** streams the image to the browser with proper caching headers

### Architecture Diagram

```
┌─────────┐          ┌──────────────┐          ┌──────────────┐
│ Browser │  HTTP    │   Next.js    │   Auth   │ Google Drive │
│         ├─────────>│   API Route  ├─────────>│     API      │
│  <img>  │          │ /api/images/ │ Service  │              │
│         │<─────────┤   [fileId]   │<─────────┤   (Image)    │
└─────────┘  Binary  └──────────────┘  Account └──────────────┘
             Image                     Credentials
```

## Changes Made

### 1. Created API Route
**File**: [`src/app/api/images/[fileId]/route.ts`](../src/app/api/images/[fileId]/route.ts)

- New API endpoint to proxy Google Drive images
- Handles authentication with service account
- Returns image binary with proper MIME type
- Implements 7-day caching to reduce API calls
- Error handling for missing/inaccessible files

### 2. Updated Google Drive Provider
**File**: [`src/services/providers/googleDriveProvider.ts`](../src/services/providers/googleDriveProvider.ts)

Changed URL generation methods:
```typescript
// Before (doesn't work in browser):
private getImageUrl(fileId: string): string {
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=view&authuser=0`;
}

// After (works via proxy):
private getImageUrl(fileId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  return `${baseUrl}/api/images/${fileId}`;
}
```

### 3. Updated Environment Variables
**File**: [`.env.local.example`](../.env.local.example)

Added new variable:
```env
# Base URL of your application (used for API routes and image serving)
# Development: Leave empty or use http://localhost:3000
# Production: Set to your domain (e.g., https://yourwedding.com)
NEXT_PUBLIC_BASE_URL=
```

### 4. Created Documentation
- **[`documentation/API_ROUTES.md`](API_ROUTES.md)** - API endpoint documentation
- Updated **[`documentation/GOOGLE_DRIVE_SETUP.md`](GOOGLE_DRIVE_SETUP.md)** - Setup instructions
- Updated **[`documentation/KNOWN_ISSUES.md`](KNOWN_ISSUES.md)** - Documented fix

### 5. Created Test Script
**File**: [`scripts/test-google-drive-proxy.ts`](../scripts/test-google-drive-proxy.ts)

Test script to verify the proxy is working correctly.

## Benefits

### Security
- ✅ Files remain private to the service account
- ✅ No need to make files publicly accessible
- ✅ Access control via Google Drive permissions

### Performance
- ✅ 7-day browser caching reduces API calls
- ✅ Images cached at edge/CDN level (in production)
- ✅ Efficient binary streaming

### Reliability
- ✅ Proper error handling (404, 403, 500)
- ✅ Graceful degradation if API fails
- ✅ Works consistently across all browsers

## Usage

### Development

1. Set up environment variables in `.env.local`:
   ```env
   IMAGE_SOURCE_TYPE=google-drive
   GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   GOOGLE_DRIVE_FOLDER_ID=your-folder-id
   NEXT_PUBLIC_BASE_URL=  # Leave empty for development
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Images will automatically load via the proxy

### Production

1. Add environment variables to your hosting platform (Vercel, Netlify, etc.):
   ```env
   IMAGE_SOURCE_TYPE=google-drive
   GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   GOOGLE_DRIVE_FOLDER_ID=your-folder-id
   NEXT_PUBLIC_BASE_URL=https://yourwedding.com
   ```

2. Deploy and images will work automatically

## Testing

Run the test script to verify everything is configured correctly:

```bash
npx ts-node scripts/test-google-drive-proxy.ts
```

Or manually test:
1. Start dev server: `npm run dev`
2. Get a file ID from Google Drive
3. Visit: `http://localhost:3000/api/images/[FILE_ID]`
4. Image should display

## Caching Strategy

### Browser Caching
- **Duration**: 7 days
- **Type**: `public, max-age=604800, immutable`
- **Benefit**: Subsequent page loads don't require API calls

### Server-Side Caching
- **Duration**: 5 minutes (in GoogleDriveProvider)
- **Purpose**: Cache file metadata and list results
- **Benefit**: Reduces Google Drive API calls for folder listings

### Combined Effect
1. First page load: Fetches from Google Drive API
2. Same image within 5 minutes: Served from server cache
3. Same image after 5 minutes: Browser cache (7 days)
4. Total API calls: Minimal

## API Endpoints

### GET /api/images/[fileId]

Serves image from Google Drive.

**Parameters:**
- `fileId` (path) - Google Drive file ID

**Query params:**
- `thumbnail=true` - Request thumbnail version (optional)

**Response:**
- `200` - Image binary data
- `404` - Image not found
- `403` - Access denied
- `500` - Server error

**Example:**
```html
<img src="/api/images/1a2b3c4d5e6f" alt="Wedding photo" />
```

## Migration Guide

If you were previously trying to use Google Drive images and they weren't loading:

1. **Update your code** (if you customized anything):
   - No code changes needed if using standard `imageService`
   - Provider URLs are automatically updated

2. **Set environment variable**:
   ```env
   NEXT_PUBLIC_BASE_URL=  # Empty for dev, set to domain in production
   ```

3. **Restart server**:
   ```bash
   npm run dev
   ```

4. **Verify images load**:
   - Check browser DevTools Network tab
   - Images should load from `/api/images/[fileId]`
   - Status should be `200 OK`

## Troubleshooting

### Images still not loading

1. **Check console for errors**:
   - Open browser DevTools (F12)
   - Look for red errors in Console tab

2. **Verify environment variables**:
   ```bash
   # Check .env.local exists and has correct values
   cat .env.local | grep -E "(GOOGLE_SERVICE_ACCOUNT_KEY|IMAGE_SOURCE_TYPE)"
   ```

3. **Test API endpoint directly**:
   - Get a file ID from your Google Drive folder
   - Visit: `http://localhost:3000/api/images/[FILE_ID]`
   - Should show the image or an error message

4. **Check service account permissions**:
   - Verify service account email has "Viewer" access to folders
   - Run test script: `npx ts-node scripts/test-google-drive-proxy.ts`

### 503 Service Unavailable

- Service account credentials not configured
- Check `GOOGLE_SERVICE_ACCOUNT_KEY` in `.env.local`
- Verify JSON is properly formatted (single line, in quotes)

### 404 Not Found

- File ID doesn't exist or is incorrect
- File might be in trash
- Service account doesn't have access to the file

### 403 Forbidden

- Service account doesn't have "Viewer" permission
- Reshare the folder with the service account email

## Performance Considerations

### First Load
- Slightly slower (needs to fetch from Google Drive)
- Typical: 200-500ms per image

### Subsequent Loads
- Very fast (served from browser cache)
- Typical: < 10ms (cache hit)

### Optimization Tips
1. Use **hybrid mode** for critical images (local + Google Drive)
2. Keep high-priority images locally (`public/images`)
3. Use Google Drive for large galleries
4. Consider image optimization before uploading to Google Drive

## Security Considerations

### What's Secure
- ✅ Service account credentials never exposed to client
- ✅ Files remain private to service account
- ✅ No public sharing required
- ✅ Access control via Google Drive permissions

### What to Watch
- ⚠️ File IDs are visible in URLs (but that's expected)
- ⚠️ Anyone with a file ID can view that image
- ⚠️ Don't share file IDs publicly if images are sensitive

### Best Practices
1. Keep `.env.local` out of version control (already in `.gitignore`)
2. Rotate service account keys periodically
3. Use least-privilege permissions (Viewer only)
4. Monitor Google Drive API usage in Cloud Console

## Future Enhancements

Possible improvements for future versions:

1. **Image Optimization**
   - Resize images on-the-fly using Sharp
   - Generate WebP/AVIF versions automatically
   - Progressive JPEG loading

2. **Advanced Caching**
   - CDN integration for edge caching
   - Redis cache for high-traffic sites
   - Preload critical images

3. **Access Control**
   - Token-based image access
   - Time-limited URLs (signed URLs)
   - Guest-specific image permissions

4. **Monitoring**
   - API usage tracking
   - Performance metrics
   - Error alerting

## Related Documentation

- [API Routes Documentation](API_ROUTES.md)
- [Google Drive Setup Guide](GOOGLE_DRIVE_SETUP.md)
- [Image Sources Configuration](IMAGE_SOURCES.md)
- [Known Issues](KNOWN_ISSUES.md)

## Credits

- **Issue Identified**: March 7, 2026
- **Fix Implemented**: March 7, 2026
- **Solution**: API proxy pattern for authenticated resource access
