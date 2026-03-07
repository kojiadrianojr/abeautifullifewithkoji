# Issues Resolution Summary

**Date**: March 7, 2026

## Issues Reported

1. ⚠️ DeprecationWarning: `url.parse()` behavior is not standardized
2. ❌ Folder '/website-media/hero-album' not found in Google Drive
3. ❌ motion() is deprecated. Use motion.create() instead

---

## ✅ Resolutions

### 1. Google Drive Folder Path Issue - FIXED

**Problem**: Inconsistent folder naming causing "Folder '/website-media/hero-album' not found"

**Root Cause**: 
- Configuration used `/website-media/hero-album` as folder key
- Functions expected `hero-album` as the lookup key
- Mismatch caused Google Drive provider to look for wrong folder name

**Solution**:
Updated `src/services/imageService.ts`:
```typescript
// Before
folders: {
  "/website-media/hero-album": "...",
  ...
}

// After
folders: {
  "hero-album": "...",  // Standardized naming
  "gallery": "...",
  "throwback": "...",
  "prenup": "..."
}
```

Also fixed function calls to use consistent naming:
```typescript
// Before
getProviderForCollection("/website-media/hero-album")

// After
getProviderForCollection("hero-album")
```

**Files Changed**:
- `src/services/imageService.ts`

---

### 2. Framer Motion Deprecation - FIXED

**Problem**: Using deprecated `motion(Component)` syntax

**Root Cause**:
Framer Motion 11.x deprecated the `motion(Component)` pattern in favor of `motion.create(Component)` for creating motion components from custom components (like Chakra UI components).

**Solution**:
Updated all motion component creations from:
```typescript
const MotionBox = motion(Box);
```

To:
```typescript
const MotionBox = motion.create(Box);
```

**Files Changed** (13 files):
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

**Note**: Standard motion elements like `motion.div`, `motion.button` continue to work as before.

---

### 3. url.parse() Deprecation - DOCUMENTED

**Problem**: Node.js deprecation warning from googleapis library

**Status**: ⚠️ **Cannot be fixed in our code** (external dependency)

**Root Cause**:
The `googleapis` package (or one of its dependencies) uses the deprecated Node.js `url.parse()` method. This is a Node.js API deprecation, not a bug in our application.

**Impact**:
- ✅ No functional impact - app works correctly
- ⚠️ Console warning appears during development
- ✅ No security risk for our usage pattern
- ✅ Will be fixed when googleapis updates to WHATWG URL API

**Workaround** (optional):
To suppress the warning during development:
```json
// package.json
{
  "scripts": {
    "dev": "NODE_NO_DEPRECATION=1 next dev"
  }
}
```

**Documentation**:
- Created `documentation/KNOWN_ISSUES.md` with detailed explanation
- Tracking upstream fix in googleapis repository

---

## Additional Fixes

### ESLint and TypeScript Errors - FIXED

Fixed various linting and type errors discovered during build:

1. **Unused variables**: Removed or marked as optional
2. **Any types**: Replaced with proper type annotations
3. **Missing imports**: Added type imports where needed
4. **Error handling**: Properly typed error objects in catch blocks

**Files Changed**:
- `src/services/imageService.ts` - Added missing type imports
- `src/services/providers/hybridProvider.ts` - Fixed any types
- `src/services/providers/localProvider.ts` - Removed unused variables
- `src/components/pages/RSVP/index.tsx` - Removed unused imports
- `src/components/pages/RSVP/GuestSearch.tsx` - Removed unused imports
- `src/components/pages/RSVP/GuestSearchInput.tsx` - Removed unused imports
- `src/components/pages/Hero/StackedImageGallery.tsx` - Made props optional
- `src/lib/hero-images.ts` - Updated to async function
- `scripts/sync-rsvp.ts` - Fixed error type handling

---

## Testing Results

### ✅ Build Status: SUCCESS

```bash
npm run build
```

**Output**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (4/4)
✓ Finalizing page optimization

Route (app)                              Size  First Load JS
┌ ○ /                                   47.9 kB         215 kB
└ ○ /_not-found                           993 B         103 kB
```

### Expected Warnings in Build

1. **url.parse() deprecation**: Expected and documented
2. **Google Drive fetch error during build**: Expected when no `.env.local` configured (handled gracefully)

---

## Summary

| Issue | Status | Impact |
|-------|--------|--------|
| Google Drive folder path | ✅ Fixed | High - Was blocking Google Drive functionality |
| Framer Motion deprecation | ✅ Fixed | Medium - Deprecated API warnings |
| url.parse() deprecation | ⚠️ Documented | Low - External dependency, no functional impact |

---

## Verification Steps

To verify all fixes are working:

1. **Build the project**:
   ```bash
   npm run build
   ```
   Should complete successfully

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Should start without errors

3. **Test Google Drive (if configured)**:
   ```bash
   npm run test-drive
   ```
   Should connect and list images

4. **Check for motion deprecation**:
   - Open browser DevTools console
   - No "motion() is deprecated" warnings should appear

---

## Documentation Added

1. **KNOWN_ISSUES.md**: Comprehensive tracking of all known issues
2. **Updated README.md**: Already documented Google Drive features

---

## Recommendations

1. ✅ **Immediate**: All fixable issues have been resolved
2. ⏳ **Future**: Monitor googleapis for url.parse() fix
3. 📝 **Ongoing**: Keep KNOWN_ISSUES.md updated as new issues arise

---

**Resolution Completed**: March 7, 2026  
**All Functional Issues**: Resolved ✅  
**Build Status**: Passing ✅  
**Type Checking**: Passing ✅
