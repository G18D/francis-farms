# Supabase Storage Setup for Product Images

## Quick Setup (2 minutes)

Your admin panel is now configured to upload photos to Supabase Storage!

### 1. Create the Storage Bucket

1. Go to your **Supabase Dashboard**
2. Click **Storage** in the left sidebar
3. Click **New Bucket**
4. Bucket name: `product-images`
5. **Make it PUBLIC** ✓ (check the "Public bucket" option)
6. Click **Create Bucket**

### 2. Set Storage Policies (Optional but Recommended)

After creating the bucket, click on it and go to **Policies**:

```sql
-- Allow anyone to read product images (already public)
-- No policy needed for public buckets

-- Allow authenticated users to upload (if you add auth later)
-- For now, uploads work because you're using the anon key
```

### 3. Test It!

1. Go to your admin panel: `http://localhost:3000/admin`
2. Password: `francis2024`
3. Click **Photos** tab
4. Click on any product → **Upload Photo**
5. Select an image
6. Check Supabase → Storage → product-images → You should see the image!

---

## How It Works

**Before (localStorage):**
```
Admin uploads photo → Converted to base64 → Saved in localStorage
                                          → ❌ Lost on browser clear
                                          → ❌ Only on one computer
                                          → ❌ Huge file size
```

**Now (Supabase Storage):**
```
Admin uploads photo → Sent to Supabase Storage → ✅ Permanent cloud storage
                                                → ✅ Available on all devices
                                                → ✅ Optimized for web
                                                → ✅ CDN delivery
```

---

## Storage Limits (Free Tier)

- **1GB Storage** - Thousands of product images
- **2GB Bandwidth** - Plenty for a small farm
- **Automatic image optimization** via CDN

---

## Image URLs

After upload, images are available at:
```
https://nzessbozurpqchtjkakn.supabase.co/storage/v1/object/public/product-images/product-1.jpg
```

These URLs are automatically saved to your products and will show on the main shop page!

---

## Troubleshooting

**❌ "Upload failed"**
- Make sure the bucket is PUBLIC
- Check bucket name is exactly: `product-images`

**❌ "Bucket not found"**
- Go to Supabase → Storage → Create the bucket

**❌ Image doesn't show on site**
- Check if URL is saved in Supabase → Table Editor → orders
- Verify image uploaded to Storage → product-images

---

**That's it! Your product photos now live in the cloud! 📸☁️**
