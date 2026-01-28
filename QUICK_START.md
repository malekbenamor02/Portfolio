# ⚡ Quick Start Guide

## 🎯 What You Need to Do

### 1. **Supabase - Run This SQL**

Go to Supabase → SQL Editor → Paste and run:

```sql
-- Copy the entire contents of supabase-schema.sql
-- Or run it directly from the file
```

**Then create your admin user:**
```sql
-- Generate password hash first (run in terminal):
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_PASSWORD', 12))"

INSERT INTO users (email, password_hash, name, role) 
VALUES (
  'your-email@example.com',
  'PASTE_BCRYPT_HASH_HERE',
  'Your Name',
  'admin'
);
```

### 2. **Environment Variables**

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=generate-random-string-here
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. **Google Analytics**

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property → Add web stream
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Add to `.env.local` as `NEXT_PUBLIC_GA_ID`

### 4. **Cloudflare**

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update nameservers at your registrar
4. Configure DNS:
   - Type: CNAME
   - Name: @
   - Target: cname.vercel-dns.com
   - Proxy: 🟠 ON
5. SSL/TLS → Full (strict)
6. Caching → Auto Minify: ON

### 5. **Deploy**

```bash
git add .
git commit -m "Add portfolio features"
git push
```

Add environment variables in Vercel dashboard, then deploy!

---

## 📝 **Full Instructions**

See `SETUP_INSTRUCTIONS.md` for detailed step-by-step guide.

---

## ✅ **What's Been Implemented**

- ✅ Database schema (Supabase)
- ✅ Authentication system (JWT)
- ✅ Admin API routes (projects, experience, posts)
- ✅ Public API routes
- ✅ Visitor tracking
- ✅ Google Analytics integration
- ✅ SEO setup (sitemap, metadata)
- ✅ Visitor counter component

---

## 🚀 **Next Steps**

1. Run Supabase SQL
2. Set environment variables
3. Test locally: `npm run dev`
4. Login at `/admin/login`
5. Add your first project!
6. Deploy to Vercel
