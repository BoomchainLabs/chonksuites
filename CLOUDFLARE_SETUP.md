# Setup boomchainlab.com with Cloudflare DNS

## Step 1: Get DNS Records from Replit
1. Go to your Replit project → "Hosting" tab
2. Turn OFF "Autoscaling" (required for custom domains)
3. In "Custom Domain" section, enter: `boomchainlab.com`
4. Click "Add Domain"
5. Replit will show you DNS records - keep this tab open!

## Step 2: Configure Cloudflare DNS
1. Login to cloudflare.com
2. Select `boomchainlab.com` from your dashboard
3. Go to **DNS** → **Records**

## Step 3: Add DNS Records
Delete any existing A or CNAME records for @ and www, then add:

### A Record (Root domain):
```
Type: A
Name: @
IPv4 address: [Copy IP from Replit]
Proxy status: DNS only (gray cloud - IMPORTANT!)
TTL: Auto
```

### CNAME Record (www subdomain):
```
Type: CNAME
Name: www
Target: [Copy CNAME target from Replit]
Proxy status: DNS only (gray cloud - IMPORTANT!)
TTL: Auto
```

## Step 4: Important Cloudflare Settings
- **Turn OFF the orange cloud proxy** (use gray cloud "DNS only")
- This is crucial for initial setup
- You can enable proxy later after domain is working

## Step 5: Verification
1. Wait 5-15 minutes for DNS propagation
2. Visit: http://boomchainlab.com
3. Visit: http://www.boomchainlab.com
4. Both should show your Chonk9k Suite

## Step 6: Enable SSL (After domain works)
1. In Cloudflare → SSL/TLS tab
2. Set encryption mode to "Full"
3. Your site will be accessible at https://boomchainlab.com

## Cloudflare-Specific Tips:
- **Gray cloud first**: Always use "DNS only" for initial setup
- **Orange cloud later**: Enable proxy after domain works
- **SSL**: Cloudflare + Replit both provide SSL
- **Cache**: Clear Cloudflare cache if changes don't appear

## What the Records Look Like:
Replit will give you something like:
- **A Record IP**: `35.190.XXX.XXX`
- **CNAME Target**: `your-repl-name.replit.app`

## Troubleshooting:
- **Not working?** Make sure proxy is OFF (gray cloud)
- **SSL errors?** Wait 30 minutes for certificates
- **Still issues?** Check Cloudflare's DNS propagation tool

Your Chonk9k Suite will be live at boomchainlab.com within 15 minutes!