# Deploying Hair-Rent Shop to Netlify

This guide will help you deploy your Hair-rent shop to Netlify and obtain an IP address for your hosting company.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket account)
- Netlify account (free tier available at https://netlify.com)
- Database hosting (recommended: Supabase free tier)

## Step 1: Set Up Database (Supabase - Free)

1. **Create Supabase Account**:
   - Go to https://supabase.com
   - Sign up for free account
   - Create a new project

2. **Get Database Connection String**:
   - In your Supabase project dashboard
   - Go to Settings → Database
   - Copy the "Connection string" under "Connection pooling"
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **Update Prisma Schema** (for production):
   - The schema will be updated to support PostgreSQL
   - Keep SQLite for local development

## Step 2: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   cd "/Users/curt/Desktop/CSA /Clients/Websites CSA Hosts /Hair-rent shop"
   git init
   git add .
   git commit -m "Initial commit for Netlify deployment"
   ```

2. **Push to GitHub**:
   - Create a new repository on GitHub
   - Follow GitHub's instructions to push your code:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/hair-rent-shop.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Netlify

### Option A: Deploy via GitHub (Recommended)

1. **Log in to Netlify**: https://app.netlify.com
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to Git provider**: Choose GitHub
4. **Select repository**: Choose your hair-rent-shop repository
5. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Show advanced" and add environment variables (see below)
6. **Click "Deploy site"**

### Option B: Drag and Drop Deploy (Quick Test)

1. **Build locally**:
   ```bash
   npm run build
   ```
2. **Go to Netlify**: https://app.netlify.com
3. **Drag the `.next` folder** to the Netlify drop zone

> **Note**: Option A is recommended for production as it enables continuous deployment.

## Step 4: Configure Environment Variables

In Netlify dashboard:
1. Go to **Site settings → Environment variables**
2. Add the following variables:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_WORDPRESS_URL` | Your WordPress URL | `https://hair-rent.co.za` |
| `WC_CONSUMER_KEY` | WooCommerce consumer key | `ck_xxxxxxxxxxxxx` |
| `WC_CONSUMER_SECRET` | WooCommerce consumer secret | `cs_xxxxxxxxxxxxx` |
| `DATABASE_URL` | Supabase connection string | `postgresql://postgres:...` |
| `EMAIL_HOST` | SMTP host (if using email) | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email password/app password | `your-app-password` |

3. **Trigger redeploy**: After adding variables, go to Deploys → Trigger deploy

## Step 5: Run Database Migrations

After deployment, you need to apply your Prisma schema to the Supabase database:

1. **Install Netlify CLI** (optional, for easier management):
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Run migrations locally** against production database:
   ```bash
   # Set DATABASE_URL to your Supabase connection string
   export DATABASE_URL="postgresql://postgres:..."
   npx prisma migrate deploy
   ```

   Or add a seed script if needed:
   ```bash
   npx prisma db push
   ```

## Step 6: Get IP Address for Hosting Company

1. **Get your Netlify URL**:
   - In Netlify dashboard, note your site URL (e.g., `hair-rent-shop.netlify.app`)

2. **Find the IP address**:
   ```bash
   # On Mac/Linux
   nslookup hair-rent-shop.netlify.app
   
   # Or use dig
   dig hair-rent-shop.netlify.app
   ```

3. **Netlify Load Balancer IPs**:
   Netlify uses a load balancer, so you may get multiple IPs. Common Netlify IPs include:
   - `75.2.60.5`
   - `99.83.190.102`
   
   **Important**: Netlify IPs can change. It's better to use:
   - **CNAME record**: Point your domain to `hair-rent-shop.netlify.app`
   - Or configure custom domain in Netlify (Settings → Domain management)

## Step 7: Custom Domain Setup (Optional)

1. **In Netlify Dashboard**:
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `shop.hair-rent.co.za`)

2. **Configure DNS** at your domain registrar:
   - Add a CNAME record pointing to your Netlify subdomain
   - Or use Netlify DNS for easier management

3. **Enable HTTPS**:
   - Netlify automatically provisions SSL certificates
   - Wait a few minutes for certificate to activate

## Step 8: Verify Deployment

1. **Visit your site**: Open the Netlify URL in a browser
2. **Test functionality**:
   - Products load from WooCommerce
   - Cart works correctly
   - Checkout process functions
   - Database operations work

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct build script

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure database migrations have been run

### Products Not Loading
- Verify `NEXT_PUBLIC_WORDPRESS_URL` is correct
- Check WooCommerce API keys are valid
- Test API connection in browser console

## Alternative Free Hosting Options

If Netlify doesn't work for your needs:

1. **Vercel** (https://vercel.com)
   - Built specifically for Next.js
   - Similar setup to Netlify
   - Free tier available

2. **Railway** (https://railway.app)
   - Includes database hosting
   - $5 free credit monthly
   - Easier database setup

3. **Render** (https://render.com)
   - Free tier for web services
   - Includes PostgreSQL database
   - Automatic SSL

## Cost Summary

- **Netlify**: Free tier (100GB bandwidth, 300 build minutes/month)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Total**: $0/month for small to medium traffic

## Support

For issues:
- Netlify docs: https://docs.netlify.com
- Supabase docs: https://supabase.com/docs
- Next.js deployment: https://nextjs.org/docs/deployment
