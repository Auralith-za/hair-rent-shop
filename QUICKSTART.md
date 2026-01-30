# Quick Start: Deploy Hair-Rent Shop to Netlify

## ✅ Completed
- [x] Netlify configuration created (`netlify.toml`)
- [x] Prisma schema updated for PostgreSQL
- [x] Git repository initialized and code committed
- [x] Deployment documentation created

## 🚀 Next Steps

### 1. Set Up Database (5 minutes)

**Option A: Supabase (Recommended - Free)**
1. Go to https://supabase.com and sign up
2. Create new project (choose a region close to you)
3. Wait for project to provision (~2 minutes)
4. Go to Settings → Database → Connection string
5. Copy the "Connection pooling" string (starts with `postgresql://`)
6. Save this - you'll need it for Netlify

**Option B: Neon (Alternative - Free)**
1. Go to https://neon.tech and sign up
2. Create new project
3. Copy the connection string
4. Save for Netlify setup

### 2. Push to GitHub (2 minutes)

```bash
# Create a new repository on GitHub (https://github.com/new)
# Name it: hair-rent-shop
# Then run these commands:

cd "/Users/curt/Desktop/CSA /Clients/Websites CSA Hosts /Hair-rent shop"
git remote add origin https://github.com/YOUR-USERNAME/hair-rent-shop.git
git push -u origin main
```

### 3. Deploy to Netlify (5 minutes)

1. **Go to Netlify**: https://app.netlify.com
2. **Sign up/Login** (can use GitHub account)
3. **Click**: "Add new site" → "Import an existing project"
4. **Choose**: GitHub
5. **Select**: your `hair-rent-shop` repository
6. **Build settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `.next`
7. **Click**: "Show advanced" → "New variable"
8. **Add environment variables**:

   | Variable | Where to get it |
   |----------|----------------|
   | `NEXT_PUBLIC_WORDPRESS_URL` | `https://hair-rent.co.za` |
   | `WC_CONSUMER_KEY` | From your `.env.local` file |
   | `WC_CONSUMER_SECRET` | From your `.env.local` file |
   | `DATABASE_URL` | From Supabase (Step 1) |
   | `EMAIL_HOST` | Your SMTP host (e.g., `smtp.gmail.com`) |
   | `EMAIL_PORT` | Usually `587` |
   | `EMAIL_USER` | Your email address |
   | `EMAIL_PASS` | Your email app password |

9. **Click**: "Deploy site"
10. **Wait**: 2-3 minutes for build to complete

### 4. Set Up Database Schema (2 minutes)

After deployment succeeds:

```bash
# Set your production database URL
export DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@..."

# Apply database schema
npx prisma db push
```

### 5. Get IP Address for Hosting Company

**Method 1: Using nslookup**
```bash
nslookup your-site-name.netlify.app
```

**Method 2: Using dig**
```bash
dig your-site-name.netlify.app
```

**Method 3: Netlify Load Balancer IPs**
Netlify uses these IP addresses (may vary):
- `75.2.60.5`
- `99.83.190.102`
- `13.248.212.111`

**⚠️ Important**: Netlify IPs can change. Better options:
- Use CNAME record pointing to `your-site.netlify.app`
- Or set up custom domain in Netlify (Settings → Domain management)

### 6. Test Your Deployment

1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Check products load correctly
3. Test cart functionality
4. Verify checkout works
5. Test admin panel

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Netlify
- Verify all environment variables are set
- Check for TypeScript errors

**Products not loading?**
- Verify `NEXT_PUBLIC_WORDPRESS_URL` is correct
- Check WooCommerce API keys are valid
- Test API in browser: `https://hair-rent.co.za/wp-json/wc/v3/products`

**Database errors?**
- Verify `DATABASE_URL` is correct
- Make sure you ran `npx prisma db push`
- Check Supabase project is active

## 📞 Need Help?

Refer to the detailed `DEPLOYMENT.md` guide in your project folder.

## ⏱️ Total Time: ~15 minutes
