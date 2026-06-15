# Francis Farms - Supabase Setup Guide

## ✅ Completed Steps

1. **Installed Supabase packages** ✓
   - `@supabase/supabase-js`
   - `@supabase/ssr`

2. **Created Supabase client helpers** ✓
   - `utils/supabase/server.ts` - For server-side components
   - `utils/supabase/client.ts` - For client-side components
   - `utils/supabase/middleware.ts` - For middleware

3. **Created API routes** ✓
   - `app/api/send-confirmation/route.js` - Saves orders to Supabase
   - `app/api/send-sms/route.js` - SMS notifications + order backup
   - `app/api/subscribe/route.js` - Newsletter & subscription management
   - `app/api/orders/route.js` - Full order CRUD operations

4. **Updated frontend** ✓
   - Modified `app/page.jsx` to use API routes for order placement

5. **Environment variables set up** ✓
   - `.env.local` created with placeholders

---

## 🚀 What You Need to Do Next

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**
   - Name: `francis-farms`
   - Database Password: Create a strong password (save it!)
   - Region: **US East (N. Virginia)** - closest to USVI
3. Wait ~2 minutes for project to be created

### Step 2: Get Your API Keys

1. In your Supabase dashboard, click **Settings** (gear icon) → **API**
2. Copy these two keys:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **service_role key** (under "Project API keys" - this is the SECRET one, not the anon key)

### Step 3: Update .env.local

Replace the placeholder in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nzessbozurpqchtjkakn.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_bzmzo3waDgQWJSivscAUNw_Vlxk3cGt
SUPABASE_SERVICE_KEY=paste_your_service_role_key_here
```

### Step 4: Create Database Tables

Go to **SQL Editor** in Supabase dashboard and run this SQL:

```sql
-- Orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  delivery_date TEXT,
  delivery_slot TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  referral_code TEXT UNIQUE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  email TEXT PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (weekly boxes)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  box_id TEXT,
  frequency TEXT DEFAULT 'weekly',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_customers_email ON customers(email);
```

### Step 5: Set Row Level Security (Optional but Recommended)

In Supabase SQL Editor, run:

```sql
-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (your API uses service role key)
CREATE POLICY "Service role has full access to orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to customers" ON customers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to subscribers" ON subscribers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');
```

### Step 6: Deploy to Vercel

Add the same environment variables to Vercel:

1. Go to your project on [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Add these three:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_KEY`

### Step 7: Test Locally

```bash
# Restart your dev server to load new env variables
npm run dev
```

Visit `http://localhost:3000` and:
1. Add items to cart
2. Go to checkout
3. Fill in delivery info
4. Place an order

Then check your Supabase dashboard → Table Editor → orders to see the new order!

---

## 📊 How It Works Now

### Order Flow:
1. User fills out checkout form on website
2. Clicks "Place Order"
3. `app/page.jsx` calls `/api/send-confirmation`
4. API route saves order to Supabase `orders` table
5. API route also updates/creates customer in `customers` table
6. Confirmation returned to user
7. `/api/send-sms` called for SMS notification (placeholder for now)

### Data Storage:
- **Orders**: All order data saved to Supabase `orders` table
- **Customers**: Customer info saved to `customers` table (upsert on email)
- **Subscribers**: Newsletter signups go to `subscribers` table
- **Subscriptions**: Weekly box subscriptions in `subscriptions` table

### API Routes Available:
- `POST /api/send-confirmation` - Save order + send confirmation
- `POST /api/send-sms` - Send SMS notification (TODO: integrate Twilio)
- `POST /api/subscribe` - Newsletter or subscription signup
- `GET /api/orders` - Fetch orders (optionally filter by email or ID)
- `POST /api/orders` - Create new order
- `PATCH /api/orders` - Update order status

---

## 🎯 Next Steps (Optional Enhancements)

1. **Email Notifications**
   - Set up [Resend](https://resend.com) or SendGrid
   - Update `/api/send-confirmation` to send real emails

2. **SMS Notifications**
   - Set up [Twilio](https://twilio.com)
   - Update `/api/send-sms` to send real SMS messages

3. **Admin Dashboard Integration**
   - Update `app/admin/page.jsx` to load orders from Supabase
   - Use the `/api/orders` endpoints

4. **Order Tracking**
   - Update tracking feature to fetch real order status from Supabase
   - Add status update functionality in admin panel

---

## 🆓 Free Tier Limits

Supabase free tier includes:
- **500MB Database** - Thousands of orders
- **2GB Bandwidth** - More than enough for a small farm
- **50,000 Monthly Active Users**
- **500MB File Storage** (for product images if you add that later)

Perfect for Francis Farms to get started! 🌿
