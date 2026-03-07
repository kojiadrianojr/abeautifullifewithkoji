# Google Drive Image Loading - Quick Fix Guide

## Problem
Images from Google Drive not loading on the website, showing broken image icons.

## Quick Solution

### Step 1: Update Environment Variables (if missing)

Add to your `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=
```

**Note**: Leave empty for development, set to your domain in production (e.g., `https://yourwedding.com`)

### Step 2: Restart Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 3: Verify Images Load

1. Open http://localhost:3000
2. Check if images appear in Hero section and Gallery
3. Open browser DevTools (F12) → Network tab
4. Images should load from `/api/images/[fileId]` endpoints
5. Status should be `200 OK`

## What Changed

The system now uses an **API proxy** to serve Google Drive images:

**Before** (didn't work):
```
Browser → https://drive.usercontent.google.com/... → ❌ Auth required
```

**After** (works):
```
Browser → /api/images/[fileId] → API authenticates → Google Drive → ✅ Image
```

## Testing

### Manual Test
1. Get a file ID from your Google Drive folder
2. Visit: `http://localhost:3000/api/images/[FILE_ID]`
3. You should see the image

### Script Test
```bash
npx ts-node scripts/test-google-drive-proxy.ts
```

## Troubleshooting

### Still seeing broken images?

**Check 1**: Environment variable exists
```bash
grep NEXT_PUBLIC_BASE_URL .env.local
```

**Check 2**: Server was restarted after adding the variable

**Check 3**: API endpoint works
- Open: http://localhost:3000/api/images/test-id
- Should show either an image or a JSON error (not 404 on the route itself)

**Check 4**: Service account permissions
```bash
grep GOOGLE_SERVICE_ACCOUNT_KEY .env.local
```

### Error: "Image service not configured"
- `GOOGLE_SERVICE_ACCOUNT_KEY` is missing or invalid
- Check the JSON format in `.env.local`

### Error: "Image not found" (404)
- File ID doesn't exist
- File is in trash
- Service account doesn't have access

### Error: "Access denied" (403)
- Service account needs "Viewer" permission
- Reshare Google Drive folder with service account email

## Technical Details

For a complete technical explanation, see:
- [GOOGLE_DRIVE_FIX.md](GOOGLE_DRIVE_FIX.md) - Complete fix documentation
- [API_ROUTES.md](API_ROUTES.md) - API endpoint details
- [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) - Setup guide

## Files Changed

- ✅ Created: `src/app/api/images/[fileId]/route.ts` - Image proxy API
- ✅ Updated: `src/services/providers/googleDriveProvider.ts` - URL generation
- ✅ Updated: `.env.local.example` - Added `NEXT_PUBLIC_BASE_URL`
- ✅ Updated: Documentation files

## Caching

Images are cached for **7 days** after first load:
- First visit: ~200-500ms (fetches from Google Drive)
- Subsequent visits: <10ms (browser cache)

This means:
- ✅ Fast loading after first visit
- ✅ Minimal API calls to Google Drive
- ✅ Better performance and lower costs

## Production Deployment

When deploying, remember to set:
```env
NEXT_PUBLIC_BASE_URL=https://yourwedding.com
```

Replace with your actual domain name.

---

**Issue Date**: March 7, 2026  
**Status**: ✅ Fixed  
**Impact**: All Google Drive images now load correctly
