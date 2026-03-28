# GitHub Secrets Setup Guide

This guide explains how to configure GitHub Secrets for deploying your wedding website with environment variables.

## Table of Contents
- [What are GitHub Secrets?](#what-are-github-secrets)
- [Why Use GitHub Secrets?](#why-use-github-secrets)
- [Required vs Optional Secrets](#required-vs-optional-secrets)
- [How to Add Secrets to Your Repository](#how-to-add-secrets-to-your-repository)
- [Complete List of Secrets](#complete-list-of-secrets)
- [Testing Your Configuration](#testing-your-configuration)
- [Troubleshooting](#troubleshooting)

## What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that you can store in your GitHub repository. They are securely passed to GitHub Actions workflows during builds and deployments, allowing you to use sensitive information (like API keys) without exposing them in your code.

## Why Use GitHub Secrets?

✅ **Security**: Secrets are encrypted and never exposed in logs or code  
✅ **Convenience**: Automatic deployment without manual configuration  
✅ **Flexibility**: Easy to update without changing code  
✅ **Best Practice**: Industry-standard approach for CI/CD pipelines

## Required vs Optional Secrets

### ✅ Always Safe (No Secrets Needed)
If you're using **local images only** and **no Google Forms integration**, you don't need any secrets! The site will build and deploy successfully with default values.

### 🔧 Optional Secrets (Enable Features)

Add these secrets only if you need the corresponding features:

| Feature | Required Secrets |
|---------|-----------------|
| **Google Forms RSVP Sync** | `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_FORMS_SPREADSHEET_ID` |
| **Google Drive Images** | `GOOGLE_SERVICE_ACCOUNT_KEY`, `IMAGE_SOURCE_TYPE`, `GOOGLE_DRIVE_FOLDER_ID` |
| **Custom Domain** | `NEXT_PUBLIC_BASE_URL` |
| **Cache Management** | `CACHE_CLEAR_SECRET` |

## How to Add Secrets to Your Repository

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/YOUR_REPO`
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 2: Add Each Secret

For each secret you need:
1. Click **New repository secret**
2. Enter the **Name** (exact name from the list below)
3. Enter the **Value** (your actual secret value)
4. Click **Add secret**

### Step 3: Verify Secrets

After adding secrets:
- They will appear in the list (values are hidden)
- You can update them anytime by clicking **Update**
- You can delete them by clicking **Remove**

## Complete List of Secrets

### 1. Application Configuration

#### `NEXT_PUBLIC_BASE_URL` (Optional)
**When to use**: If deploying to a custom domain  
**Value**: Your website URL (e.g., `https://yourwedding.com`)  
**Default**: Empty (uses GitHub Pages URL automatically)  
**Example**:
```
https://www.johnandjanewedding.com
```

---

### 2. Google Forms Integration (Optional)

These secrets enable automatic RSVP syncing from Google Forms to your website.

#### `GOOGLE_SERVICE_ACCOUNT_KEY` (Required for Google integrations)
**When to use**: If using Google Forms RSVP sync or Google Drive images  
**Format**: Single-line JSON string  
**How to get**:
1. Follow the [Google Forms Setup Guide](./GOOGLE_FORMS_SETUP.md)
2. Download your service account key JSON file
3. Open the file and copy the entire contents
4. **Important**: Must be a single line with escaped newlines

**Example**:
```json
{"type":"service_account","project_id":"your-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"your-sa@project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-sa%40project.iam.gserviceaccount.com"}
```

**Conversion tip**: If your JSON has line breaks, you can convert it using:
```bash
# On Linux/Mac
cat service-account-key.json | tr -d '\n'

# Or using jq
jq -c . service-account-key.json
```

#### `GOOGLE_FORMS_SPREADSHEET_ID` (Required for Google Forms)
**When to use**: If syncing RSVP responses from Google Forms  
**How to get**: From your Google Sheets URL  
**URL format**: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`  
**Example**:
```
1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

---

### 3. Image Source Configuration (Optional)

These secrets control where wedding photos are loaded from.

#### `IMAGE_SOURCE_TYPE` (Optional)
**When to use**: If using Google Drive for images  
**Default**: `local`  
**Options**:
- `local` - Images from `public/images` directory (no additional setup)
- `google-drive` - Images from Google Drive via API proxy (requires Node.js server)
- `direct-google-drive` - Direct Google Drive URLs (for static sites - files must be public)
- `hybrid` - Uses both local and Google Drive images

**Example**:
```
google-drive
```

#### `GOOGLE_DRIVE_FOLDER_ID` (Required for Google Drive modes)
**When to use**: If `IMAGE_SOURCE_TYPE` is `google-drive`, `direct-google-drive`, or `hybrid`  
**How to get**: From your Google Drive folder URL  
**URL format**: `https://drive.google.com/drive/folders/FOLDER_ID`  
**Example**:
```
1a2b3c4d5e6f7g8h9i0j
```

#### Individual Folder IDs (Optional)
If you want to specify exact folders for each image collection:

**`GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID`** - Hero background slideshow images  
**`GOOGLE_DRIVE_GALLERY_FOLDER_ID`** - Gallery section images  
**`GOOGLE_DRIVE_THROWBACK_FOLDER_ID`** - Throwback photos  
**`GOOGLE_DRIVE_PRENUP_FOLDER_ID`** - Engagement/prenup photos

If not specified, the system will look for subfolders named `hero-album`, `gallery`, `throwback`, and `prenup` within the main folder.

---

### 4. Image Cache Configuration (Optional)

#### `IMAGE_CACHE_ENABLED` (Optional)
**When to use**: To control Google Drive image caching  
**Default**: `true`  
**Options**: `true` or `false`  
**Example**:
```
true
```

#### `IMAGE_CACHE_DURATION` (Optional)
**When to use**: To set cache duration for Google Drive images  
**Format**: Milliseconds (number)  
**Default**: `300000` (5 minutes)  
**Examples**:
- `60000` = 1 minute
- `300000` = 5 minutes
- `600000` = 10 minutes
- `0` = disable caching

**Example**:
```
300000
```

#### `CACHE_CLEAR_SECRET` (Optional)
**When to use**: To protect the cache clearing API endpoint  
**Format**: Any secure random string  
**Usage**: Include as `Authorization: Bearer YOUR_SECRET` when calling `/api/cache/clear`  
**Example**:
```
my-secret-cache-clearing-token-123
```

---

## Testing Your Configuration

### 1. Local Testing (Before Deploying)

Create a `.env.local` file in your project root:

```env
# Copy from .env.example and fill in your values
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
GOOGLE_FORMS_SPREADSHEET_ID=your-spreadsheet-id
IMAGE_SOURCE_TYPE=local
```

Run locally:
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and verify everything works.

### 2. GitHub Actions Testing

After adding secrets:

1. **Trigger a deployment**:
   - Push to `main` branch, or
   - Go to **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

2. **Monitor the build**:
   - Click on the running workflow
   - Check the "Build with Next.js" step
   - Verify no errors related to missing environment variables

3. **Verify deployment**:
   - Visit your GitHub Pages URL
   - Test RSVP form (if using Google Forms)
   - Check image loading (if using Google Drive)

### 3. Verify Secrets are Working

In your GitHub Actions workflow logs, you should see:
- ✅ Build completes successfully
- ✅ No warnings about missing environment variables
- ✅ Images load properly (if using Google Drive)
- ✅ RSVP sync works (if using Google Forms)

**Note**: Secret values are NEVER shown in logs for security.

---

## Troubleshooting

### Build Fails with "Invalid JSON"

**Problem**: `GOOGLE_SERVICE_ACCOUNT_KEY` is not properly formatted  
**Solution**: Ensure it's a single-line JSON string with escaped newlines

```bash
# Convert to single line
cat service-account-key.json | jq -c .
```

### Images Not Loading

**Problem**: Google Drive images don't appear  
**Checklist**:
- ✅ `IMAGE_SOURCE_TYPE` is set to `google-drive`, `direct-google-drive`, or `hybrid`
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` is added correctly
- ✅ `GOOGLE_DRIVE_FOLDER_ID` points to the correct folder
- ✅ Service account has "Viewer" access to the Drive folder
- ✅ For `direct-google-drive`: Files are set to "Anyone with the link" can view

### RSVP Sync Not Working

**Problem**: Guest list doesn't update from Google Forms  
**Checklist**:
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` is added correctly
- ✅ `GOOGLE_FORMS_SPREADSHEET_ID` is correct
- ✅ Service account has "Viewer" access to the spreadsheet
- ✅ Sheet permissions: Share with service account email

### Secrets Not Applied

**Problem**: Changes to secrets don't take effect  
**Solution**:
1. Secrets only apply on new workflow runs
2. Re-trigger deployment: Push to `main` or manually run workflow
3. Clear your browser cache if content seems stale

### Secret Not Found Error

**Problem**: Workflow fails with "secret not found"  
**Solution**:
- Double-check secret name matches exactly (case-sensitive)
- Secret must be in "Actions" secrets, not "Dependabot" or "Codespaces"
- Re-add the secret if necessary

---

## Security Best Practices

🔒 **DO**:
- Use GitHub Secrets for all sensitive data
- Rotate service account keys periodically
- Use minimal permissions on service accounts
- Review who has access to repository settings

⛔ **DON'T**:
- Never commit `.env.local` or `.env` files
- Never commit `service-account-key.json` files
- Never expose secrets in logs or code
- Never share secrets in public channels

---

## Example: Complete Setup for All Features

Here's what your GitHub Secrets should look like if using all features:

```
NEXT_PUBLIC_BASE_URL            = https://www.johnandjanewedding.com
GOOGLE_SERVICE_ACCOUNT_KEY      = {"type":"service_account",...}
GOOGLE_FORMS_SPREADSHEET_ID     = 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
IMAGE_SOURCE_TYPE               = google-drive
GOOGLE_DRIVE_FOLDER_ID          = 1a2b3c4d5e6f7g8h9i0j
GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID = 1k2l3m4n5o6p7q8r9s0t
GOOGLE_DRIVE_GALLERY_FOLDER_ID  = 1u2v3w4x5y6z7a8b9c0d
IMAGE_CACHE_ENABLED             = true
IMAGE_CACHE_DURATION            = 300000
CACHE_CLEAR_SECRET              = my-secure-random-token-xyz123
```

---

## Need Help?

- 📖 See [Google Forms Setup Guide](./GOOGLE_FORMS_SETUP.md) for Google integration
- 📖 See [Image Sources Guide](./IMAGE_SOURCES.md) for Google Drive setup
- 📖 See [Deployment Guide](./DEPLOYMENT.md) for hosting options
- 🐛 Open an issue on GitHub for problems

---

**Ready to deploy?** Add your secrets and push to `main`! 🚀
