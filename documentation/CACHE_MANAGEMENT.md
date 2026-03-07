# Clearing Image Cache

When you update images in Google Drive, the website may not immediately show the new images due to caching. Here are several ways to refresh the images:

## Method 1: Clear Cache via API (Recommended)

### Using curl
```bash
curl -X POST http://localhost:3000/api/cache/clear
```

### Using browser
Navigate to: `http://localhost:3000/api/cache/clear` and use a tool like Postman to send a POST request.

### Response
```json
{
  "success": true,
  "message": "Image cache cleared successfully",
  "timestamp": "2026-03-07T12:00:00.000Z"
}
```

## Method 2: Restart Development Server

1. Stop the server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

## Method 3: Disable Caching (Development)

Add to your `.env.local`:
```env
IMAGE_CACHE_ENABLED=false
```

This will always fetch fresh images but will be slower.

## Method 4: Reduce Cache Duration

Add to your `.env.local`:
```env
# Cache for 1 minute instead of 5
IMAGE_CACHE_DURATION=60000
```

Values in milliseconds:
- `60000` = 1 minute
- `120000` = 2 minutes  
- `300000` = 5 minutes (default)
- `600000` = 10 minutes

## Method 5: Wait for Cache to Expire

By default, the cache expires after 5 minutes. Just wait and the new images will appear automatically.

## For Production

### Option A: Create a Cache Clear Button

Add a button to your admin panel that calls the API:

```typescript
async function clearCache() {
  const response = await fetch('/api/cache/clear', {
    method: 'POST',
  });
  
  const data = await response.json();
  
  if (data.success) {
    alert('Cache cleared! Please refresh the page.');
    window.location.reload();
  }
}
```

### Option B: Add Authentication

Update `/api/cache/clear/route.ts` to require authentication:

1. Set a secret in `.env.local`:
   ```env
   CACHE_CLEAR_SECRET=your-secret-token
   ```

2. Uncomment the authentication code in the route

3. Call with authentication:
   ```bash
   curl -X POST http://localhost:3000/api/cache/clear \
     -H "Authorization: Bearer your-secret-token"
   ```

## Automatic Cache Clearing

Consider these approaches:

### 1. Time-based (Cron Job)
```bash
# Clear cache every hour
0 * * * * curl -X POST https://your-domain.com/api/cache/clear
```

### 2. Webhook-based
Set up a Google Drive webhook to notify when files change, then automatically clear the cache.

### 3. Manual Trigger
Create an admin interface where you can click a button to clear the cache after updating photos.

## Troubleshooting

### Cache not clearing?

1. Check if caching is enabled:
   ```bash
   curl http://localhost:3000/api/cache/clear
   ```

2. Verify environment variables are loaded:
   - Restart dev server after changing `.env.local`
   - Check console for any errors

3. Try a hard refresh in browser:
   - Chrome/Firefox: Ctrl + Shift + R (Cmd + Shift + R on Mac)
   - Safari: Cmd + Option + R

### Images still not updating?

1. Verify images are actually updated in Google Drive
2. Check folder permissions (service account has access)
3. Look for errors in console
4. Try the test script:
   ```bash
   npm run test-drive
   ```

## Best Practices

**Development:**
- Use short cache duration (1-2 minutes) or disable caching
- Clear cache manually when needed

**Staging:**
- Use moderate cache duration (5 minutes)
- Set up cache clear endpoint with authentication

**Production:**
- Use longer cache duration (10-15 minutes) for better performance
- Implement authenticated cache clear endpoint
- Consider adding a "Refresh Images" button in admin area
- Or use lower cache values if you update images frequently

## Cache Status

To check current cache configuration, send a GET request:
```bash
curl http://localhost:3000/api/cache/clear
```

Response:
```json
{
  "message": "Image cache API",
  "endpoints": {
    "POST": "/api/cache/clear - Clear image cache"
  },
  "cacheConfig": {
    "enabled": true,
    "duration": "5 minutes (default)"
  }
}
```
