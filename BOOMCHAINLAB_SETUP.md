# Setup boomchainlab.com for Chonk9k Suite

## Step 1: Disable Autoscaling in Replit
1. Go to your Replit project hosting tab
2. Click the toggle to DISABLE "Autoscaling"
3. Wait for the change to apply (you'll see the toggle turn off)

## Step 2: Add Custom Domain in Replit
1. In the same Hosting tab, find "Custom Domain" section
2. Enter: `boomchainlab.com`
3. Click "Add Domain" or "Connect Domain"
4. Replit will show you DNS records to configure

## Step 3: Configure DNS (Choose Your Provider)

### If your domain is with Namecheap:
1. Login to namecheap.com
2. Go to "Domain List" → Click "Manage" next to boomchainlab.com
3. Click "Advanced DNS" tab
4. Delete any existing A records and CNAME records for @ and www
5. Add these new records (replace with actual values from Replit):

```
Type: A
Host: @
Value: [IP address from Replit]
TTL: Automatic

Type: CNAME  
Host: www
Value: [CNAME target from Replit]
TTL: Automatic
```

### If your domain is with GoDaddy:
1. Login to godaddy.com
2. Go to "My Products" → "All Products and Services" → "Domains"
3. Click DNS next to boomchainlab.com
4. Add/modify these records:

```
Type: A
Name: @
Value: [IP address from Replit]
TTL: 1 hour

Type: CNAME
Name: www
Value: [CNAME target from Replit]  
TTL: 1 hour
```

### If your domain is with Cloudflare:
1. Login to cloudflare.com
2. Select boomchainlab.com from your dashboard
3. Go to DNS → Records
4. Add these records (turn OFF the orange cloud proxy initially):

```
Type: A
Name: @
IPv4 address: [IP address from Replit]
Proxy status: DNS only (gray cloud)

Type: CNAME
Name: www
Target: [CNAME target from Replit]
Proxy status: DNS only (gray cloud)
```

## Step 4: Verification
After DNS changes (wait 15-30 minutes):
1. Visit http://boomchainlab.com
2. Visit http://www.boomchainlab.com  
3. Both should redirect to your Chonk9k Suite

## What Replit Will Provide
When you add the domain, Replit will give you something like:
- **A Record IP**: Usually something like `35.190.XXX.XXX`
- **CNAME Target**: Usually something like `your-repl.replit.app`

## Important Notes
- DNS changes take 15 minutes to 2 hours to propagate
- SSL certificate will be automatically provided by Replit
- Your app will be accessible at https://boomchainlab.com
- Make sure to update any hardcoded URLs in your app if needed

## Need Help?
If you get stuck on any step, let me know:
1. Which domain provider you're using
2. What step you're on
3. Any error messages you see

Your Chonk9k Suite will be live at boomchainlab.com once complete!