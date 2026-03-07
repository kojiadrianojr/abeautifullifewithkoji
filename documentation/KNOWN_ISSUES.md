# Known Issues and Warnings

This document tracks known issues, deprecation warnings, and their status.

## Current Warnings

### 1. DeprecationWarning: `url.parse()` (Node.js)

**Status**: External dependency issue - Cannot fix directly

**Warning Message**:
```
DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors 
that have security implications. Use the WHATWG URL API instead. CVEs are not issued 
for `url.parse()` vulnerabilities.
```

**Source**: This warning comes from the `googleapis` package or its dependencies, not from our application code.

**Impact**: 
- No functional impact on the application
- Node.js deprecation warning (will display in console)
- Does not affect runtime behavior

**Resolution Options**:

1. **Wait for upstream fix** (Recommended):
   - The `googleapis` package maintainers need to update their code
   - This is a known issue tracked in the googleapis repository
   - Future versions will migrate to WHATWG URL API

2. **Suppress the warning** (Development only):
   ```bash
   # Add to package.json scripts
   "dev": "NODE_NO_DEPRECATION=1 next dev"
   ```
   
   **Note**: This only hides the warning, doesn't fix the underlying issue.

3. **Use an alternative authentication method**:
   - If not using Google Drive/Forms integration, remove `googleapis` dependency
   - For production, consider using OAuth2 instead of service accounts

**Tracking**:
- Issue opened: https://github.com/googleapis/google-api-nodejs-client/issues
- Expected fix: When googleapis updates to use WHATWG URL API
- Last checked: March 2026

**Security Note**:
While the warning mentions security implications, using `googleapis` with service accounts is still considered secure for our use case. The deprecation is about Node.js API modernization, not a critical vulnerability in googleapis itself.

---

## Fixed Issues

### ✅ Google Drive Images Not Displaying in Browser (Fixed: March 7, 2026)

**Issue**: Images from Google Drive fail to load on the website, even though the Google Drive URLs work when accessed directly.

**Cause**: 
- Google Drive API URLs require authentication with the service account
- Browsers cannot directly access these authenticated URLs
- The format `drive.usercontent.google.com/download?id=...&export=view` requires credentials

**Fix**: Implemented an API proxy endpoint at `/api/images/[fileId]`
- The API route authenticates with Google Drive using service account credentials
- Fetches the image and streams it to the client
- Adds proper caching headers (7 days) to minimize API calls
- Works seamlessly with the browser's image loading

**Changes Made**:
1. Created `/src/app/api/images/[fileId]/route.ts` - Image proxy endpoint
2. Updated `googleDriveProvider.ts` - Changed URL generation to use the proxy
3. Added `NEXT_PUBLIC_BASE_URL` to `.env.local.example`
4. Created `documentation/API_ROUTES.md` - API documentation

**How It Works**:
```
Browser → /api/images/[fileId] → Service Account Auth → Google Drive → Image Binary → Browser
```

**No public sharing required**: Files remain private to the service account.

---

### ✅ Google Drive Folder Path Mismatch (Fixed: March 7, 2026)

**Issue**: Folder '/website-media/hero-album' not found in Google Drive

**Cause**: Inconsistent folder naming between configuration and function calls
- Config used: `/website-media/hero-album`
- Expected: `hero-album`

**Fix**: Updated `imageService.ts` to use consistent naming:
```typescript
folders: {
  "hero-album": "...",    // Was: "/website-media/hero-album"
  "gallery": "...",
  "throwback": "...",
  "prenup": "..."
}
```

**Files Changed**:
- `src/services/imageService.ts`

---

### ✅ Framer Motion Deprecation (Fixed: March 7, 2026)

**Issue**: `motion() is deprecated. Use motion.create() instead.`

**Cause**: Using old framer-motion API for creating motion components from Chakra UI components

**Fix**: Updated all components to use `motion.create()`:
```typescript
// Before
const MotionBox = motion(Box);

// After
const MotionBox = motion.create(Box);
```

**Files Changed**:
- `src/components/ui/AnimatedIconButton.tsx`
- `src/components/ui/AnimatedButton.tsx`
- `src/components/ui/animations/FadeIn.tsx`
- `src/components/ui/animations/ScaleIn.tsx`
- `src/components/ui/ImageCard.tsx`
- `src/components/Navigation/BackToTopButton.tsx`
- `src/components/Navigation.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/Hero/HeroImage.tsx`
- `src/components/sections/Hero/CountdownSection.tsx`
- `src/components/sections/Hero/HeroContent.tsx`
- `src/components/SplashScreen/index.tsx`
- `src/components/pages/Hero/StackedImageGallery.tsx`

**Note**: Standard motion components (`motion.div`, `motion.button`, etc.) continue to work and do not require changes.

---

## Monitoring

To monitor for new warnings:

```bash
# Show all warnings with stack traces
npm run dev -- --trace-deprecation

# Or start with:
node --trace-deprecation node_modules/.bin/next dev
```

## Reporting Issues

If you encounter new warnings or errors:

1. Check this document first to see if it's a known issue
2. Check the terminal output for stack traces
3. Search for the error in the project's GitHub issues
4. If new, create an issue with:
   - Full error message
   - Stack trace (use `--trace-deprecation`)
   - Steps to reproduce
   - Environment details (Node version, OS, etc.)

## Updates

This document is updated whenever:
- New warnings are discovered
- Upstream fixes are released
- Workarounds are found
- Issues are resolved

**Last Updated**: March 7, 2026
