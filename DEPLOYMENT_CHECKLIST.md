# 🚀 Deployment Checklist

## Pre-Deployment Checks

### 1. **Local Build Test** ✅
Always test the build locally before pushing:
```bash
npm run build
```

**Expected Result:** Build completes without errors

**Common Issues:**
- Missing environment variables
- TypeScript errors
- Import errors
- API initialization errors

---

### 2. **Environment Variables**

#### **Required for Build:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

#### **Optional (won't break build):**
```env
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
PAYPAL_CLIENT_SECRET=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

---

### 3. **Git Status Check**
```bash
git status
git log --oneline -5
```

Ensure all changes are committed and pushed.

---

## Deployment Process

### **Step 1: Push to GitHub**
```bash
git add -A
git commit -m "Your commit message"
git push origin main
```

### **Step 2: Monitor Vercel Deployment**

#### **Option A: Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Find your project: `ncleadconnect-donor` or similar
3. Click on the latest deployment
4. Monitor build progress
5. Check logs if build fails

#### **Option B: Vercel CLI** (if installed)
```bash
vercel --prod
```

Or check deployment status:
```bash
vercel ls
```

---

## Troubleshooting Build Failures

### **Common Build Errors:**

#### **1. Environment Variables Missing**
**Error:** `process.env.NEXT_PUBLIC_FIREBASE_API_KEY is undefined`

**Fix:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add missing variables
3. Redeploy

#### **2. TypeScript Errors**
**Error:** `Type 'X' is not assignable to type 'Y'`

**Fix:**
1. Fix TypeScript errors locally
2. Run `npm run build` to verify
3. Commit and push

#### **3. Import Errors**
**Error:** `Module not found: Can't resolve '@/...'`

**Fix:**
1. Check import paths
2. Ensure files exist
3. Check `tsconfig.json` paths configuration

#### **4. API Initialization Errors**
**Error:** `Neither apiKey nor config.authenticator provided`

**Fix:**
1. Add conditional initialization (already done for Stripe/OpenAI)
2. Check that API clients handle missing keys gracefully
3. Return 503 Service Unavailable when API not configured

---

## Post-Deployment Verification

### **1. Check Deployment URL**
Visit your production URL:
```
https://www.ncleadconnect.org
```

### **2. Test Critical Pages**
- [ ] Home page loads
- [ ] Sign in works
- [ ] Admin pages load (for admins)
- [ ] Blog posts display
- [ ] Events calendar works
- [ ] Past events page loads
- [ ] Forms work
- [ ] Member directory accessible

### **3. Check Console for Errors**
Open browser DevTools → Console
- Should have no critical errors
- Warnings are okay if they don't affect functionality

### **4. Test Dynamic Features**
- [ ] Firebase data loads
- [ ] Authentication works
- [ ] Forms submit successfully
- [ ] Admin CRUD operations work

---

## Rollback Process

If deployment has critical issues:

### **Option 1: Revert in Vercel**
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → Promote to Production

### **Option 2: Git Revert**
```bash
# Find the commit to revert to
git log --oneline

# Revert to specific commit
git revert <commit-hash>
git push origin main
```

### **Option 3: Quick Fix**
1. Fix the issue locally
2. Test with `npm run build`
3. Commit and push immediately

---

## Deployment History

### **Recent Successful Deployments:**

**2025-11-30 - LC Past Events Migration**
- ✅ Migrated past events to Firebase
- ✅ Added AI article generation
- ✅ Updated Firestore rules
- ✅ Fixed Stripe/OpenAI initialization errors
- ✅ Build completed successfully

**Key Changes:**
- Removed static data dependency
- Added conditional API initialization
- Updated environment variables template
- Deployed Firestore rules

---

## Environment Variables Setup in Vercel

### **How to Add Environment Variables:**

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select Your Project**
   - Click on project name

3. **Go to Settings**
   - Click "Settings" tab

4. **Environment Variables**
   - Click "Environment Variables" in sidebar

5. **Add Variables**
   - Click "Add New"
   - Enter variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Enter value
   - Select environments: Production, Preview, Development
   - Click "Save"

6. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

### **Important Notes:**
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are server-side only
- Changes require redeployment to take effect
- Never commit `.env.local` to Git

---

## Continuous Integration Best Practices

### **Before Every Push:**
1. ✅ Run `npm run build` locally
2. ✅ Check for TypeScript errors
3. ✅ Test critical functionality
4. ✅ Review changed files
5. ✅ Write clear commit message

### **After Every Push:**
1. ✅ Monitor Vercel deployment
2. ✅ Check build logs
3. ✅ Test production site
4. ✅ Verify no console errors

### **Weekly Maintenance:**
1. ✅ Review Vercel analytics
2. ✅ Check for dependency updates
3. ✅ Review error logs
4. ✅ Test all major features

---

## Quick Reference Commands

### **Local Development:**
```bash
npm run dev          # Start dev server
npm run build        # Test production build
npm run start        # Start production server locally
npm run lint         # Check for linting errors
```

### **Git Commands:**
```bash
git status           # Check current status
git add -A           # Stage all changes
git commit -m "msg"  # Commit with message
git push origin main # Push to GitHub
git log --oneline -5 # View recent commits
```

### **Firebase Commands:**
```bash
firebase login                    # Login to Firebase
firebase deploy --only firestore:rules  # Deploy Firestore rules
firebase deploy --only hosting    # Deploy hosting
```

### **Migration Scripts:**
```bash
npm run migrate-past-events   # Migrate past events
npm run migrate-past-classes  # Migrate past classes
npm run migrate-blogs         # Migrate blog posts
```

---

## Support Resources

### **Documentation:**
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Firebase: https://firebase.google.com/docs

### **Project-Specific Guides:**
- `PAYMENT_SETUP_GUIDE.md` - Payment integration
- `PAST_EVENTS_MIGRATION_GUIDE.md` - Events migration
- `PAST_CLASSES_SETUP.md` - Classes setup
- `VERCEL_ENV_SETUP.md` - Environment variables

---

## Current Build Status

**Last Successful Build:** 2025-11-30
**Commit:** `9dbb5a8` - Switch migration script to Firebase Admin SDK
**Build Time:** ~2-3 minutes
**Status:** ✅ All systems operational

**Active Features:**
- ✅ Firebase authentication
- ✅ Firestore database
- ✅ Blog system
- ✅ Events calendar
- ✅ Past events (Firebase)
- ✅ Past classes (Firebase)
- ✅ Member directory
- ✅ Forms system
- ✅ Admin dashboard
- ⚠️ Payment system (requires API keys)
- ⚠️ AI features (requires OpenAI key)

---

**Last Updated:** November 30, 2025
**Maintained By:** Development Team
**Project:** Leadership Connections Website
