# GitHub Pages Deployment Guide

This guide provides step-by-step instructions for deploying your wedding website to GitHub Pages with a custom domain.

## Prerequisites

- GitHub account
- Your repository pushed to GitHub
- Custom domain (abeautifullifewithkoji.com)
- Access to your domain's DNS settings

## Quick Start

The website is already configured for GitHub Pages deployment. Just follow these steps:

### 1. Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - wedding website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Build and deployment**:
   - Source: Select **GitHub Actions**
   
That's it! The GitHub Actions workflow will automatically build and deploy your site.

### 3. Set Up Custom Domain (abeautifullifewithkoji.com)

#### Step 3.1: Configure GitHub Pages Custom Domain

1. In your repository, go to **Settings** → **Pages**
2. Under **Custom domain**, enter: `abeautifullifewithkoji.com`
3. Click **Save**
4. Wait for DNS check (this may take a few minutes)
5. Once DNS is verified, check **Enforce HTTPS** (recommended)

#### Step 3.2: Configure DNS Records

You need to configure DNS records with your domain registrar (where you bought abeautifullifewithkoji.com).

**Option A: Using APEX Domain (Recommended)**

Add these **A records** pointing to GitHub's servers:

```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

Add a **CNAME record** for www subdomain:

```
Type     Name    Value
CNAME    www     YOUR_USERNAME.github.io
```

**Option B: Using www Subdomain Only**

If you prefer www.abeautifullifewithkoji.com:

```
Type     Name    Value
CNAME    www     YOUR_USERNAME.github.io
```

And optionally add a redirect from apex to www.

#### Step 3.3: DNS Configuration Examples

**For Common Registrars:**

**Namecheap:**
1. Log into Namecheap
2. Go to Domain List → Manage
3. Advanced DNS tab
4. Add the A and CNAME records above

**GoDaddy:**
1. Log into GoDaddy
2. My Products → DNS
3. Add the A and CNAME records above

**Cloudflare:**
1. Log into Cloudflare
2. Select your domain
3. DNS tab
4. Add the A and CNAME records above
5. **Important**: Set Proxy status to "DNS only" (gray cloud) for GitHub Pages

**Google Domains:**
1. Log into Google Domains
2. Select your domain
3. DNS tab → Custom records
4. Add the A and CNAME records above

#### Step 3.4: Verify DNS Propagation

DNS changes can take 24-48 hours to propagate fully, but usually complete within a few hours.

Check DNS propagation:
```bash
# Check A records
dig abeautifullifewithkoji.com

# Check CNAME
dig www.abeautifullifewithkoji.com
```

Or use online tools:
- https://www.whatsmydns.net/
- https://dnschecker.org/

### 4. Verify Deployment

Once DNS propagates and GitHub Actions completes:

1. Visit https://abeautifullifewithkoji.com
2. Verify all pages load correctly
3. Test navigation
4. Check that images display
5. Test RSVP form links
6. Verify SSL certificate is active (HTTPS)

## How Automatic Deployment Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. Triggers on every push to the `main` branch
2. Installs dependencies
3. Builds the Next.js static site
4. Deploys to GitHub Pages

### Manual Deployment

You can also trigger deployment manually:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow** button
5. Select branch and click **Run workflow**

## Configuration Files

### 1. `next.config.ts`
- Set to `output: 'export'` for static site generation
- Images set to `unoptimized: true` (required for static export)

### 2. `public/CNAME`
- Contains your custom domain: `abeautifullifewithkoji.com`
- Automatically copied to build output

### 3. `.github/workflows/deploy.yml`
- GitHub Actions workflow for automated deployment
- Builds and deploys on every push to main

## Updating Your Website

After initial deployment, any updates are automatic:

```bash
# Make your changes
git add .
git commit -m "Update website content"
git push

# GitHub Actions will automatically rebuild and deploy
```

Monitor deployment progress in the **Actions** tab of your repository.

## Troubleshooting

### Issue: "Site not loading at custom domain"

**Solutions:**
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check GitHub Pages settings show "DNS check successful"
4. Try clearing browser cache

### Issue: "HTTPS not working"

**Solutions:**
1. Wait 24 hours after DNS propagation for SSL certificate provisioning
2. Ensure "Enforce HTTPS" is checked in GitHub Pages settings
3. Clear browser cache

### Issue: "404 errors on navigation"

**Solutions:**
1. Verify `next.config.ts` has `output: 'export'`
2. Check that build completed successfully in Actions tab
3. Ensure no dynamic routes are being used

### Issue: "Images not loading"

**Solutions:**
1. Verify images are in the `public` folder
2. Check `next.config.ts` has `unoptimized: true`
3. Use relative paths (e.g., `/images/photo.jpg`)

### Issue: "Build failing in GitHub Actions"

**Solutions:**
1. Check Actions tab for error details
2. Verify build works locally: `npm run build`
3. Ensure all dependencies are in `package.json`
4. Check for TypeScript errors: `npm run lint`

### Issue: "Custom domain not saving"

**Solutions:**
1. Verify CNAME file exists in `public/` folder
2. Ensure DNS records are configured
3. Wait for DNS propagation
4. Try removing and re-adding the domain

## Environment Variables

If your site needs environment variables:

### For Public Variables (Safe to expose)

Add to `.github/workflows/deploy.yml` under the build step:

```yaml
- name: Build with Next.js
  run: npm run build
  env:
    NODE_ENV: production
    NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
```

### For Private Variables

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add your secrets
4. Reference them in the workflow file as shown above

## Cost

GitHub Pages is **completely FREE** for public repositories!

- Unlimited bandwidth
- Free SSL certificate
- Free custom domain support
- 1 GB storage limit
- 100 GB bandwidth/month (soft limit)

## Limitations

- Static site only (no server-side rendering)
- No API routes (use external APIs like Google Forms)
- Image optimization is disabled
- Build time limit: 10 minutes

## Alternative: Using Repository Subdirectory

If you want to deploy to `https://YOUR_USERNAME.github.io/wedding` instead of a custom domain:

1. Update `next.config.ts`:
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     basePath: '/wedding',
     assetPrefix: '/wedding',
     images: {
       unoptimized: true,
     },
   };
   ```

2. Delete `public/CNAME` file

3. Update navigation links to include base path

4. In GitHub Pages settings, ensure Source is set to "GitHub Actions"

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Support

If you encounter issues:

1. Check the GitHub Actions logs in the Actions tab
2. Review the troubleshooting section above
3. Consult the [GitHub Community Forum](https://github.community/)
4. Check [Next.js Discussions](https://github.com/vercel/next.js/discussions)

---

**Summary:** Your website is now configured for GitHub Pages! Push your code, enable GitHub Pages with GitHub Actions, configure your DNS records for abeautifullifewithkoji.com, and your site will be live!
