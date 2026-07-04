# Deployment Guide

This guide covers deployment options for your wedding website.

> **Important:** This app is **not** a static site. The RSVP flow uses a
> server-only API route (`POST /api/guests/search`) that runs Node.js at
> request time. Any static-only host (GitHub Pages, plain cPanel, a static
> Netlify publish of `.next`) **cannot** run it. Use a host that supports the
> Next.js server runtime: Vercel (the current setup) or Docker.

## How this project actually deploys

Production deploys run through **GitHub Actions → Vercel**
(`.github/workflows/deploy.yml`), not Vercel's git integration. `vercel.json`
sets `git.deploymentEnabled: false`, so pushing to GitHub does **not** trigger a
Vercel-side deploy on its own — the workflow builds and deploys via the Vercel
CLI using repository secrets. See
[GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) for the required secrets.

## Option 1: Vercel via GitHub Actions (current & recommended)

The repository is already wired for this. On push/PR to `main` (and manual
`workflow_dispatch`), the workflow:

1. Installs dependencies and restores private config from secrets
   (`WEDDING_JSON`, `GUESTS_BEA_JSON`, `GUESTS_KOJI_JSON`).
2. Runs `vercel pull` / `vercel build` / `vercel deploy --prebuilt`
   (production on `main`, preview otherwise).
3. Runs a post-deploy smoke test that fails the job if the site is unhealthy.

### One-time setup

1. **Create the Vercel project** and note the org/project IDs.
2. **Add GitHub secrets** (repo → Settings → Secrets and variables → Actions):
   `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `WEDDING_JSON`,
   `GUESTS_BEA_JSON`, `GUESTS_KOJI_JSON`, plus any `GOOGLE_*` / `NEXT_PUBLIC_*`
   values you use. See [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md).
3. **Custom Domain** (optional): add it in Vercel Project → Settings → Domains
   and update your DNS records as instructed.

**Cost**: Free for personal projects.

## Option 2: Docker on Your Own Server

Deploy using Docker on any server with Docker installed.

### Prerequisites:
- A server with Docker installed (DigitalOcean, AWS, etc.)
- Domain name (optional)

### Steps:

1. **Connect to your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Clone your repository**
   ```bash
   git clone YOUR_REPO_URL
   cd wedding-website
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Set up reverse proxy** (optional, for custom domain)

   Install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

   Create Nginx config:
   ```bash
   sudo nano /etc/nginx/sites-available/wedding
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Add SSL with Let's Encrypt** (optional)
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

**Cost**: Server costs vary ($5-20/month for basic VPS)

## Other platforms

Any host that runs the **Next.js server runtime** can serve this app (the
server-only RSVP API route rules out static-only hosts). Examples:

- **AWS Amplify** — connect the GitHub repo and use the default Next.js SSR
  build; do **not** publish `.next` as static artifacts.
- **Netlify** — works only with Netlify's Next.js runtime (SSR), not a plain
  static publish of `.next`.

> **Static export / cPanel is not supported.** `npm run export` in this project
> just runs `next build` (there is no `output: 'export'` config and no `out/`
> directory), and the RSVP API route cannot run on static hosting. Use Vercel
> or Docker instead.

## Choosing the Right Option

| Option | Best For | Difficulty | Cost |
|--------|----------|------------|------|
| **Vercel (GitHub Actions)** | **Current setup, most users** | ⭐ **Easy** | **Free** |
| Docker | Full control / self-host | ⭐⭐⭐ Advanced | $5-20/mo |
| AWS Amplify / Netlify (SSR) | Existing platform users | ⭐⭐ Moderate | ~$1/mo+ |

## Post-Deployment Checklist

After deploying:

- [ ] Site is accessible at the URL
- [ ] All images load correctly
- [ ] Navigation works properly
- [ ] RSVP form links work
- [ ] Mobile view is correct
- [ ] SSL certificate is active (HTTPS)
- [ ] Custom domain is connected (if applicable)
- [ ] Test on different devices
- [ ] Share with friends for testing

## Updating Your Site

After making changes:

### For Vercel (GitHub Actions):
```bash
git add .
git commit -m "Update: wedding details"
git push origin main
```
Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
deploys to Vercel production (and runs the post-deploy smoke test). Deploys are
driven by the workflow — Vercel's own git integration is disabled
(`git.deploymentEnabled: false`), so a push alone does not deploy without the
Action running.

### For Docker:
```bash
ssh user@your-server
cd wedding-website
git pull
docker-compose down
docker-compose up -d --build
```

## Custom Domain Setup

### Vercel:
1. Go to Project → Settings → Domains
2. Add your custom domain
3. Update DNS records at your domain registrar:
   - Type: A Record
   - Name: @ or www
   - Value: (provided by platform)

### Docker with Nginx:
1. Point your domain's A record to your server IP
2. Follow the Nginx configuration in Option 2 (Docker) above

## Troubleshooting

### Site not loading after deployment
- Check build logs for errors
- Verify `package.json` scripts are correct
- Ensure all dependencies are listed

### Images not showing
- Confirm images are in the `public/` directory
- Check image paths start with `/`
- Verify images were included in deployment

### Environment variables not working
- Set environment variables in your platform's dashboard
- Don't commit `.env` files to Git

### Build fails
- Check Node.js version matches (20+)
- Clear cache and rebuild
- Check for TypeScript errors

## Performance Optimization

After deploying:

1. **Optimize Images**
   - Use WebP format
   - Compress before uploading
   - Use Next.js Image component

2. **Enable Caching**
   - Most platforms do this automatically
   - Configure cache headers if using custom server

3. **Monitor Performance**
   - Use Vercel Analytics
   - Or Google PageSpeed Insights

## Security Considerations

- ✅ Always use HTTPS
- ✅ Don't commit sensitive data
- ✅ Keep dependencies updated
- ✅ Use environment variables for API keys

---

Need help? Check the main README.md or reach out for support!
