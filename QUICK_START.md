# 🚀 Francis Farms - Quick Start Guide

## What Was Just Set Up

✅ Supabase integration is **90% complete**!

### Files Created:
- ✅ `utils/supabase/server.ts` - Server-side Supabase client
- ✅ `utils/supabase/client.ts` - Browser Supabase client
- ✅ `utils/supabase/middleware.ts` - Middleware helper
- ✅ `app/api/send-confirmation/route.js` - Order confirmation API
- ✅ `app/api/send-sms/route.js` - SMS notification API
- ✅ `app/api/subscribe/route.js` - Newsletter/subscription API
- ✅ `app/api/orders/route.js` - Full order management API
- ✅ `.env.local` - Environment variables (needs your keys!)
- ✅ `SUPABASE_SETUP.md` - Complete setup instructions
- ✅ `test-supabase.js` - Connection test script

### Code Updated:
- ✅ `app/page.jsx` - Now saves orders to Supabase via API

---

## ⚡ 3-Minute Setup

### 1. Get Supabase Keys (2 min)

**Go to [supabase.com](https://supabase.com)**

1. Sign up → Create new project → Name: `francis-farms`
2. Go to **Settings** → **API**
3. Copy **Project URL**
4. Copy **service_role** key (the SECRET one, not anon!)

### 2. Update .env.local (30 sec)

Open `.env.local` and replace this line:
```
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

With your actual service role key from step 1.

### 3. Create Database Tables (30 sec)

In Supabase dashboard:
1. Click **SQL Editor** on left sidebar
2. Copy the SQL from `SUPABASE_SETUP.md` (Step 4)
3. Click **Run**

---

## ✅ Test It

```bash
# Test the connection
node test-supabase.js

# If all green ✅, start your app
npm run dev
```

Visit `http://localhost:3000`:
1. Add items to cart
2. Checkout → fill form
3. Place order
4. Check Supabase → Table Editor → orders 🎉

---

## 📋 What Happens Now When Someone Orders

**Before (localStorage):**
```
User → Places Order → Saved to localStorage → ❌ Lost on browser clear
```

**Now (Supabase):**
```
User → Places Order → API Route → Supabase Database → ✅ Permanent storage
                    ↓
              Confirmation email (coming soon)
                    ↓
              SMS notification (coming soon)
```

---

## 🔑 Environment Variables Needed

You need **3 keys** in `.env.local`:

| Variable | Where to Find | Status |
|----------|---------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings → API → Project URL | ✅ Already set |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Settings → API → anon public | ✅ Already set |
| `SUPABASE_SERVICE_KEY` | Supabase Settings → API → service_role | ⚠️ **YOU NEED TO SET THIS** |

---

## 🎯 Next Steps After Setup

### Must Do:
1. ✅ Set `SUPABASE_SERVICE_KEY` in `.env.local`
2. ✅ Run SQL to create tables (in Supabase SQL Editor)
3. ✅ Test with `node test-supabase.js`
4. ✅ Place a test order on your site

### Before Going Live:
1. Add same 3 env variables to Vercel
2. Set up real email service (Resend or SendGrid)
3. Set up Twilio for SMS (optional)
4. Update admin panel to use `/api/orders`

---

## 📞 Need Help?

All detailed instructions are in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Common Issues:**

❌ "Failed to save order"
→ Check `.env.local` has correct `SUPABASE_SERVICE_KEY`

❌ "Table does not exist"
→ Run the CREATE TABLE SQL in Supabase SQL Editor

❌ "Connection refused"
→ Make sure your Supabase project is running (not paused)

---

**That's it! You're 1 service role key away from having a fully-functional database! 🌿**
