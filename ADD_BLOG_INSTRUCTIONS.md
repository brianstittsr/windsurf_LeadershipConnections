# Add Health & Fitness Blog to Firebase - Instructions

## 🚀 Quick Start (3 Steps)

### **Step 1: Install Dependencies**

Run this command in your terminal:

```bash
npm install
```

This will install the `dotenv` package needed for the script.

---

### **Step 2: Deploy Firestore Rules** (CRITICAL!)

**You MUST do this first or the script will fail!**

1. Go to: **https://console.firebase.google.com/**
2. Select your **Leadership Connections** project
3. Click **Firestore Database** (left sidebar)
4. Click **Rules** tab (top)
5. **Copy ALL 189 lines** from your `firestore.rules` file
6. **Paste** into the Firebase Console editor
7. Click **"Publish"** button
8. Wait for "Rules published successfully" confirmation

---

### **Step 3: Run the Script**

In your terminal, run:

```bash
npm run add-blog
```

You should see:

```
🚀 Adding "Health and Fitness for Youth" blog to Firebase...

✅ SUCCESS! Blog article added to Firebase!
📄 Document ID: abc123xyz

🌐 View the article at:
   http://localhost:3000/blog/health-and-fitness-for-youth

⚙️  Manage in admin panel:
   http://localhost:3000/admin/blog-entries

✨ Done!
```

---

## ✅ Verification

After running the script:

1. **Visit the blog list:**
   - Go to: http://localhost:3000/blog
   - Should see "Why Health and Fitness Matter for Youth" card

2. **Visit the article:**
   - Go to: http://localhost:3000/blog/health-and-fitness-for-youth
   - Should display full article with images

3. **Check admin panel:**
   - Go to: http://localhost:3000/admin/blog-entries
   - Should see the article in the list

---

## 🚨 Troubleshooting

### **Error: "Missing or insufficient permissions"**

**Cause:** Firestore rules not deployed

**Fix:**
1. Go to Firebase Console
2. Deploy rules from `firestore.rules` file
3. Try running the script again

---

### **Error: "Firebase configuration is missing"**

**Cause:** `.env.local` file doesn't exist or is missing Firebase credentials

**Fix:**
1. Make sure `.env.local` file exists in project root
2. Verify it contains:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

---

### **Error: "Cannot find module 'dotenv'"**

**Cause:** Dependencies not installed

**Fix:**
```bash
npm install
```

---

### **Script runs but article doesn't appear**

**Possible causes:**

1. **Firestore rules not deployed**
   - Deploy rules from Firebase Console
   - Hard refresh browser: `Ctrl + Shift + R`

2. **Article already exists**
   - Check Firebase Console → Firestore → blogEntries collection
   - If duplicate exists, delete it and run script again

3. **Browser cache**
   - Hard refresh: `Ctrl + Shift + R`
   - Or clear browser cache

---

## 📋 What the Script Does

The script (`add-blog-to-firebase.js`):

1. ✅ Loads your Firebase configuration from `.env.local`
2. ✅ Connects to your Firestore database
3. ✅ Adds the complete "Health and Fitness for Youth" article with:
   - ID: 1
   - Slug: health-and-fitness-for-youth
   - Title, summary, full HTML content
   - Author info (TyG with image)
   - Tags (Health, Fitness)
   - Images embedded in content
   - Published status: true
4. ✅ Confirms successful addition
5. ✅ Provides links to view the article

---

## 🎯 Alternative: Manual Entry

If you prefer to add it manually via the admin panel:

1. Go to: http://localhost:3000/admin/blog-entries
2. Click "Add New Blog Entry"
3. Copy values from `QUICK_FIX_BLOG_ARTICLE.md`
4. Fill in all fields
5. Check "Published"
6. Click "Create"

---

## 📊 Summary

**What you need to do:**

1. ⚠️ **Install dependencies:** `npm install`
2. ⚠️ **Deploy Firestore rules** (Firebase Console)
3. ⚠️ **Run script:** `npm run add-blog`
4. ✅ **Verify article appears**

**Total time: ~5 minutes**

The article will be immediately available at `/blog/health-and-fitness-for-youth`! 🎉
