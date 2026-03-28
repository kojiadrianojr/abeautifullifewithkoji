# Environment Variables Quick Reference

This is a quick reference for setting up environment variables for the wedding website. For detailed instructions, see [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md).

## 📋 Quick Setup Scenarios

### Scenario 1: Basic Deployment (No Integrations)
**Use case**: Static website with local images only

**Required secrets**: NONE ✨

Just push to `main` and your site will deploy!

---

### Scenario 2: Custom Domain
**Use case**: Deploy to your own domain (e.g., www.yourwedding.com)

**Required secrets**:
- `NEXT_PUBLIC_BASE_URL` = `https://www.yourwedding.com`

---

### Scenario 3: Google Forms RSVP
**Use case**: Sync RSVP responses from Google Forms

**Required secrets**:
- `GOOGLE_SERVICE_ACCOUNT_KEY` = `{"type":"service_account",...}`
- `GOOGLE_FORMS_SPREADSHEET_ID` = `1BxiMVs0XRA5nFMdKvBdBZjgm...`

**Setup steps**:
1. Create Google Form and link to Sheets
2. Create Google Cloud service account
3. Share Sheet with service account email
4. Add secrets to GitHub
5. Run `npm run sync-rsvp` locally to test

---

### Scenario 4: Google Drive Images (API Proxy)
**Use case**: Load images from Google Drive, requires Node.js server

**Required secrets**:
- `GOOGLE_SERVICE_ACCOUNT_KEY` = `{"type":"service_account",...}`
- `IMAGE_SOURCE_TYPE` = `google-drive`
- `GOOGLE_DRIVE_FOLDER_ID` = `1a2b3c4d5e6f7g8h9i0j`
- `NEXT_PUBLIC_BASE_URL` = Your server URL (required for API proxy)

**Note**: This mode requires a Node.js server (Docker, Vercel, etc.)

---

### Scenario 5: Google Drive Images (Direct URLs - GitHub Pages Compatible)
**Use case**: Load images from Google Drive using direct URLs, works on static hosting

**Required secrets**:
- `GOOGLE_SERVICE_ACCOUNT_KEY` = `{"type":"service_account",...}`
- `IMAGE_SOURCE_TYPE` = `direct-google-drive`
- `GOOGLE_DRIVE_FOLDER_ID` = `1a2b3c4d5e6f7g8h9i0j`

**Requirements**:
- All Google Drive files must be set to "Anyone with the link can view"
- Works on GitHub Pages (no server required)

---

### Scenario 6: Full Integration (Everything)
**Use case**: All features enabled

**Required secrets** (11 total):
1. `NEXT_PUBLIC_BASE_URL` = `https://www.yourwedding.com`
2. `GOOGLE_SERVICE_ACCOUNT_KEY` = `{"type":"service_account",...}`
3. `GOOGLE_FORMS_SPREADSHEET_ID` = `1BxiMVs0XRA5n...`
4. `IMAGE_SOURCE_TYPE` = `google-drive`
5. `GOOGLE_DRIVE_FOLDER_ID` = `1a2b3c4d5e6f...`
6. `GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID` = `1k2l3m4n5o6p...` (optional)
7. `GOOGLE_DRIVE_GALLERY_FOLDER_ID` = `1u2v3w4x5y6z...` (optional)
8. `GOOGLE_DRIVE_THROWBACK_FOLDER_ID` = `1a2b3c4d5e6f...` (optional)
9. `GOOGLE_DRIVE_PRENUP_FOLDER_ID` = `1g2h3i4j5k6l...` (optional)
10. `IMAGE_CACHE_ENABLED` = `true`
11. `IMAGE_CACHE_DURATION` = `300000`
12. `CACHE_CLEAR_SECRET` = `your-secret-token` (optional)

---

## 🔑 Secret Values Format Reference

### GOOGLE_SERVICE_ACCOUNT_KEY
**Format**: Single-line JSON string

**Correct**:
```json
{"type":"service_account","project_id":"my-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"sa@project.iam.gserviceaccount.com"}
```

