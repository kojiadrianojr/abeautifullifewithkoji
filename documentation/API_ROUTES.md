# API Routes Documentation

This document describes the API routes available in the wedding website application.

## Image Proxy API

### `GET /api/images/[fileId]`

Serves images from Google Drive via a proxy endpoint. This is necessary when using Google Drive as an image source because the service account authentication cannot be used directly in the browser.

**Parameters:**
- `fileId` (path parameter) - The Google Drive file ID

**Query Parameters:**
- `thumbnail` (optional) - Set to `"true"` to request a thumbnail version

**Headers:**
- `Content-Type` - MIME type of the image (e.g., `image/jpeg`)
- `Cache-Control` - Set to `public, max-age=604800, immutable` (7 days)
- `Content-Length` - Size of the image in bytes
- `X-Content-Type-Options` - Set to `nosniff` for security

**Response Codes:**
- `200` - Success, returns the image binary data
- `400` - Invalid file ID
- `403` - Access denied to the image
- `404` - Image not found
- `500` - Server error
- `503` - Service not configured (missing credentials)

**Example Usage:**
```html
<img src="/api/images/1a2b3c4d5e6f7g8h9i" alt="Wedding photo" />
<img src="/api/images/1a2b3c4d5e6f7g8h9i?thumbnail=true" alt="Thumbnail" />
```

**How It Works:**

1. When a request comes in, the API route extracts the Google Drive file ID
2. It authenticates with Google Drive using the service account credentials
3. It fetches the file metadata and content from Google Drive
4. It streams the image back to the client with appropriate caching headers
5. The browser caches the image for 7 days to minimize API calls

**Configuration:**

This endpoint requires:
- `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable with valid service account JSON
- The service account must have "Viewer" access to the Google Drive files
- `NEXT_PUBLIC_BASE_URL` environment variable (optional in development, required in production)

**Security:**

- Only images accessible to the service account can be served
- File IDs must be known (no directory listing)
- Response includes security headers to prevent MIME type sniffing
- Images are cached at the edge/browser level to reduce API calls

---

## Cache Management API

### `GET /api/cache/clear`

Clears the server-side image cache. Useful when images have been updated in Google Drive and you want to force a refresh.

**Response Codes:**
- `200` - Cache cleared successfully

**Example Usage:**
```javascript
fetch('/api/cache/clear')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Future API Routes

Additional API routes may be added for:
- RSVP submission (if not using Google Forms)
- Guest authentication
- Image upload/management
- Admin dashboard functions
