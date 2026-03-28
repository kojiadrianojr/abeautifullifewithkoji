# GitHub Pages Deployment Checklist

Use this checklist to track your deployment progress to GitHub Pages with the custom domain abeautifullifewithkoji.com.

## Pre-Deployment Setup ✅

- [x] Next.js configured for static export (`output: 'export'`)
- [x] Images configured as unoptimized
- [x] GitHub Actions workflow created
- [x] CNAME file created with domain
- [x] .nojekyll file added

## Step 1: Push to GitHub

- [ ] Repository created on GitHub
- [ ] Git initialized locally
- [ ] All files committed
- [ ] Remote added: `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`
- [ ] Code pushed to main branch: `git push -u origin main`

## Step 2: Enable GitHub Pages

- [ ] Go to GitHub repository Settings
- [ ] Navigate to Pages section
- [ ] Set Source to "GitHub Actions"
- [ ] Wait for first deployment to complete (check Actions tab)

## Step 3: Configure Custom Domain on GitHub

- [ ] Go to Settings → Pages
- [ ] Enter domain: `abeautifullifewithkoji.com`
- [ ] Click Save
- [ ] Wait for DNS check (may show pending initially)

## Step 4: Configure DNS Records

Choose your domain registrar and follow their instructions:

### Required DNS Records:

**A Records (for apex domain):**
- [ ] Add A record: `185.199.108.153`
- [ ] Add A record: `185.199.109.153`
- [ ] Add A record: `185.199.110.153`
- [ ] Add A record: `185.199.111.153`

**CNAME Record (for www subdomain):**
- [ ] Add CNAME record: `www` → `YOUR_USERNAME.github.io`

### Registrar-Specific Steps:

**If using Namecheap:**
- [ ] Login to Namecheap
- [ ] Go to Domain List → Manage → Advanced DNS
- [ ] Add records as listed above

**If using GoDaddy:**
- [ ] Login to GoDaddy
- [ ] Go to My Products → DNS
- [ ] Add records as listed above

**If using Cloudflare:**
- [ ] Login to Cloudflare
- [ ] Select domain → DNS
- [ ] Add records as listed above
- [ ] Set proxy status to "DNS only" (gray cloud)

**If using Google Domains:**
- [ ] Login to Google Domains
- [ ] Select domain → DNS → Custom records
- [ ] Add records as listed above

## Step 5: Wait for DNS Propagation

- [ ] DNS changes saved
- [ ] Waiting period (can take 1-48 hours, usually 2-6 hours)
- [ ] Check DNS propagation: `dig abeautifullifewithkoji.com`
- [ ] Or use: https://www.whatsmydns.net/

## Step 6: Enable HTTPS

- [ ] DNS check successful in GitHub Pages settings
- [ ] Enable "Enforce HTTPS" checkbox
- [ ] Wait for SSL certificate provisioning (can take 24 hours)

## Step 7: Verify Deployment

- [ ] Site loads at: https://abeautifullifewithkoji.com
- [ ] All pages accessible (Home, Story, Schedule, etc.)
- [ ] Images load correctly
- [ ] Navigation works
- [ ] RSVP form links work
- [ ] Mobile view works correctly
- [ ] HTTPS works (padlock icon in browser)
- [ ] www.abeautifullifewithkoji.com redirects properly

## Testing Checklist

- [ ] Test on desktop browser (Chrome, Firefox, Safari)
- [ ] Test on mobile browser (iOS Safari, Android Chrome)
- [ ] Test all navigation links
- [ ] Test RSVP form submission
- [ ] Check Google Forms integration works
- [ ] Verify countdown timer displays
- [ ] Check gallery images load
- [ ] Test lightbox functionality
- [ ] Verify FAQ accordion works
- [ ] Check footer links

## Troubleshooting (If Needed)

If you encounter issues:

- [ ] Check GitHub Actions tab for build errors
- [ ] Verify DNS records are correct: `dig abeautifullifewithkoji.com`
- [ ] Clear browser cache and try incognito/private mode
- [ ] Wait additional time for DNS propagation
- [ ] Review [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) troubleshooting section
- [ ] Check browser console for JavaScript errors (F12)

## Future Updates

After initial deployment, updates are automatic:

- [ ] Make changes to code/content
- [ ] Commit changes: `git add . && git commit -m "Update content"`
- [ ] Push to GitHub: `git push`
- [ ] Monitor deployment in Actions tab
- [ ] Verify updates at: https://abeautifullifewithkoji.com

---

## Quick Reference Commands

```bash
# Check DNS
dig abeautifullifewithkoji.com
dig www.abeautifullifewithkoji.com

# Push updates
git add .
git commit -m "Your update message"
git push

# Test build locally
npm run build
```

## Important Notes

- ✅ GitHub Pages is 100% FREE
- ✅ Includes free SSL certificate
- ✅ Supports custom domains
- ✅ Automatic deployments on push
- ✅ No credit card required

## Support Resources

- [Full Deployment Guide](./GITHUB_PAGES_DEPLOYMENT.md)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Troubleshooting Guide](./GITHUB_PAGES_DEPLOYMENT.md#troubleshooting)

---

**Estimated Time:** 1-2 hours (mostly waiting for DNS propagation)

**Difficulty:** ⭐ Easy (just follow the steps!)

**Cost:** FREE 🎉
