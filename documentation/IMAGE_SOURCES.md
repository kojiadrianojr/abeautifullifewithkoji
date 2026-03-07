# Image Sources Configuration

This document describes how to configure image sources for your wedding website.

## Supported Image Sources

The website supports three types of image sources:

1. **Local** - Images from the `public/images` directory (default)
2. **Google Drive** - Images from Google Drive folders
3. **Hybrid** - Combination of local and Google Drive images

## Configuration

Image source configuration is done through environment variables in your `.env.local` file.

### Local Images (Default)

No configuration needed. Images are automatically loaded from:
- `/public/images/hero-album/` - Hero section background images
- `/public/images/gallery/` - Gallery section images
- `/public/images/throwback/` - Throwback photos in the story section
- `/public/images/prenup/` - Prenup photos in the story section

### Google Drive Images

To use Google Drive as your image source:

1. **Set up Google Cloud Service Account** (if not already set up):
   - Follow the instructions in `GOOGLE_FORMS_SETUP.md` to create a service account
   - Download the service account key JSON file

2. **Create Google Drive Folders**:
   - Create folders in your Google Drive for each image collection
   - Right-click on each folder → Share → Add your service account email
   - Give the service account "Viewer" permission
   - Get the folder ID from the URL (it's the long string after /folders/)

3. **Configure Environment Variables**:

```env
# Image source type: "local", "google-drive", or "hybrid"
IMAGE_SOURCE_TYPE=google-drive

# Google Service Account Key (same as for Google Forms)
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Main Google Drive folder ID (optional if you specify individual folders)
GOOGLE_DRIVE_FOLDER_ID=your-main-folder-id

# Individual folder IDs for each collection (optional)
# If not specified, the main folder will be used for all collections
GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID=your-hero-album-folder-id
GOOGLE_DRIVE_GALLERY_FOLDER_ID=your-gallery-folder-id
GOOGLE_DRIVE_THROWBACK_FOLDER_ID=your-throwback-folder-id
GOOGLE_DRIVE_PRENUP_FOLDER_ID=your-prenup-folder-id
```

### Hybrid Mode (Local + Google Drive)

Use both local images and Google Drive images. Local images are loaded first (higher priority):

```env
IMAGE_SOURCE_TYPE=hybrid
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
GOOGLE_DRIVE_FOLDER_ID=your-folder-id

# Optional: specific folder IDs
GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID=your-hero-album-folder-id
GOOGLE_DRIVE_GALLERY_FOLDER_ID=your-gallery-folder-id
```

## Folder Structure in Google Drive

### Option 1: Single Main Folder with Subfolders

Create one main folder with subfolders:

```
Wedding Photos (main folder - use this ID for GOOGLE_DRIVE_FOLDER_ID)
├── hero-album/
├── gallery/
├── throwback/
└── prenup/
```

Then in your `.env.local`:
```env
GOOGLE_DRIVE_FOLDER_ID=your-main-folder-id
```

The system will automatically look for subfolders named `hero-album`, `gallery`, etc.

### Option 2: Separate Folders for Each Collection

Create separate folders and specify each individually:

```
My Hero Album (folder 1)
My Gallery Photos (folder 2)
Throwback Photos (folder 3)
Prenup Shoot (folder 4)
```

Then in your `.env.local`:
```env
GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID=folder-id-1
GOOGLE_DRIVE_GALLERY_FOLDER_ID=folder-id-2
GOOGLE_DRIVE_THROWBACK_FOLDER_ID=folder-id-3
GOOGLE_DRIVE_PRENUP_FOLDER_ID=folder-id-4
```

## Getting Google Drive Folder IDs

1. Open the folder in Google Drive
2. Copy the URL from your browser
3. The folder ID is the long string after `/folders/`

Example URL:
```
https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                        This is your folder ID
```

## Image Requirements

- **Supported formats**: JPG, JPEG, PNG, GIF, WEBP, AVIF, BMP, SVG
- **File naming**: Images are sorted naturally (1.jpg, 2.jpg, 10.jpg)
- **Permissions**: For Google Drive, make sure the service account has "Viewer" access

## Caching

Google Drive images are cached for 5 minutes by default to improve performance and reduce API calls. The cache is automatically cleared after the cache duration expires.

## Troubleshooting

### Images not loading from Google Drive

1. **Check service account permissions**:
   - Ensure the service account email has "Viewer" access to all folders
   - The email looks like: `your-service-account@your-project.iam.gserviceaccount.com`

2. **Verify folder IDs**:
   - Make sure you're using the correct folder IDs
   - Folder IDs should be long alphanumeric strings

3. **Check environment variables**:
   - Ensure `.env.local` is in the root directory
   - Restart the development server after changing `.env.local`

4. **View error logs**:
   - Check the console for error messages
   - Common errors include authentication failures or missing permissions

### Images loading slowly

- Google Drive images may take longer to load on first access
- Consider using hybrid mode to keep frequently accessed images local
- Enable caching (enabled by default)

### Mixed content warnings (HTTP/HTTPS)

- Ensure your site is served over HTTPS in production
- Google Drive URLs use HTTPS by default

## API Rate Limits

Google Drive API has the following rate limits:
- 1,000 queries per 100 seconds per user
- 10,000 queries per 100 seconds per project

The caching system helps stay within these limits. If you exceed limits:
- Increase the cache duration
- Use hybrid mode with local images as primary source
- Consider downloading frequently accessed images locally

## Best Practices

1. **Small albums** (< 50 images): Use Google Drive directly
2. **Large albums** (> 100 images): Consider using local storage or hybrid mode
3. **Frequently viewed images**: Keep locally for best performance
4. **Infrequently updated images**: Google Drive works great
5. **Development**: Use local images for faster iteration
6. **Production**: Use Google Drive for easier updates
