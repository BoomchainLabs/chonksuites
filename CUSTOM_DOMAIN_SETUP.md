# Custom Domain Setup for boomchainlab.com

## Step-by-Step Setup Guide

### 1. Disable Autoscaling (Required)
1. Go to your Replit project
2. Click on the "Hosting" tab
3. Turn OFF "Autoscaling" (this is mandatory for custom domains)
4. Wait for the change to take effect

### 2. Add Custom Domain in Replit
1. In the Hosting tab, look for "Custom Domain" section
2. Enter: `boomchainlab.com`
3. Replit will provide you with DNS records to configure

### 3. Configure DNS Records
You'll need to add these records to your domain provider (where you bought boomchainlab.com):

**For Root Domain (boomchainlab.com):**
- Type: A
- Name: @ (or blank)
- Value: [Replit will provide the IP address]

**For WWW Subdomain:**
- Type: CNAME
- Name: www
- Value: [Replit will provide the CNAME target]

### 4. SSL Certificate
- Replit automatically provides SSL certificates
- May take 24-48 hours to fully propagate
- Your site will be accessible via HTTPS

## Domain Provider Instructions

### If using Namecheap:
1. Login to Namecheap account
2. Go to Domain List → Manage
3. Advanced DNS tab
4. Add the A and CNAME records provided by Replit

### If using GoDaddy:
1. Login to GoDaddy account
2. My Products → DNS
3. Add the records in the DNS management section

### If using Cloudflare:
1. Login to Cloudflare
2. Select your domain
3. DNS tab → Add records
4. Turn OFF proxy (orange cloud) for initial setup

## Important Notes

1. **DNS Propagation**: Changes can take 24-48 hours to fully propagate worldwide
2. **No Autoscaling**: You lose automatic scaling but gain custom domain
3. **SSL**: Free SSL certificate included
4. **Email**: Set up email forwarding if needed through your domain provider

## Verification Steps

1. Wait for DNS propagation (check with dig or online DNS checkers)
2. Visit https://boomchainlab.com
3. Verify SSL certificate is working
4. Test all functionality on the new domain

## Troubleshooting

- **DNS not working**: Double-check records match exactly what Replit provided
- **SSL issues**: Wait 48 hours for certificate generation
- **Site not loading**: Verify Replit deployment is active

Your Chonk9k Suite will be accessible at https://boomchainlab.com once setup is complete!