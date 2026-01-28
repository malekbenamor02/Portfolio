# 🔧 Troubleshooting Guide

## ❌ 500 Errors on Login / API Routes

If you're seeing "Internal server error" when trying to login or access API routes, follow these steps:

### Step 1: Check Environment Variables

Make sure you have `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-random-secret-key
```

**Where to find these:**
1. Go to Supabase Dashboard
2. Settings → API
3. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Run Database Schema

The database tables need to be created first:

1. Go to Supabase Dashboard → **SQL Editor**
2. Open `supabase-schema.sql` from this project
3. Copy the entire contents
4. Paste into SQL Editor
5. Click **Run**

You should see: "Success. No rows returned"

### Step 3: Create Admin User

After running the schema, create your admin user:

```bash
npm run add-admin
```

Or manually via SQL (see `README_ADMIN.md`)

### Step 4: Deploy Environment Variables to Vercel

If you're deploying to Vercel:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_GA_ID` (optional)
4. **Redeploy** your project

### Step 5: Verify Database Tables Exist

In Supabase Dashboard → Table Editor, you should see:
- ✅ `users`
- ✅ `sessions`
- ✅ `projects`
- ✅ `experience`
- ✅ `blog_posts`
- ✅ `visitors`
- ✅ `unique_visitors`

If any are missing, run the schema again.

---

## 🔍 Error Messages Explained

### "Database not configured"
- **Cause**: Missing environment variables
- **Fix**: Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and Vercel

### "Database not set up. Please run the database schema first."
- **Cause**: Database tables don't exist
- **Fix**: Run `supabase-schema.sql` in Supabase SQL Editor

### "Invalid email or password"
- **Cause**: User doesn't exist or wrong password
- **Fix**: Run `npm run add-admin` to create admin user

### "Failed to fetch visitors" / "Failed to fetch projects"
- **Cause**: Database tables don't exist yet
- **Fix**: Run the database schema. The site will work with empty data until tables are created.

---

## ✅ Quick Checklist

- [ ] Supabase project created
- [ ] Database schema executed (`supabase-schema.sql`)
- [ ] Environment variables set in `.env.local`
- [ ] Environment variables set in Vercel (if deploying)
- [ ] Admin user created (`npm run add-admin`)
- [ ] Vercel project redeployed (if using Vercel)

---

## 🆘 Still Having Issues?

1. **Check Vercel logs**: Go to Vercel Dashboard → Your Project → Logs
2. **Check Supabase logs**: Go to Supabase Dashboard → Logs
3. **Test locally**: Run `npm run dev` and check console for errors
4. **Verify database connection**: Try querying tables in Supabase SQL Editor

---

## 📝 Common Issues

### Issue: "Cannot find module '@supabase/supabase-js'"
**Fix**: Run `npm install`

### Issue: Environment variables not loading
**Fix**: 
- Make sure file is named `.env.local` (not `.env`)
- Restart dev server after adding variables
- In Vercel, make sure variables are added to the correct environment (Production/Preview/Development)

### Issue: Login works locally but not on Vercel
**Fix**: 
- Check Vercel environment variables are set
- Make sure `JWT_SECRET` is the same in both places
- Redeploy after adding variables
