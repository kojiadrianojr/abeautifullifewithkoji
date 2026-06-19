# Cache Management

## Overview

Images are served from `public/images/` at runtime. There is no runtime image cache — caching happens at the **build/CI level**.

## CI Build Cache

`.github/workflows/deploy.yml` caches `public/images/` weekly:

```yaml
- name: Cache public images
  uses: actions/cache@v4
  with:
    path: public/images
    key: ${{ runner.os }}-images-${{ steps.date.outputs.week }}
```

This means `sync-images.ts` skips re-downloading unchanged Drive files between commits in the same week.

## Refreshing Images

### After adding photos to Google Drive

```bash
npm run sync-images    # Manual sync
# or
npm run build          # Full rebuild (sync runs in prebuild)
```

### In CI

Push a commit — the weekly cache restores existing images, and sync only downloads changes.

### Clear and rebuild

```bash
npm run clear-cache    # Triggers a full rebuild
```

For development, restart the dev server after syncing:
```bash
npm run clear-cache -- --dev
```

## Local Development

After running `sync-images`, restart `npm run dev` if images don't appear (Next.js may cache static assets during a session).

## Related Docs

- [IMAGE_SOURCES.md](IMAGE_SOURCES.md)
- [GOOGLE_DRIVE_IMPLEMENTATION.md](GOOGLE_DRIVE_IMPLEMENTATION.md)
