# Asset Loading Issue - Visual Explanation

## The Problem

```
┌─────────────────────────────────────────────────────────────┐
│  Custom Domain: abeautifullifewithkoji.arkea.tech          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Browser requests assets
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  OLD CODE (BROKEN):                                         │
│                                                              │
│  getAssetPath('/images/hero-bg.jpg')                       │
│  → basePath = NEXT_PUBLIC_BASE_PATH || '/abeautifullifewithkoji'  │
│  → Result: '/abeautifullifewithkoji/images/hero-bg.jpg'    │
│                                                              │
│  Final URL:                                                 │
│  https://abeautifullifewithkoji.arkea.tech/abeautifullifewithkoji/images/hero-bg.jpg  │
│                                                              │
│  Status: 404 NOT FOUND ❌                                   │
└─────────────────────────────────────────────────────────────┘

                            vs

┌─────────────────────────────────────────────────────────────┐
│  NEW CODE (FIXED):                                          │
│                                                              │
│  getAssetPath('/images/hero-bg.jpg')                       │
│  → basePath = NEXT_PUBLIC_BASE_PATH || ''  (empty!)        │
│  → Result: '/images/hero-bg.jpg'                           │
│                                                              │
│  Final URL:                                                 │
│  https://abeautifullifewithkoji.arkea.tech/images/hero-bg.jpg  │
│                                                              │
│  Status: 200 OK ✅                                          │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Types

### Type 1: Custom Domain (Your Case)

```
┌──────────────────────────────────────────────────┐
│  Configuration:                                   │
│  • Custom Domain: yourwedding.com                 │
│  • NEXT_PUBLIC_BASE_PATH: '' (EMPTY!)            │
│  • CNAME file: yourwedding.com                    │
└──────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│  Asset URL Structure:                             │
│  • yourwedding.com/                              │
│    ├── images/hero-bg.jpg                        │
│    ├── images/gallery/photo1.jpg                 │
│    └── _next/static/...                          │
└──────────────────────────────────────────────────┘
```

### Type 2: Subdirectory Deployment

```
┌──────────────────────────────────────────────────┐
│  Configuration:                                   │
│  • URL: username.github.io/wedding               │
│  • NEXT_PUBLIC_BASE_PATH: '/wedding'            │
│  • CNAME file: (deleted)                         │
└──────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│  Asset URL Structure:                             │
│  • username.github.io/wedding/                   │
│    ├── images/hero-bg.jpg                        │
│    ├── images/gallery/photo1.jpg                 │
│    └── _next/static/...                          │
└──────────────────────────────────────────────────┘
```

## Code Changes

### Before (Broken for Custom Domains)

```typescript
// src/lib/asset-path.ts
export function getAssetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (process.env.NODE_ENV === 'production') {
    // ❌ PROBLEM: Hardcoded fallback always adds basePath
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/abeautifullifewithkoji';
    return `${basePath}/${cleanPath}`;
  }
  
  return `/${cleanPath}`;
}
```

**Issue**: Even with custom domain, it would prepend `/abeautifullifewithkoji`

### After (Works for Both)

```typescript
// src/lib/asset-path.ts
export function getAssetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // ✅ FIXED: Defaults to empty string for custom domains
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Only prepend basePath if it's actually set
  if (basePath) {
    return `${basePath}/${cleanPath}`;
  }
  
  return `/${cleanPath}`;
}
```

**Fix**: Only prepends basePath when explicitly set (subdirectory deployment)

## Flow Diagram

```
┌─────────────────────┐
│  Website Loads      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Check basePath?    │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│ Empty   │  │ Set to  │
│ basePath│  │ /repo   │
└────┬────┘  └────┬────┘
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│ Custom  │  │ Subdirectory │
│ Domain  │  │ Deployment   │
└────┬────┘  └────┬────┘
     │           │
     ▼           ▼
┌─────────┐  ┌──────────┐
│ Assets  │  │ Assets   │
│ at /    │  │ at /repo │
└─────────┘  └──────────┘
```

## Testing Matrix

| Scenario | NEXT_PUBLIC_BASE_PATH | Input | Output | Works? |
|----------|----------------------|-------|--------|--------|
| Custom Domain Dev | `''` | `/images/hero.jpg` | `/images/hero.jpg` | ✅ |
| Custom Domain Prod | `''` | `/images/hero.jpg` | `/images/hero.jpg` | ✅ |
| Subdirectory Dev | `'/wedding'` | `/images/hero.jpg` | `/wedding/images/hero.jpg` | ✅ |
| Subdirectory Prod | `'/wedding'` | `/images/hero.jpg` | `/wedding/images/hero.jpg` | ✅ |
| OLD Custom Domain | `undefined` (falls back to `/abeautifullifewithkoji`) | `/images/hero.jpg` | `/abeautifullifewithkoji/images/hero.jpg` | ❌ |

## Quick Decision Tree

```
Are you using a custom domain?
│
├─ YES → Leave NEXT_PUBLIC_BASE_PATH empty
│         Remove NEXT_PUBLIC_BASE_PATH secret or set to ''
│         Keep CNAME file
│
└─ NO  → Are you using username.github.io/repo-name?
          │
          └─ YES → Set NEXT_PUBLIC_BASE_PATH=/repo-name
                    Delete CNAME file
```

## Real-World Example

**Your Current Setup:**

```yaml
Domain: abeautifullifewithkoji.arkea.tech
CNAME: ✅ Exists
Current NEXT_PUBLIC_BASE_PATH: '/abeautifullifewithkoji' ❌ WRONG
Should be: '' (empty) ✅ CORRECT
```

**What happens with current (wrong) setup:**

```
Browser: "Please give me the hero background image"
Server: "Sure, it's at /abeautifullifewithkoji/images/hero-bg.jpg"
Browser: "Trying https://abeautifullifewithkoji.arkea.tech/abeautifullifewithkoji/images/hero-bg.jpg"
Server: "404 Not Found - That path doesn't exist!"
Result: 🖼️ → ❌ (Image broken)
```

**What happens with fixed setup:**

```
Browser: "Please give me the hero background image"
Server: "Sure, it's at /images/hero-bg.jpg"
Browser: "Trying https://abeautifullifewithkoji.arkea.tech/images/hero-bg.jpg"
Server: "200 OK - Here's your image!"
Result: 🖼️ → ✅ (Image loads perfectly)
```

## Action Items

- [ ] Update `NEXT_PUBLIC_BASE_PATH` GitHub Secret to empty string
- [ ] Trigger manual redeployment via GitHub Actions
- [ ] Clear browser cache and verify assets load
- [ ] Check DevTools Network tab for 200 OK responses

---

**Time to Fix**: ~5 minutes  
**Difficulty**: ⭐ Easy  
**Impact**: 🎯 Critical (fixes all asset loading issues)
