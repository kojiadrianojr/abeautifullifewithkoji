# Clearing Image Cache

> **Important:** This project is a **static site** (`output: 'export'` in `next.config.ts`).
> There is no API server at runtime. The image cache exists only in memory during a build
> or dev-server session. The recommended way to refresh images is to **rebuild the site**.

---

## Method 1: Rebuild the site (Recommended for production)

```bash
npm run clear-cache
```

This runs `npm run build`, which re-fetches all images from Google Drive and regenerates the static `out/` directory. Deploy the updated `out/` folder afterwards.

---

## Method 2: Restart the dev server

If you're running locally with `npm run dev`, the cache resets on server restart:

```bash
# Stop the server with Ctrl+C, then:
npm run dev
```

Or get instructions via:
```bash
npm run clear-cache -- --dev
```

---

## Method 3: Disable caching during development

Add to `.env.local` to always fetch fresh images (slower, but no stale cache):

```env
IMAGE_CACHE_ENABLED=false
```

Restart the dev server after changing `.env.local`.

---

## Method 4: Reduce cache duration

```env
# Cache for 1 minute instead of 5
IMAGE_CACHE_DURATION=60000
```

Values in milliseconds:
- `60000` = 1 minute
- `120000` = 2 minutes
- `300000` = 5 minutes (default)
- `600000` = 10 minutes

---

## Troubleshooting broken images

If images are broken (not just stale), the issue is usually permissions — not cache.

1. **Verify images exist in Google Drive** and haven't been moved or deleted
2. **Check folder permissions** — the service account must still have access
3. **Run the diagnostic script:**
   ```bash
   npm run test-drive
   ```
4. **Check the folder IDs** in `.env.local` match your current Google Drive folders

### Hard refresh in browser
- Chrome/Firefox: `Cmd + Shift + R` (Mac) / `Ctrl + Shift + R` (Windows)
- Safari: `Cmd + Option + R`

---

## Best Practices

| Environment | Recommendation |
|---|---|
| Development | Set `IMAGE_CACHE_ENABLED=false` or use a 1-minute duration |
| Production | Run `npm run build` (= `npm run clear-cache`) after updating Drive images |
