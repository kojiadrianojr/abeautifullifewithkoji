# Google Forms RSVP Integration Setup

This guide explains how to integrate Google Forms responses with your wedding website's guest management system.

## Overview

The system fetches RSVP responses from Google Forms (via Google Sheets) and automatically updates your guest list with:
- RSVP status (confirmed/declined/pending)
- Number of attending guests
- Dietary restrictions
- Additional notes

## Prerequisites

1. A Google Form for RSVPs with responses saved to Google Sheets
2. A Google Cloud project with Sheets API enabled
3. A service account with access to your spreadsheet

## Setup Instructions

### Step 1: Create Your Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form with these recommended fields:
   - **Full Name** (Short answer, Required)
   - **Will you attend?** (Multiple choice: Yes/No, Required)
   - **Number of Guests** (Number or Short answer)
   - **Dietary Restrictions** (Long answer, Optional)
   - **Additional Notes** (Long answer, Optional)

3. Click the "Responses" tab in your form
4. Click the Google Sheets icon to create a linked spreadsheet
5. Note the spreadsheet URL - you'll need the ID from it

### Step 2: Set Up Google Cloud Service Account

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one

2. **Enable Google Sheets API**
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and click "Enable"

3. **Create a Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name (e.g., "Wedding RSVP Sync")
   - Click "Create and Continue"
   - Skip the optional role assignment
   - Click "Done"

4. **Create and Download Service Account Key**
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Click "Create" - the key file will be downloaded

5. **Copy the Service Account Email**
   - In the service account details, copy the email address
   - It looks like: `wedding-rsvp@your-project.iam.gserviceaccount.com`

### Step 3: Share Your Spreadsheet

1. Open your Google Sheets document (the one linked to your form)
2. Click "Share" button
3. Paste the service account email
4. Give it "Viewer" access (read-only is sufficient)
5. Uncheck "Notify people" (not needed for service accounts)
6. Click "Share"

### Step 4: Configure Environment Variables

1. Open the JSON key file you downloaded
2. Copy its entire contents
3. Create or update your `.env.local` file in the project root:

```bash
# Google Forms Integration
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"wedding-rsvp@your-project.iam.gserviceaccount.com",...}'

# Your Google Sheets ID (from the spreadsheet URL)
GOOGLE_FORMS_SPREADSHEET_ID=1AbC2DeF3GhI4JkL5MnO6PqR7StU8VwX9YzA
```

**To get your Spreadsheet ID:**
- Open your Google Sheets document
- Look at the URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
- Copy the long string between `/d/` and `/edit`

### Step 5: Install Dependencies

```bash
npm install
```

This will install the `googleapis` package along with other dependencies.

### Step 6: Run the Sync Script

```bash
npm run sync-rsvp
```

Or with a specific spreadsheet ID:

```bash
npm run sync-rsvp 1AbC2DeF3GhI4JkL5MnO6PqR7StU8VwX9YzA
```

## What the Script Does

1. **Connects to Google Sheets** using your service account
2. **Fetches all form responses** from the spreadsheet
3. **Matches responses to guests** in your `config/guests.json` file
4. **Creates a backup** of your current guest list
5. **Updates guest records** with RSVP information
6. **Shows a summary** of the sync results

## Output Example

```
🔄 Fetching RSVP responses from Google Forms...

📋 Loaded 25 guests from guests.json
📝 Fetched 12 form responses

📊 RSVP Summary:
   ✅ Confirmed: 10
   ❌ Declined: 2
   ⏳ Pending: 13
   📍 Total Guests: 25

🔗 Matched Responses:
   ✅ John Smith → John Smith
      🍽️  Dietary: Vegetarian
   ✅ Jane Doe → The Doe Family
   ❌ Bob Johnson → Bob Johnson

💾 Backup created: guests.backup.1709395200000.json
✅ Successfully updated guests.json
```

## Guest Data Structure

After syncing, each guest record will include:

```json
{
  "id": "1",
  "fullName": "John Smith",
  "allowedSeats": 2,
  "rsvpStatus": "confirmed",
  "rsvpCount": 2,
  "rsvpDate": "2026-02-15T10:30:00",
  "dietaryRestrictions": "Vegetarian, no nuts",
  "notes": "Looking forward to it!"
}
```

## Troubleshooting

### Error: GOOGLE_SERVICE_ACCOUNT_KEY is not set

- Make sure you've created `.env.local` file
- Verify the JSON is properly formatted (entire content wrapped in single quotes)
- Make sure there are no extra line breaks in the JSON

### Error: Failed to fetch Google Forms responses

- Verify the spreadsheet ID is correct
- Make sure you've shared the spreadsheet with the service account email
- Check that the Google Sheets API is enabled in your Cloud project

### No responses found

- Make sure there are responses in your Google Form
- Verify responses are being saved to the linked spreadsheet
- Check that the sheet name is "Form Responses 1" (default name)

### Responses not matching guests

The script uses fuzzy matching to find guests. It checks:
- Exact name matches
- Partial name matches (contains)
- Group name matches
- Member names in guest groups

If a response isn't matching:
- Check for spelling differences
- Ensure the name format matches (e.g., "John Smith" vs "Smith, John")
- The guest might not be in your `config/guests.json` file

## Running Sync Regularly

You can run the sync script:

- **Manually** whenever you want to check for new responses
- **Before the wedding** to get the final headcount
- **Via cron job** for automatic syncing (advanced)

### Example: Cron Job (Linux/Mac)

Edit your crontab:
```bash
crontab -e
```

Add this line to sync daily at 9 AM:
```
0 9 * * * cd /path/to/your/project && npm run sync-rsvp
```

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Add to .gitignore**: 
   ```
   .env*.local
   service-account-key.json
   ```
3. **Rotate keys** periodically (every 90 days recommended)
4. **Use read-only access** for the service account (Viewer role)
5. **Keep backup files** secure - they contain guest information

## Advanced: Customizing Column Mapping

If your Google Form has different column names, you can modify the matching logic in `src/services/googleFormsService.ts`:

```typescript
private findColumnIndex(headers: string[], patterns: string[]): number {
  // Add your custom patterns here
  const customPatterns = [...patterns, "your-custom-header"];
  // ... rest of logic
}
```

## Next Steps

After setting up the sync:

1. **Test it** with a few sample responses
2. **Verify** the matches are correct
3. **Set up a schedule** for regular syncing
4. **Monitor** for unmatched responses
5. **Communicate with guests** who need to RSVP

## API Reference

### GuestService Methods

```typescript
// Get guests by RSVP status
GuestService.getConfirmedGuests()
GuestService.getDeclinedGuests()
GuestService.getPendingGuests()

// Get statistics
GuestService.getRsvpStats()
// Returns: { totalGuests, confirmed, declined, pending, 
//            totalConfirmedSeats, totalAllowedSeats, responseRate }

// Check if guest responded
GuestService.hasResponded(guestId)
```

## Support

If you encounter issues:

1. Check the error messages carefully
2. Review the [Google Cloud Console](https://console.cloud.google.com) for API errors
3. Verify all setup steps were completed
4. Check that the service account has proper permissions

---

**Note:** Keep your service account credentials secure. Never share them publicly or commit them to version control.
