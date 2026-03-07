# Google Drive Images - Quick Start Guide

This guide will help you quickly set up Google Drive as your image source for the wedding website.

## Prerequisites

- A Google account
- Google Drive with your wedding photos
- Basic knowledge of environment variables

## Step-by-Step Setup

### Step 1: Organize Photos in Google Drive

1. **Create folders** for your photos in Google Drive:
   ```
   Wedding Website Photos/
   ├── hero-album/      (Background images for hero section)
   ├── gallery/         (Gallery section photos)
   ├── throwback/       (Old couple photos)
   └── prenup/          (Engagement/prenup photos)
   ```

2. **Upload your photos** to the appropriate folders

3. **Optional**: Instead of one main folder, you can create separate folders for each collection

### Step 2: Set Up Google Cloud Service Account

> **Note**: If you already set up Google Forms integration, you can reuse the same service account!

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create or Select a Project**:
   - Click "Select a project" → "New Project"
   - Name it (e.g., "Wedding Website")
   - Click "Create"

3. **Enable Google Drive API**:
   - Go to "APIs & Services" → "Enable APIs and Services"
   - Search for "Google Drive API"
   - Click "Enable"

4. **Create Service Account**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: "wedding-website-service"
   - Click "Create and Continue"
   - Skip roles (optional)
   - Click "Done"

5. **Create Service Account Key**:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Click "Create"
   - **Save this file securely!** (You'll need it in Step 3)

6. **Copy the service account email**:
   - It looks like: `your-service@your-project.iam.gserviceaccount.com`
   - You'll need this to share folders

### Step 3: Share Folders with Service Account

1. **For each folder** you created in Step 1:
   - Right-click the folder in Google Drive
   - Click "Share"
   - Paste the service account email
   - Set permission to "Viewer"
   - **Uncheck** "Notify people"
   - Click "Share"

2. **Get folder IDs**:
   - Open each folder in Google Drive
   - Copy the ID from the URL:
     ```
     https://drive.google.com/drive/folders/1a2b3c4d5e6f...
                                             ^^^^^^^^^^^^^^
                                             This is the folder ID
     ```
   - Save these IDs somewhere

### Step 4: Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Open `.env.local`** in your editor

3. **Add Google Drive configuration**:

   **Option A: Single main folder with subfolders**
   ```env
   IMAGE_SOURCE_TYPE=google-drive
   GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...paste entire JSON here..."}'
   GOOGLE_DRIVE_FOLDER_ID=your-main-folder-id
   NEXT_PUBLIC_BASE_URL=
   ```

   **Option B: Separate folders for each collection**
   ```env
   IMAGE_SOURCE_TYPE=google-drive
   GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...paste entire JSON here..."}'
   GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID=folder-id-1
   GOOGLE_DRIVE_GALLERY_FOLDER_ID=folder-id-2
   GOOGLE_DRIVE_THROWBACK_FOLDER_ID=folder-id-3
   GOOGLE_DRIVE_PRENUP_FOLDER_ID=folder-id-4
   NEXT_PUBLIC_BASE_URL=
   ```

   **Note on NEXT_PUBLIC_BASE_URL**:
   - In development: Leave empty (defaults to current URL)
   - In production: Set to your domain (e.g., `https://yourwedding.com`)
   - This is used for the image proxy API endpoint

4. **Format the service account key**:
   - Open the JSON file you downloaded in Step 2
   - Copy the **entire content**
   - Paste it as a **single line** in the `GOOGLE_SERVICE_ACCOUNT_KEY` variable
   - Make sure it's wrapped in single quotes
   - Escape any special characters if needed

   Example:
   ```env
   GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"wedding-123",...}'
   ```

### Step 5: Test the Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**: http://localhost:3000

3. **Check if images load**:
   - Hero section should show background images
   - Gallery section should display photos
   - Check browser console for any errors

### Step 6: Deploy (Optional)

When deploying to production (Vercel, Netlify, etc.):

1. **Add environment variables** to your hosting platform:
   - Same variables from `.env.local`
   - **Important**: Set `NEXT_PUBLIC_BASE_URL` to your production domain
     - Example: `NEXT_PUBLIC_BASE_URL=https://yourwedding.com`
   - Most platforms have a "Environment Variables" section in settings

2. **Deploy** and test

## How Google Drive Images Work

The application uses an **API proxy** to serve Google Drive images:

1. **Image URLs**: Google Drive images are served through `/api/images/[fileId]`
2. **Authentication**: The API endpoint uses the service account to authenticate with Google Drive
3. **Caching**: Images are cached for 7 days to minimize API calls
4. **Security**: Files remain private to the service account; no public sharing needed
5. **Performance**: After the first load, images load quickly from cache

This approach ensures:
- ✅ Images work without making files publicly accessible
- ✅ Browser can load images without authentication
- ✅ Good performance with proper caching
- ✅ Secure access control via service account

## Troubleshooting

### Images Not Loading

**Check 1: Service account permissions**
- Verify the service account email has "Viewer" access to all folders
- Check the email is exactly as copied (no extra spaces)

**Check 2: Folder IDs**
- Ensure folder IDs are correct (copy from URL)
- Folder IDs should be long alphanumeric strings (28-44 characters)

**Check 3: Environment variables**
- Verify `.env.local` is in the root directory (not in a subdirectory)
- Check the service account JSON is properly formatted (one line, in quotes)
- Restart the dev server after changing `.env.local`

**Check 4: Console errors**
- Open browser DevTools (F12)
- Check Console tab for error messages
- Look for authentication or permission errors

### Slow Loading

- Google Drive images may load slower than local images
- First load is slowest (no cache yet)
- Subsequent loads should be faster (5-minute cache)
- Consider **hybrid mode** for better performance:
  ```env
  IMAGE_SOURCE_TYPE=hybrid
  ```

### API Rate Limits

If you see errors about rate limits:
- Wait a few minutes and try again
- Reduce the number of images
- Use local images for development
- Contact Google Cloud support to request higher limits

### "Invalid credentials" error

- Check that `GOOGLE_SERVICE_ACCOUNT_KEY` is properly formatted
- Ensure the JSON is on a single line
- Verify the service account key hasn't been deleted in Google Cloud Console
- Try creating a new service account key

## Hybrid Mode (Best of Both Worlds)

Use both local and Google Drive images:

```env
IMAGE_SOURCE_TYPE=hybrid
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

**Benefits**:
- Local images load first (fast)
- Google Drive images as backup/additional photos
- Easy to add more photos without redeploying

## Additional Resources

- **Detailed Documentation**: See `documentation/IMAGE_SOURCES.md`
- **API Reference**: See `documentation/IMAGE_SERVICE_API.md`
- **Google Cloud Console**: https://console.cloud.google.com/
- **Google Drive API Docs**: https://developers.google.com/drive/api

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review console error messages
3. Verify all setup steps were completed
4. Check the detailed documentation
5. Ensure googleapis package is installed: `npm list googleapis`

## Next Steps

After setup:
- ✅ Add more photos to Google Drive (no redeploy needed!)
- ✅ Organize photos in folders
- ✅ Share with family/photographer for easy photo collection
- ✅ Update photos anytime without touching code

---

**Pro Tip**: You can share the Google Drive folders with your photographer or family members to collect photos easily!
