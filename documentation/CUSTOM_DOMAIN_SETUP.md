# Custom Domain Setup for GitHub Pages

This guide explains how to properly configure your wedding website for deployment to GitHub Pages with a custom domain.

## 🚨 Important: Custom Domain vs Subdirectory Deployment

There are **two different ways** to deploy to GitHub Pages, and each requires **different configuration**:

### Option 1: Custom Domain (e.g., `yourwedding.com`)
- **NEXT_PUBLIC_BASE_PATH**: Must be **EMPTY** or **UNSET**
- **CNAME file**: Required in `public/CNAME`
- **DNS**: Configure DNS records to point to GitHub Pages
- **Asset URLs**: `/images/hero-bg.jpg` (no prefix needed)

### Option 2: Subdirectory (e.g., `username.github.io/wedding`)
- **NEXT_PUBLIC_BASE_PATH**: Must be set to `/wedding` (your repo name)
- **CNAME file**: Must be **deleted** or **removed**
- **DNS**: Not needed
- **Asset URLs**: `/wedding/images/hero-bg.jpg` (automatically prefixed)

## The Problem: Assets Not Loading with Custom Domain

If you're using a custom domain and assets (wallpaper, images) are not loading, it's likely because `NEXT_PUBLIC_BASE_PATH` is incorrectly set. This creates invalid URLs like:

```
❌ WRONG: https://yourwedding.com/repo-name/images/hero-bg.jpg (404 Not Found)
✅ CORRECT: https://yourwedding.com/images/hero-bg.jpg
```

## Solution: Configure GitHub Secrets Correctly

### Step 1: Check Your Custom Domain

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Pages**
3. Under **Custom domain**, you should see your domain (e.g., `abeautifullifewithkoji.arkea.tech`)
4. Verify that the `public/CNAME` file contains the same domain

### Step 2: Configure GitHub Secrets

For **custom domain deployment**, you need to configure these secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

**Required Secrets for Custom Domain:**

#### `NEXT_PUBLIC_BASE_PATH`
- **Value**: Leave **EMPTY** (literally empty, no value)
- **Why**: Custom domains are served from the root, not a subdirectory
- **Alternative**: If you can't set an empty secret, DELETE this secret entirely

#### `NEXT_PUBLIC_BASE_URL`
- **Value**: `https://yourwedding.com` (your custom domain URL)
- **Example**: `https://abeautifullifewithkoji.arkea.tech`
- **Why**: Used for API routes and generating absolute URLs

### Step 3: Verify DNS Configuration

Your DNS provider should have these records:

#### For Root Domain (e.g., `yourwedding.com`):
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

#### For Subdomain (e.g., `www.yourwedding.com` or `abeautifullifewithkoji.arkea.tech`):
```
Type: CNAME
Name: www (or your subdomain)
Value: YOUR_USERNAME.github.io
```

### Step 4: Trigger Redeployment

After updating the secrets:

1. Go to **Actions** tab in your repository
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for the deployment to complete (usually 2-5 minutes)

### Step 5: Verify Assets Are Loading

1. Open your website at your custom domain
2. Open browser DevTools (F12) → **Network** tab
3. Refresh the page
4. Check that images load successfully:
   - ✅ `https://yourwedding.com/images/hero-bg.jpg` (200 OK)
   - ❌ `https://yourwedding.com/repo-name/images/hero-bg.jpg` (404 Not Found)

## How It Works

The website uses a smart asset path utility (`src/lib/asset-path.ts`) that:

1. Checks if `NEXT_PUBLIC_BASE_PATH` is set
2. If set (subdirectory deployment):
   - Prepends the basePath: `/repo-name/images/hero-bg.jpg`
3. If empty or unset (custom domain):
   - Uses root path: `/images/hero-bg.jpg`

This allows the same codebase to work in both deployment scenarios!

## Switching from Subdirectory to Custom Domain

If you previously deployed to `username.github.io/repo-name` and now want to use a custom domain:

### Changes Required:

1. **Update or Delete `NEXT_PUBLIC_BASE_PATH` Secret**
   - Go to Settings → Secrets and variables → Actions
   - Either DELETE the `NEXT_PUBLIC_BASE_PATH` secret
   - Or UPDATE it to be empty (no value)

