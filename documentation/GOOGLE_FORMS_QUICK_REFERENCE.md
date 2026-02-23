# Google Forms RSVP Integration - Quick Reference

## Quick Setup (5 Minutes)

### 1. Create Google Form
- Create form at [forms.google.com](https://forms.google.com)
- Add fields: Name, Attendance (Yes/No), Guest Count, Dietary Restrictions
- Connect to Google Sheets (Responses tab → Sheets icon)

### 2. Setup Google Cloud
```bash
# Create project at console.cloud.google.com
# Enable Google Sheets API
# Create Service Account
# Download JSON key
```

### 3. Share Spreadsheet
- Share with service account email: `your-account@project.iam.gserviceaccount.com`
- Give "Viewer" access

### 4. Configure Environment
Create `.env.local`:
```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{ ...your JSON key... }'
GOOGLE_FORMS_SPREADSHEET_ID=your-spreadsheet-id
```

### 5. Install & Run
```bash
npm install
npm run sync-rsvp
```

## Commands

```bash
# Sync RSVP responses (uses spreadsheet ID from .env.local)
npm run sync-rsvp

# Sync with specific spreadsheet ID
npm run sync-rsvp 1AbC2DeF3GhI4JkL

# Run development server
npm run dev
```

## Guest Data Fields

After sync, guests have:
- `rsvpStatus`: "confirmed" | "declined" | "pending"
- `rsvpCount`: Number of attending guests
- `rsvpDate`: When they responded
- `dietaryRestrictions`: Any dietary needs
- `notes`: Additional comments

## Common Issues

### ❌ GOOGLE_SERVICE_ACCOUNT_KEY not set
→ Create `.env.local` with service account JSON

### ❌ Failed to fetch responses
→ Share spreadsheet with service account email

### ⚠️ Responses not matching
→ Check name spelling matches `guests.json`

### ℹ️ No responses found
→ Verify responses exist in Google Sheets

## API Usage

```typescript
import { GuestService } from '@/services';

// Get confirmed guests
const confirmed = GuestService.getConfirmedGuests();

// Get statistics
const stats = GuestService.getRsvpStats();
// { totalGuests: 25, confirmed: 10, declined: 2, pending: 13, ... }

// Check if specific guest responded
const hasResponded = GuestService.hasResponded('guest-id');
```

## File Locations

- **Service**: `src/services/googleFormsService.ts`
- **Script**: `scripts/sync-rsvp.js`
- **Guest Data**: `config/guests.json`
- **Backups**: `config/guests.backup.*.json`
- **Docs**: `documentation/GOOGLE_FORMS_SETUP.md`

## Spreadsheet ID Location

From URL: `https://docs.google.com/spreadsheets/d/[THIS-IS-THE-ID]/edit`

## Security Checklist

- [x] `.env.local` in `.gitignore`
- [x] Service account has read-only access
- [x] JSON key not committed to repo
- [x] Backups excluded from version control

## Next Steps

1. ✅ Setup complete
2. Test with sample responses
3. Run sync before wedding
4. Check for unmatched responses
5. Use stats for planning

---

**Full Documentation**: [GOOGLE_FORMS_SETUP.md](./GOOGLE_FORMS_SETUP.md)
