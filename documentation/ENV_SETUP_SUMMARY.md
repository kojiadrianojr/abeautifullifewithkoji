# Environment Variables Setup Summary

## What Has Been Configured

This repository now has complete environment variable support for utilizing GitHub Secrets. This allows you to securely store sensitive configuration (API keys, credentials) without exposing them in your code.

## Files Created/Modified

### 1. `.env.example` ✨ NEW
**Purpose**: Template showing all available environment variables  
**Usage**: Copy to `.env.local` for local development  
**Location**: Project root

### 2. `.env.docker.example` ✨ NEW
**Purpose**: Template for Docker/Docker Compose deployments  
**Usage**: Copy to `.env` when using Docker  
**Location**: Project root

### 3. `.github/workflows/deploy.yml` ✏️ UPDATED
**Changes**: Added 13 environment variables that pull from GitHub Secrets
- `NEXT_PUBLIC_BASE_URL`
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `GOOGLE_FORMS_SPREADSHEET_ID`
- `IMAGE_SOURCE_TYPE`
- `GOOGLE_DRIVE_FOLDER_ID`
- `GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID`
- `GOOGLE_DRIVE_GALLERY_FOLDER_ID`
- `GOOGLE_DRIVE_THROWBACK_FOLDER_ID`
- `GOOGLE_DRIVE_PRENUP_FOLDER_ID`
- `IMAGE_CACHE_ENABLED`
- `IMAGE_CACHE_DURATION`
- `CACHE_CLEAR_SECRET`
- `NODE_ENV` (hardcoded to `production`)

### 4. `docker-compose.yml` ✏️ UPDATED
**Changes**: Now supports loading environment variables from `.env` file
- Added `env_file: .env` directive
- All environment variables now configurable via `.env` file
- Includes default values for optional variables

### 5. `documentation/GITHUB_SECRETS_SETUP.md` ✨ NEW
**Purpose**: Comprehensive guide for setting up GitHub Secrets
**Contents**:
- Step-by-step instructions for adding secrets
- Complete list of all available secrets
- Format examples and conversion tips
- Testing checklist
- Troubleshooting guide
- Security best practices

### 6. `documentation/ENV_VARIABLES_QUICK_REFERENCE.md` ✨ NEW
**Purpose**: Quick reference for common configuration scenarios
**Contents**:
- 6 common setup scenarios
- Secret value format reference
- Quick troubleshooting fixes
- Testing checklist

### 7. `README.md` ✏️ UPDATED
**Changes**: Added new section "🔐 Environment Variables & GitHub Secrets"
- Overview of environment variable support
- Instructions for local development
- Instructions for GitHub Pages with secrets
- Link to comprehensive setup guide

## How It Works

### For GitHub Pages Deployment

1. **Add Secrets**: Navigate to Repository Settings → Secrets and variables → Actions
2. **Add Required Secrets**: Add only the secrets you need (see scenarios below)
3. **Push to Main**: GitHub Actions will automatically inject secrets during build
4. **Deploy**: Site deploys with your configuration

### For Docker Deployment

1. **Copy Template**: `cp .env.docker.example .env`
2. **Fill Values**: Edit `.env` with your actual values
3. **Run**: `docker-compose up -d`
4. **Done**: Container starts with your environment variables

### For Local Development

1. **Copy Template**: `cp .env.example .env.local`
2. **Fill Values**: Edit `.env.local` with your actual values
3. **Run**: `npm run dev`
4. **Done**: Dev server starts with your environment variables

## Common Setup Scenarios

### Scenario 1: Basic Deployment (No Secrets Needed)
**Features**: Static site with local images only  
**Required Secrets**: NONE  
**Action**: Just push to main - it works out of the box!

### Scenario 2: Custom Domain Only
**Features**: Your own domain (e.g., www.yourwedding.com)  
**Required Secrets**:
- `NEXT_PUBLIC_BASE_URL`

### Scenario 3: Google Forms RSVP
**Features**: Automatic RSVP syncing from Google Forms  
**Required Secrets**:
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `GOOGLE_FORMS_SPREADSHEET_ID`

