# DNS Configuration for abeautifullifewithkoji.com

This guide provides specific DNS configuration steps for your domain **abeautifullifewithkoji.com** to work with GitHub Pages.

## Required DNS Records

You need to add the following DNS records in your domain registrar's control panel:

### A Records (Apex Domain)

These point your root domain to GitHub Pages servers:

| Type | Name/Host | Value/Points To | TTL |
|------|-----------|----------------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

### CNAME Record (WWW Subdomain)

This creates a www redirect:

| Type | Name/Host | Value/Points To | TTL |
|------|-----------|----------------|-----|
| CNAME | www | YOUR_GITHUB_USERNAME.github.io | 3600 |

**Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username!**

## Step-by-Step by Registrar

### Option 1: Namecheap

1. Log in to [Namecheap](https://www.namecheap.com)
2. Go to **Domain List** → Click **Manage** next to abeautifullifewithkoji.com
3. Click **Advanced DNS** tab
4. Under "Host Records":
   - Click **Add New Record**
   - Add each A record:
     - Type: `A Record`
     - Host: `@`
     - Value: `185.199.108.153`
     - TTL: `Automatic` or `3600`
   - Repeat for all 4 A records
   - Add CNAME record:
     - Type: `CNAME Record`
     - Host: `www`
     - Value: `YOUR_GITHUB_USERNAME.github.io.` (note the dot at the end)
     - TTL: `Automatic` or `3600`
5. Click **Save All Changes**

### Option 2: GoDaddy

1. Log in to [GoDaddy](https://www.godaddy.com)
2. Go to **My Products** → **DNS**
3. Find abeautifullifewithkoji.com and click **DNS**
4. Under "Records":
   - Click **Add** for each A record:
     - Type: `A`
     - Name: `@`
     - Value: `185.199.108.153`
     - TTL: `1 Hour`
   - Repeat for all 4 A records
   - Add CNAME record:
     - Type: `CNAME`
     - Name: `www`
     - Value: `YOUR_GITHUB_USERNAME.github.io`
     - TTL: `1 Hour`
5. Click **Save**

### Option 3: Cloudflare

1. Log in to [Cloudflare](https://www.cloudflare.com)
2. Select **abeautifullifewithkoji.com**
3. Go to **DNS** tab
4. Click **Add record** for each:
   - Add 4 A records:
     - Type: `A`
     - Name: `@`
     - IPv4 address: `185.199.108.153` (then 109, 110, 111)
     - Proxy status: **DNS only** (gray cloud) ⚠️ Important!
     - TTL: `Auto`
   - Add CNAME record:
     - Type: `CNAME`
     - Name: `www`
     - Target: `YOUR_GITHUB_USERNAME.github.io`
     - Proxy status: **DNS only** (gray cloud) ⚠️ Important!
     - TTL: `Auto`
5. Click **Save**

**⚠️ Cloudflare Important:** Set proxy status to "DNS only" (click the cloud to make it gray). Orange cloud will cause issues with GitHub Pages.

### Option 4: Google Domains

1. Log in to [Google Domains](https://domains.google.com)
2. Select **abeautifullifewithkoji.com**
3. Go to **DNS** tab
4. Under "Custom records":
   - Add A records:
     - Host name: `@`
     - Type: `A`
     - TTL: `3600`
     - Data: Add all 4 IP addresses (one per line or click + to add more):
       ```
       185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
       ```
   - Add CNAME record:
     - Host name: `www`
     - Type: `CNAME`
     - TTL: `3600`
     - Data: `YOUR_GITHUB_USERNAME.github.io.`
5. Click **Save**

### Option 5: Other Registrars

General steps for any domain registrar:

1. Log in to your domain control panel
2. Find DNS settings/management section
3. Look for "Add Record", "Manage Records", or "DNS Zone Editor"
4. Add the 4 A records and 1 CNAME record as specified above
5. Save changes

## Verification

### Check DNS Propagation

After adding DNS records, verify they're working:

**Command Line:**
```bash
# Check A records
dig abeautifullifewithkoji.com

# Check CNAME
dig www.abeautifullifewithkoji.com

# Alternative
nslookup abeautifullifewithkoji.com
```

**Online Tools:**
- https://www.whatsmydns.net/#A/abeautifullifewithkoji.com
- https://dnschecker.org/#A/abeautifullifewithkoji.com
- https://mxtoolbox.com/SuperTool.aspx?action=a%3aabeautifullifewithkoji.com

### Expected Results

**For abeautifullifewithkoji.com (A records):**
```
abeautifullifewithkoji.com. 3600 IN A 185.199.108.153
abeautifullifewithkoji.com. 3600 IN A 185.199.109.153
abeautifullifewithkoji.com. 3600 IN A 185.199.110.153
abeautifullifewithkoji.com. 3600 IN A 185.199.111.153
```

**For www.abeautifullifewithkoji.com (CNAME):**
```
www.abeautifullifewithkoji.com. 3600 IN CNAME YOUR_GITHUB_USERNAME.github.io.
```

## Timeline

| Step | Time Required |
|------|--------------|
| Add DNS records | 5 minutes |
| DNS propagation starts | Immediate |
| Partial propagation | 30 minutes - 2 hours |
| Full propagation | 2 - 48 hours |
| SSL certificate provisioning | +24 hours after DNS |

**Typical:** Most DNS changes are visible within 2-6 hours globally.

## Troubleshooting

### DNS Not Propagating
- **Wait longer:** DNS can take up to 48 hours
- **Clear DNS cache:** `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- **Try different network:** Mobile data vs WiFi

### Wrong IP Showing
- **Check DNS records:** Make sure you entered IPs correctly
- **Remove old records:** Delete any conflicting A or CNAME records
- **TTL issue:** Wait for old TTL to expire

### WWW Not Working
- **Check CNAME value:** Must be `YOUR_GITHUB_USERNAME.github.io` (with your actual username)
- **Trailing dot:** Some registrars require a dot at the end: `YOUR_GITHUB_USERNAME.github.io.`
- **Wait for propagation:** CNAME records also need time to propagate

### GitHub Pages Shows Error
- **"Domain not verified":** DNS records haven't propagated yet
- **"DNS check unsuccessful":** Verify A records are correct
- **"Certificate error":** Wait 24 hours after successful DNS check

## Security: Enable HTTPS

After DNS is configured and verified in GitHub Pages settings:

1. Go to your repo → **Settings** → **Pages**
2. Wait for "DNS check successful" message
3. Check **Enforce HTTPS**
4. Wait up to 24 hours for SSL certificate provisioning
5. Your site will be available at `https://abeautifullifewithkoji.com`

## Common Mistakes to Avoid

- ❌ Forgetting to replace `YOUR_GITHUB_USERNAME` with actual username
- ❌ Using Cloudflare proxy (orange cloud) - must be DNS only (gray cloud)
- ❌ Not waiting long enough for DNS propagation
- ❌ Having conflicting DNS records (check for old records!)
- ❌ Typos in IP addresses or domain names
- ❌ Wrong record type (A instead of CNAME or vice versa)

## Need Help?

If you encounter issues:
1. Double-check all DNS records match exactly
2. Wait at least 6 hours for propagation
3. Use online DNS checkers to verify propagation
4. Check GitHub Community: https://github.community/
5. Review GitHub Pages docs: https://docs.github.com/en/pages

---

**Next:** After DNS is configured and propagated, continue with [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) to enable HTTPS and verify your deployment!
