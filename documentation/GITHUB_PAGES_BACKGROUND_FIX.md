# GitHub Pages Background/Wallpaper Fix

## Problem
Background images (wallpaper) were disappearing when the website was deployed to GitHub Pages, even though they worked fine in development.

## Root Cause
When deploying to GitHub Pages with a repository URL like `username.github.io/website`, Next.js uses a `basePath` of `/website`. This means all assets need to be prefixed with `/website` in production.

CSS background images using paths like `/images/hero-bg.jpg` would fail because they weren't being prefixed with the basePath automatically.

## Solution

### 1. Created Asset Path Utility
Created `/src/lib/asset-path.ts` with a `getAssetPath()` function that:
- Returns `/images/...` in development
- Returns `/website/images/...` in production (when basePath is configured)

### 2. Updated Background Image Components
Modified the following components to use `getAssetPath()`:
- `/src/components/sections/Hero/HeroBackground.tsx`
- `/src/components/pages/Hero/HeroBackground.tsx`

### 3. Made basePath Configurable
Updated `/next.config.ts` to read `NEXT_PUBLIC_BASE_PATH` from environment variables, making it easier to deploy to different environments.

### 4. Updated GitHub Actions Workflow
Modified `.github/workflows/deploy.yml` to set `NEXT_PUBLIC_BASE_PATH=/website` during the build process.

### 5. Updated Environment Documentation
Added `NEXT_PUBLIC_BASE_PATH` to `.env.example` for reference.

## Testing

### Local Development
```bash
npm run dev
```
Background images should work at http://localhost:3000

### Production Build Test
```bash
NEXT_PUBLIC_BASE_PATH=/website npm run build
npm run start
```
Background images should work with the `/website` prefix

### GitHub Pages
After pushing to GitHub, the workflow will automatically build and deploy with the correct basePath.

## Notes

- **Next.js Image Component**: The `<Image>` component from `next/image` automatically handles basePath, so it doesn't need the utility function.
- **CSS Background Images**: Must use the `getAssetPath()` utility for proper path handling.
- **Inline Styles**: Any inline styles with `backgroundImage` should use `getAssetPath()`.
- **Custom Domains**: For custom domains (e.g., `yourwedding.com`), leave `NEXT_PUBLIC_BASE_PATH` empty or unset.
- **Subdirectory Deployment**: For subdirectory deployment (e.g., `username.github.io/website`), set `NEXT_PUBLIC_BASE_PATH=/website`.

⚠️ **IMPORTANT**: The `getAssetPath()` function no longer has a hardcoded fallback. Always explicitly set or leave empty `NEXT_PUBLIC_BASE_PATH` based on your deployment type.

## Fix Applied (March 2026)

**Issue**: Assets not loading on custom domains due to hardcoded basePath fallback

**Solution**: Removed the hardcoded fallback `/abeautifullifewithkoji` from `getAssetPath()` function. Now defaults to empty string, making custom domain deployments work correctly.

**Before**:
```typescript
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/abeautifullifewithkoji'; // ❌ Wrong for custom domains
```

**After**:
```typescript
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; // ✅ Correct for custom domains
```

📖 **See**: [Custom Domain Setup Guide](CUSTOM_DOMAIN_SETUP.md) for detailed configuration instructions.

## Related Files
- `/src/lib/asset-path.ts` - The utility function
- `/next.config.ts` - basePath configuration
- `.github/workflows/deploy.yml` - Build environment configuration
- `.env.example` - Environment variable documentation
