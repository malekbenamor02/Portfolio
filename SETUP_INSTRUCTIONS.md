# 🚀 Portfolio Setup Instructions

Complete guide to set up your portfolio with Supabase, Cloudflare, and Google Analytics.

---

## 📋 **Step 1: Supabase Setup**

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `portfolio-db` (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for project to be ready

### 1.2 Get Your Supabase Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **KEEP SECRET!**

### 1.3 Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Open the file `supabase-schema.sql` from this project
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. ✅ You should see "Success. No rows returned"

### 1.4 Create Your Admin User

**Option A: Using SQL (Recommended)**

1. Generate a password hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_PASSWORD', 12))"
   ```
   Replace `YOUR_PASSWORD` with your desired password.

2. In Supabase SQL Editor, run:
   ```sql
   INSERT INTO users (email, password_hash, name, role) 
   VALUES (
     'your-email@example.com',
     'PASTE_HASH_HERE',
     'Your Name',
     'admin'
   );
   ```

**Option B: Using the default (Change immediately!)**

The schema includes a default admin user. **Change the password immediately after first login!**

---

## 📋 **Step 2: Environment Variables**

1. Create `.env.local` file in project root:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your service role key)

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Google Analytics (get from Step 3)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

   # Visitor tracking salt (optional, random string)
   VISITOR_SALT=your-random-salt-string
   ```

2. **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Copy the output and paste as `JWT_SECRET` value

---

## 📋 **Step 3: Google Analytics Setup**

### 3.1 Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon) → **Create Property**
3. Fill in:
   - **Property name**: `Malek Ben Amor Portfolio`
   - **Reporting time zone**: Your timezone
   - **Currency**: Your currency
4. Click **Next** → **Next** → **Create**

### 3.2 Get Measurement ID

1. In your new property, go to **Admin** → **Data Streams**
2. Click **Add stream** → **Web**
3. Fill in:
   - **Website URL**: `https://malekbenamor.dev` (or your domain)
   - **Stream name**: `Portfolio Website`
4. Click **Create stream**
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)
6. Add to `.env.local` as `NEXT_PUBLIC_GA_ID`

### 3.3 Verify Installation

1. Start your dev server: `npm run dev`
2. Visit your site
3. Go to GA4 → **Reports** → **Realtime**
4. You should see yourself as an active user! ✅

---

## 📋 **Step 4: Cloudflare Setup**

### 4.1 Add Domain to Cloudflare

1. Go to [cloudflare.com](https://cloudflare.com) and sign up/login
2. Click **Add a Site**
3. Enter your domain: `malekbenamor.dev` (or your domain)
4. Click **Add site**
5. Choose **Free** plan
6. Click **Continue**

### 4.2 Update Nameservers

1. Cloudflare will show you **2 nameservers** (e.g., `ns1.cloudflare.com`)
2. Go to your domain registrar (where you bought the domain)
3. Find **DNS Settings** or **Nameservers**
4. Replace existing nameservers with Cloudflare's nameservers
5. Save and wait 5-30 minutes for propagation

### 4.3 Configure DNS Records

1. In Cloudflare dashboard, go to **DNS** → **Records**
2. Add these records:

   **For Vercel:**
   ```
   Type: A
   Name: @
   Content: 76.76.21.21 (or Vercel's IP - check Vercel dashboard)
   Proxy: 🟠 Proxied
   ```

   **OR use CNAME (recommended by Vercel):**
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   Proxy: 🟠 Proxied
   ```

   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy: 🟠 Proxied
   ```

3. Click **Save**

### 4.4 SSL/TLS Settings

1. Go to **SSL/TLS** in Cloudflare
2. Set **Encryption mode** to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

### 4.5 Configure Caching

1. Go to **Caching** → **Configuration**
2. Enable **Auto Minify**: JavaScript, CSS, HTML
3. Enable **Brotli** compression

### 4.6 Page Rules (Optional but Recommended)

1. Go to **Rules** → **Page Rules**
2. Create rule:

   **Rule 1: Cache Static Assets**
   ```
   URL: *malekbenamor.dev/images/*
   Settings:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 1 month
   ```

   **Rule 2: Bypass Admin**
   ```
   URL: *malekbenamor.dev/admin/*
   Settings:
   - Cache Level: Bypass
   - Security Level: High
   ```

   **Rule 3: Bypass API**
   ```
   URL: *malekbenamor.dev/api/*
   Settings:
   - Cache Level: Bypass
   ```

### 4.7 Security Settings

1. Go to **Security** → **Settings**
2. Set **Security Level**: Medium
3. Enable **Bot Fight Mode**
4. Go to **WAF** → Create rule:
   ```
   Rule: Rate Limit Login
   Path: /api/auth/login
   Requests: 5
   Period: 15 minutes
   Action: Block
   ```

### 4.8 Link Vercel to Cloudflare

1. In Vercel dashboard, go to your project
2. Go to **Settings** → **Domains**
3. Add your domain: `malekbenamor.dev`
4. Vercel will verify DNS (should work since Cloudflare is proxying)
5. ✅ Domain connected!

---

## 📋 **Step 5: Test Everything**

### 5.1 Test Database Connection

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/api/public/projects`
3. Should return: `{"projects":[]}` ✅

### 5.2 Test Authentication

1. Visit: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. Should redirect to dashboard ✅

### 5.3 Test Google Analytics

1. Visit your site
2. Check GA4 Realtime dashboard
3. Should see active user ✅

### 5.4 Test Cloudflare

1. Visit your site via domain (not localhost)
2. Check response headers (DevTools → Network)
3. Should see `cf-ray` header (Cloudflare) ✅

---

## 📋 **Step 6: Deploy to Vercel**

### 6.1 Push to GitHub

```bash
git add .
git commit -m "Add portfolio features: auth, admin, blog, analytics"
git push origin main
```

### 6.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_GA_ID`
   - `VISITOR_SALT` (optional)
4. Click **Deploy**
5. Wait for deployment to complete

### 6.3 Update Domain

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain (should already be configured in Cloudflare)
3. Vercel will automatically configure SSL

---

## ✅ **Checklist**

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Admin user created
- [ ] Environment variables set
- [ ] Google Analytics property created
- [ ] GA4 Measurement ID added
- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] Nameservers updated
- [ ] DNS records configured
- [ ] SSL/TLS set to Full (strict)
- [ ] Caching configured
- [ ] Security rules set
- [ ] Vercel deployment successful
- [ ] Domain connected
- [ ] Everything tested and working!

---

## 🆘 **Troubleshooting**

### Database Connection Error
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct (service_role, not anon)
- Verify Supabase project is active

### Authentication Not Working
- Check `JWT_SECRET` is set
- Verify admin user exists in database
- Check password hash is correct (bcrypt, 12 rounds)

### Google Analytics Not Tracking
- Check `NEXT_PUBLIC_GA_ID` is set
- Verify Measurement ID format: `G-XXXXXXXXXX`
- Check browser console for errors
- Use GA4 DebugView to verify events

### Cloudflare Not Working
- Verify nameservers are updated (can take up to 48 hours)
- Check DNS records are correct
- Ensure proxy is enabled (orange cloud)
- Verify SSL mode is "Full (strict)"

---

## 📚 **Next Steps**

1. **Add your first project** via admin dashboard
2. **Add your experience** entries
3. **Write your first blog post**
4. **Customize the admin dashboard** (optional)
5. **Monitor analytics** in GA4 and admin dashboard

---

**Need help?** Check the `PORTFOLIO_ENHANCEMENT_PLAN.md` for detailed architecture and implementation details.
