# Scripts Directory

This directory contains utility scripts for the wedding website.

## Available Scripts

### sync-rsvp.ts

Syncs RSVP responses from Google Forms/Sheets to the local guest list.

**Usage:**
```bash
npm run sync-rsvp
```

**Prerequisites:**
- Set up Google Forms integration (see `documentation/GOOGLE_FORMS_SETUP.md`)
- Configure `.env.local` with Google credentials
- Have guest list in `config/guests.json`

**What it does:**
- Fetches RSVP responses from Google Sheets
- Matches responses to guests in your guest list
- Updates guest RSVP status and details
- Creates backup before updating
- Shows statistics after syncing

### test-google-drive.ts

Tests Google Drive image provider configuration and lists available images.

**Usage:**
```bash
npm run test-drive
```

**Prerequisites:**
- Set up Google Drive integration (see `documentation/GOOGLE_DRIVE_SETUP.md`)
- Configure `.env.local` with Google Drive credentials
- Share folders with service account

**What it does:**
- Validates Google Drive credentials
- Tests connection to each image folder
- Lists number of images found in each collection
- Shows sample filenames
- Provides troubleshooting guidance

**Output example:**
```
🧪 Testing Google Drive Image Provider
============================================================
✅ Environment variables found

📂 Testing "hero-album" collection...
   Folder ID: 1a2b3c4d5e6f...
   ✅ Found 12 image(s)
   First few: photo1.jpg, photo2.jpg, photo3.jpg

...

📊 TEST SUMMARY
✅ Successful: 4
❌ Failed: 0
📸 Total images found: 48

🎉 All tests passed! Your Google Drive setup is working correctly.
```

### clear-cache.js

Clears the Next.js build cache and public images cache.

**Usage:**
```bash
npm run clear-cache
```

**What it does:**
- Removes `.next` directory (Next.js build cache)
- Clears cached images from `public/images/cache/`
- Helps resolve issues with stale builds or cached images
- Useful when switching between image providers or updating configuration

**When to use:**
- After changing environment variables
- When switching from local images to Google Drive (or vice versa)
- If images aren't updating after making changes
- Before creating a fresh production build

## Creating New Scripts

When adding new utility scripts:

1. **Create TypeScript file** in this directory
2. **Add shebang**: `#!/usr/bin/env tsx`
3. **Import dotenv** if using environment variables:
   ```typescript
   import { config } from "dotenv";
   config({ path: ".env.local" });
   ```
4. **Add error handling**:
   ```typescript
   process.on('unhandledRejection', (error) => {
     console.error('Error:', error);
     process.exit(1);
   });
   ```
5. **Add npm script** in `package.json`:
   ```json
   {
     "scripts": {
       "your-script": "tsx scripts/your-script.ts"
     }
   }
   ```
6. **Document** in this README

## Common Patterns

### Loading Environment Variables
```typescript
import { config } from "dotenv";
config({ path: ".env.local" });

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("❌ API_KEY not found");
  process.exit(1);
}
```

### Reading Config Files
```typescript
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "config", "guests.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
```

### Writing Files Safely
```typescript
import fs from "fs";

// Create backup first
const backupPath = `${filePath}.backup`;
if (fs.existsSync(filePath)) {
  fs.copyFileSync(filePath, backupPath);
}

// Write new content
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
```

### Progress Indicators
```typescript
console.log("⏳ Processing...");
// Do work
console.log("✅ Done!");
```

## Troubleshooting

### "Cannot find module" errors

Make sure dependencies are installed:
```bash
npm install
```

### Permission denied

Make scripts executable:
```bash
chmod +x scripts/*.ts
```

### Environment variable not found

1. Check `.env.local` exists in root directory
2. Verify variable names are correct
3. Restart the script after changing `.env.local`

### TypeScript errors

Check `tsconfig.json` includes scripts directory:
```json
{
  "include": ["scripts/**/*"]
}
```

## Dependencies

Scripts use these packages:
- `tsx` - TypeScript execution (dev dependency)
- `dotenv` - Environment variable loading
- `googleapis` - Google APIs (for sync-rsvp and test-drive)
- Built-in Node.js modules (`fs`, `path`, etc.)
