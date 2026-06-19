# Copilot Instructions

## Project Overview

A wedding website for Koji & Bea built with Next.js 15 (App Router), TypeScript, Chakra UI, and Framer Motion. Deployed via Vercel (GitHub Actions) or Docker.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Runs prebuild (sync-images + optimize-images) then next build
npm run lint         # ESLint via next lint
npm run sync-images  # Manually sync images from Google Drive → public/images/
npm run test-drive   # Validate Google Drive configuration
npm run clear-cache  # Rebuild to refresh images
```

There are no tests in this project.

## Architecture

### Component organization

- `src/components/pages/` — full page sections (Hero, Gallery, Schedule, etc.)
- `src/components/ui/` — reusable primitives and skeletons
- `src/hooks/` — custom hooks
- `src/lib/googleDrive/` — build-time Google Drive API module
- `scripts/` — build-time scripts (sync-images, optimize-images, test-drive)

### Config-driven content

All wedding content lives in `config/wedding.json`. `ConfigService` is the single entry point.

Guest lists are in `config/guests/bea.json` and `config/guests/koji.json`, merged via `config/guests/index.ts`.

### Page structure

`src/app/page.tsx` is a server component that fetches images in parallel, then passes them to `HomeContent.tsx` (client component).

### Image system

**Build time:** `scripts/sync-images.ts` downloads from Google Drive when `IMAGE_SOURCE_TYPE=google-drive`.

**Runtime:** `imageService.ts` always reads from `public/images/` via `localProvider`.

Image collections: `hero-album`, `gallery`, `throwback`, `prenup`, `dress-code`.

### Service layer conventions

- Services in `src/services/index.ts` are safe for client and server imports
- `imageService.ts` is server-side only — import directly in server components, not from barrel

### RSVP

Guests search their name via `GuestService`, then open the Google Forms link from `config/wedding.json`. No Sheets API integration.

## Key Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_MAINTENANCE_MODE` | `true` to show maintenance page |
| `IMAGE_SOURCE_TYPE` | `local` (default) or `google-drive` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Service account JSON for build-time Drive sync |
| `GOOGLE_DRIVE_FOLDER_ID` | Parent Drive folder |

## Commit Message Format

```
Add: New feature
Fix: Bug description
Update: What was updated
Remove: What was removed
Docs: Documentation changes
Refactor: Code restructure (no functionality change)
```