2. **Add `CNAME` File** (if not already present)
   - Create `public/CNAME` file with your domain
   - Example content: `yourwedding.com`

3. **Set `NEXT_PUBLIC_BASE_URL` Secret**
   - Add or update: `https://yourwedding.com`

4. **Configure DNS** (see Step 3 above)

5. **Enable Custom Domain in GitHub Settings**
   - Go to Settings → Pages
   - Enter your custom domain
   - Wait for DNS check to pass

6. **Redeploy** (see Step 4 above)

## Switching from Custom Domain to Subdirectory

If you want to switch from custom domain to subdirectory deployment:

### Changes Required:

1. **Set `NEXT_PUBLIC_BASE_PATH` Secret**
   - Value: `/your-repo-name` (with leading slash)
   - Example: `/abeautifullifewithkoji`

2. **Delete `CNAME` File**
   - Remove `public/CNAME` from your repository
   - Commit and push the change

3. **Update `NEXT_PUBLIC_BASE_URL` Secret**
   - Value: `https://YOUR_USERNAME.github.io/your-repo-name`
   - Example: `https://kojiadrianojr.github.io/abeautifullifewithkoji`

4. **Disable Custom Domain in GitHub Settings**
   - Go to Settings → Pages
   - Remove the custom domain

5. **Redeploy** (trigger workflow manually)

## Testing Locally

You can test the production build locally before deploying:

### Test Custom Domain Configuration:
```bash
# Don't set NEXT_PUBLIC_BASE_PATH (or set to empty)
export NEXT_PUBLIC_BASE_PATH=
npm run build
npx serve out -l 3000
```

Visit `http://localhost:3000` - assets should load from `/images/...`

### Test Subdirectory Configuration:
```bash
# Set basePath to your repo name
export NEXT_PUBLIC_BASE_PATH=/abeautifullifewithkoji
npm run build
npx serve out -l 3000
```

Visit `http://localhost:3000/abeautifullifewithkoji` - assets should load from `/abeautifullifewithkoji/images/...`

## Common Issues

### Issue 1: Assets return 404 with custom domain

**Symptom**: Images not loading, browser shows 404 errors

**Solution**: 
- Check that `NEXT_PUBLIC_BASE_PATH` secret is empty or deleted
- Redeploy after fixing

### Issue 2: Website not accessible at custom domain

**Symptom**: DNS_PROBE_FINISHED_NXDOMAIN or similar error

**Solution**:
- Verify DNS configuration (can take up to 48 hours)
- Check that CNAME file exists in `public/CNAME`
- Verify custom domain is set in GitHub Pages settings

### Issue 3: SSL certificate error

**Symptom**: "Your connection is not private" warning

**Solution**:
- Wait 24 hours for GitHub to provision SSL certificate
- Ensure "Enforce HTTPS" is checked in GitHub Pages settings
- Verify DNS records are correct

### Issue 4: Website loads but looks broken

**Symptom**: CSS not loading, layout broken

**Solution**:
- Check browser console for 404 errors
- Verify that ALL assets are in the `public/` folder
- Clear browser cache and hard refresh (Ctrl+Shift+R)

## Quick Reference

| Deployment Type | NEXT_PUBLIC_BASE_PATH | NEXT_PUBLIC_BASE_URL | CNAME File |
|----------------|----------------------|---------------------|------------|
| Custom Domain | Empty or Unset | `https://yourwedding.com` | Required |
| Subdirectory | `/repo-name` | `https://username.github.io/repo-name` | Delete |

## Need Help?

If assets are still not loading after following this guide:

1. Check the [GitHub Pages Troubleshooting Guide](GITHUB_PAGES_DEPLOYMENT.md#troubleshooting)
2. Review the [GitHub Secrets Setup Guide](GITHUB_SECRETS_SETUP.md)
3. Open an issue on GitHub with:
   - Your custom domain
   - Screenshot of the error in browser DevTools
   - Current GitHub Secrets configuration (don't share values, just names)

## Related Documentation

- [GitHub Pages Deployment Guide](GITHUB_PAGES_DEPLOYMENT.md)
- [GitHub Secrets Setup](GITHUB_SECRETS_SETUP.md)
- [DNS Configuration Guide](DNS_CONFIGURATION.md)
- [Environment Variables Reference](ENV_VARIABLES_QUICK_REFERENCE.md)
