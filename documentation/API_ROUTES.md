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

## Guest Search API

### `POST /api/guests/search`

Searches the private guest list server-side and returns only the matching guests. The full guest list is never sent to the browser — it is loaded server-only from `config/guests/*.json` (gitignored, injected at build via CI secrets).

**Request Body (JSON):**
```json
{ "query": "Maria Beatriz" }
```

**Validation:**
- `query` is required and must be a string
- Minimum length: 3 characters (after trimming)
- Maximum length: 80 characters

**Matching:**
- Typo-tolerant fuzzy match (Levenshtein distance) across `fullName`, `groupName`, and `members`
- Edit-distance tolerance scales with query length (stricter for short queries)
- Token-subset matching: each word of a multi-word query must match a word in the name (order-independent), so partial names with omitted middle names/initials still match (e.g. "Klyde Rayel" matches "Klyde Reinier J. Rayel")
- Results are ranked by closeness and capped (max 6) to limit enumeration

**Anti-data-mining:**
- Broad/vague queries that match more guests than the cap return no names and set `tooBroad: true`, prompting the guest to enter their full name. This prevents harvesting the guest list with common name fragments.

**Response (200):**
```json
{
  "guests": [
    { "id": "1", "fullName": "Maria Beatriz", "allowedSeats": 1 }
  ],
  "tooBroad": false
}
```

When the query is too broad, `guests` is empty and `tooBroad` is `true`:
```json
{ "guests": [], "tooBroad": true }
```

**Response Codes:**
- `200` - Success (`guests` may be an empty array; check `tooBroad`)
- `400` - Missing/invalid query, or below the minimum length
- `429` - Rate limited (too many requests)

**Security:**
- Guest data is server-only; it is not bundled into client JavaScript
- Responses send `Cache-Control: no-store` (also enforced in `vercel.json`)
- Best-effort in-memory per-IP rate limiting (per serverless instance): two windows — 12 requests/minute (burst protection) and 60 requests/hour (slow-enumeration protection). For durable limiting across instances, back it with an external store (e.g. Upstash Redis)

**Notes:**
- Requires a server runtime (Vercel or Docker). A static export / GitHub Pages deployment cannot host this route.

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
