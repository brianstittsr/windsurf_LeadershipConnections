# Vercel Environment Variables Setup

## 🚨 **CRITICAL: Add Firebase Environment Variables to Vercel**

Your deployment is successful but Firebase is not configured in production. You need to add environment variables to Vercel.

---

## 📋 **Required Environment Variables**

### **Firebase Client Configuration (Required for Frontend)**

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **Firebase Admin Configuration (Required for API Routes)**

```
FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"
```

### **Email Configuration (Optional - for welcome emails)**

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### **OpenAI Configuration (Optional - for content generation)**

```
OPENAI_API_KEY=sk-your_openai_key_here
```

### **Site URL**

```
NEXT_PUBLIC_SITE_URL=https://www.ncleadconnect.org
```

---

## 🔧 **How to Add Environment Variables to Vercel**

### **Method 1: Using Vercel Dashboard (Easiest)**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project: `LeadershipConnections`

2. **Navigate to Settings:**
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in the left sidebar

3. **Add Each Variable:**
   - Click **"Add New"** button
   - Enter **Name** (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Enter **Value** (paste the value from your local `.env.local`)
   - Select **Environment:** Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

4. **Repeat for All Variables:**
   - Add all Firebase variables (6 client + 2 admin)
   - Add SMTP variables (4 variables) - optional
   - Add OpenAI key (1 variable) - optional
   - Add Site URL (1 variable)

5. **Redeploy:**
   - After adding all variables, go to **"Deployments"** tab
   - Click the **three dots (⋮)** on the latest deployment
   - Click **"Redeploy"**
   - Check **"Use existing Build Cache"** (faster)
   - Click **"Redeploy"**

---

### **Method 2: Using Vercel CLI**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste the value when prompted
# Select: Production, Preview, Development

# Repeat for all variables...

# Redeploy
vercel --prod
```

---

## 📝 **Where to Find Your Firebase Values**

### **Firebase Client Config:**

1. Go to: https://console.firebase.google.com/
2. Select your project: **ncleadconnect-donor**
3. Click **⚙️ Settings** → **Project settings**
4. Scroll down to **"Your apps"** section
5. Find your web app and click **"Config"**
6. Copy all the values from `firebaseConfig` object

### **Firebase Admin Config:**

1. In Firebase Console, go to **⚙️ Settings** → **Project settings**
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Download the JSON file
5. Open the file and copy:
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

---

## ⚠️ **Important Notes**

### **For FIREBASE_PRIVATE_KEY:**
- Keep the quotes around the entire key
- Keep the `\n` characters (newlines)
- Example format:
  ```
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
  ```

### **For NEXT_PUBLIC_ Variables:**
- These are exposed to the browser (client-side)
- They are safe to expose (Firebase API keys are meant to be public)
- They are restricted by Firebase Security Rules

### **For Private Variables (no NEXT_PUBLIC_ prefix):**
- These are server-side only
- Never exposed to the browser
- Keep them secure

---

## ✅ **Verification Steps**

After adding environment variables and redeploying:

1. **Check Browser Console:**
   - Should NOT see: "Firebase configuration is incomplete"
   - Should NOT see: "Cannot read properties of null"

2. **Test Authentication:**
   - Try signing in at: https://www.ncleadconnect.org/signin
   - Should work without errors

3. **Test Database:**
   - Homepage should load content from Firestore
   - Member directory should display members

4. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment
   - Check logs for any warnings

---

## 🚀 **Quick Checklist**

- [ ] Added all 6 Firebase client variables (NEXT_PUBLIC_*)
- [ ] Added 2 Firebase admin variables (FIREBASE_*)
- [ ] Added NEXT_PUBLIC_SITE_URL
- [ ] Added SMTP variables (optional)
- [ ] Added OPENAI_API_KEY (optional)
- [ ] Redeployed the application
- [ ] Tested the live site
- [ ] No console errors in browser
- [ ] Authentication works
- [ ] Database queries work

---

## 📞 **Need Help?**

If you encounter issues:
1. Check Vercel deployment logs for errors
2. Check browser console for client-side errors
3. Verify all environment variable names are correct (case-sensitive)
4. Ensure FIREBASE_PRIVATE_KEY has proper formatting with `\n`
5. Make sure you redeployed after adding variables

---

**Once environment variables are added, your site will work perfectly!** 🎉