**How to convert multi-line to single-line**:
```bash
# Using jq (recommended)
jq -c . service-account-key.json

# Using tr
cat service-account-key.json | tr -d '\n'

# Using Node.js
node -e "console.log(JSON.stringify(require('./service-account-key.json')))"
```

### GOOGLE_FORMS_SPREADSHEET_ID
**Format**: Alphanumeric string (extracted from URL)

**URL**: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`  
**ID**: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### GOOGLE_DRIVE_FOLDER_ID
**Format**: Alphanumeric string (extracted from URL)

**URL**: `https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j`  
**ID**: `1a2b3c4d5e6f7g8h9i0j`

### IMAGE_SOURCE_TYPE
**Format**: String (one of the allowed values)

**Options**:
- `local` - Default, uses images from `public/images/`
- `google-drive` - Uses Google Drive API with caching (requires server)
- `direct-google-drive` - Uses direct Google Drive URLs (static hosting compatible)
- `hybrid` - Tries local first, falls back to Google Drive

### IMAGE_CACHE_ENABLED
**Format**: Boolean string

**Options**: `true` or `false`

### IMAGE_CACHE_DURATION
**Format**: Number (milliseconds)

**Common values**:
- `60000` - 1 minute
- `300000` - 5 minutes (default)
- `600000` - 10 minutes
- `3600000` - 1 hour
- `0` - Disable caching

### NEXT_PUBLIC_BASE_URL
**Format**: Full URL (including protocol)

**Examples**:
- `https://www.johnandjanewedding.com`
- `https://wedding.yourdomain.com`
- `http://localhost:3000` (development only)

**Note**: Leave empty for GitHub Pages default URL

---

## 🚀 Adding Secrets to GitHub

### Quick Steps:

1. **Navigate to secrets page**:
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
   ```

2. **Click "New repository secret"**

3. **Add each secret**:
   - Name: Exact name from list above (case-sensitive!)
   - Value: Your secret value
   - Click "Add secret"

4. **Trigger deployment**:
   - Push to `main` branch, OR
   - Go to Actions → Deploy to GitHub Pages → Run workflow

---

## ✅ Testing Checklist

After adding secrets:

- [ ] All required secrets are added to GitHub
- [ ] Secret names match exactly (case-sensitive)
- [ ] GOOGLE_SERVICE_ACCOUNT_KEY is valid single-line JSON
- [ ] For Google Forms: Service account has access to spreadsheet
- [ ] For Google Drive: Service account has access to folders
- [ ] For direct-google-drive: Files are set to "Anyone with the link"
- [ ] Workflow runs successfully (check Actions tab)
- [ ] Website deploys and loads correctly
- [ ] Images load (if using Google Drive)
- [ ] RSVP sync works (if using Google Forms)

---

## 🔍 Troubleshooting Quick Fixes

### "Secret not found" error
- ✅ Check secret name is exactly correct (case-sensitive)
- ✅ Secret must be in "Actions" secrets, not "Codespaces" or "Dependabot"

### "Invalid JSON" error
- ✅ GOOGLE_SERVICE_ACCOUNT_KEY must be single-line JSON
- ✅ Use `jq -c .` to convert multi-line to single-line

### Images not loading (Google Drive)
- ✅ Check IMAGE_SOURCE_TYPE is set correctly
- ✅ Verify service account has "Viewer" access to folders
- ✅ For direct mode: Ensure files are publicly accessible

### RSVP sync not working
- ✅ Check service account has access to spreadsheet
- ✅ Share spreadsheet with service account email
- ✅ Verify GOOGLE_FORMS_SPREADSHEET_ID is correct

---

## 📚 Additional Resources

- **Full Guide**: [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
- **Google Forms**: [GOOGLE_FORMS_SETUP.md](GOOGLE_FORMS_SETUP.md)
- **Google Drive**: [IMAGE_SOURCES.md](IMAGE_SOURCES.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Need help?** Open an issue on GitHub or check the full documentation!