### Scenario 4: Google Drive Images (Static Mode)
**Features**: Images from Google Drive for GitHub Pages  
**Required Secrets**:
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `IMAGE_SOURCE_TYPE` (set to `direct-google-drive`)
- `GOOGLE_DRIVE_FOLDER_ID`

### Scenario 5: Google Drive Images (API Mode)
**Features**: Images from Google Drive with API proxy  
**Required Secrets**:
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `IMAGE_SOURCE_TYPE` (set to `google-drive`)
- `GOOGLE_DRIVE_FOLDER_ID`
- `NEXT_PUBLIC_BASE_URL` (required for API proxy)

**Note**: Requires Node.js server (Docker, Vercel, etc.)

### Scenario 6: Full Integration (Everything)
**Features**: All features enabled  
**Required Secrets**: All 12 secrets listed in the workflow

## Security Notes

✅ **What's Secure**:
- `.env` and `.env.local` are in `.gitignore` (never committed)
- `service-account-key.json` is in `.gitignore` (never committed)
- GitHub Secrets are encrypted and never exposed in logs
- Secrets are only injected during build in secure environment

⚠️ **Important**:
- Never commit `.env` or `.env.local` files
- Never commit service account key JSON files
- Never share secrets in public channels
- Rotate service account keys periodically
- Use minimal permissions on service accounts

## Testing Your Setup

### 1. Local Testing First
```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local

# Test locally
npm install
npm run dev

# Verify at http://localhost:3000
```

### 2. GitHub Actions Testing
```bash
# After adding secrets to GitHub:

# Trigger deployment
git push origin main

# Monitor workflow
# Go to: Actions tab → Deploy to GitHub Pages

# Check logs for errors
# Verify: "Build with Next.js" step completes successfully
```

### 3. Verify Deployment
- Visit your deployed site
- Check images load (if using Google Drive)
- Test RSVP flow (if using Google Forms)
- Verify no console errors

## Troubleshooting

### Build Fails: "Invalid JSON"
**Problem**: `GOOGLE_SERVICE_ACCOUNT_KEY` format is incorrect  
**Solution**: Must be single-line JSON
```bash
# Convert using jq
jq -c . service-account-key.json
```

### Secret Not Found
**Problem**: GitHub Actions can't find secret  
**Solution**: 
- Check secret name is exactly correct (case-sensitive)
- Must be in "Actions" secrets section
- Re-trigger workflow after adding secrets

### Images Not Loading
**Problem**: Google Drive images don't appear  
**Solution**:
- Verify `IMAGE_SOURCE_TYPE` is set correctly
- Check service account has "Viewer" access to folders
- For `direct-google-drive`: Ensure files are publicly accessible

## Documentation Links

📖 **[Complete Setup Guide](documentation/GITHUB_SECRETS_SETUP.md)** - Full instructions  
📋 **[Quick Reference](documentation/ENV_VARIABLES_QUICK_REFERENCE.md)** - Common scenarios  
🔧 **[Google Forms Setup](documentation/GOOGLE_FORMS_SETUP.md)** - RSVP integration  
🖼️ **[Image Sources](documentation/IMAGE_SOURCES.md)** - Google Drive images  
🚀 **[Deployment Guide](documentation/DEPLOYMENT.md)** - All deployment options

## Next Steps

1. **Review** the setup guide: `documentation/GITHUB_SECRETS_SETUP.md`
2. **Decide** which features you need (see scenarios above)
3. **Add** required secrets to your GitHub repository
4. **Test** locally with `.env.local` first
5. **Deploy** by pushing to main branch
6. **Verify** your site works correctly

## Need Help?

- Check the troubleshooting section in `GITHUB_SECRETS_SETUP.md`
- Review the quick reference: `ENV_VARIABLES_QUICK_REFERENCE.md`
- Open an issue on GitHub if problems persist

---

**Ready to deploy?** 🚀

Add your secrets and push to `main`!
