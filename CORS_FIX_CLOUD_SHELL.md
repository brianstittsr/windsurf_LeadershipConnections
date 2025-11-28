# Fix CORS Using Google Cloud Console - EASIEST METHOD

## 🎯 **Use Google Cloud Console Cloud Shell** (No Admin Required!)

This method works 100% and doesn't require admin privileges on your computer.

---

## 📋 **Step-by-Step Instructions**

### **Step 1: Open Google Cloud Console**

1. Go to: **https://console.cloud.google.com/**
2. Sign in with your Google account (the one that has access to the Firebase project)

### **Step 2: Select Your Project**

1. Click the **project dropdown** at the top
2. Select: **ncleadconnect-donor**

### **Step 3: Open Cloud Shell**

1. Look for the **terminal icon** in the top-right corner (looks like `>_`)
2. Click it to open Cloud Shell
3. Wait for the shell to initialize (takes 5-10 seconds)

### **Step 4: Upload cors.json**

1. In Cloud Shell, click the **three dots menu** (⋮) in the top-right
2. Select **"Upload"**
3. Click **"Choose Files"**
4. Navigate to: `c:\Users\Buyer\Documents\CascadeProjects\LeadershipConnections\`
5. Select **`cors.json`**
6. Click **"Upload"**

### **Step 5: Apply CORS Configuration**

In the Cloud Shell terminal, type this command:

```bash
gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app
```

Press **Enter**

### **Step 6: Verify CORS Configuration**

Run this command to verify:

```bash
gsutil cors get gs://ncleadconnect-donor.firebasestorage.app
```

**Expected Output:**
```json
[
  {
    "maxAgeSeconds": 3600,
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://www.ncleadconnect.org",
      "https://ncleadconnect.org"
    ]
  }
]
```

---

## ✅ **Success!**

If you see the output above, CORS is now configured correctly!

---

## 🧪 **Test Image Upload**

1. **Wait 1-2 minutes** for changes to propagate
2. Go to: **https://www.ncleadconnect.org/admin/lc-profile**
3. **Clear browser cache**: Ctrl+Shift+Delete
4. **Hard refresh**: Ctrl+Shift+R
5. **Try uploading a photo**
6. It should now work! ✅

---

## 📸 **Visual Guide**

### **Cloud Shell Location:**
```
┌─────────────────────────────────────────────┐
│  Google Cloud Console                   >_  │ ← Click this icon
└─────────────────────────────────────────────┘
```

### **Upload Button:**
```
Cloud Shell Terminal
┌─────────────────────────────────────────────┐
│  $ _                                    ⋮   │ ← Click three dots
│                                             │
│  Options:                                   │
│  - Upload                                   │ ← Select this
│  - Download                                 │
└─────────────────────────────────────────────┘
```

---

## 🔍 **Troubleshooting**

### **Issue: Can't find Cloud Shell icon**
- Look for `>_` symbol in top-right corner
- Or go to: https://shell.cloud.google.com/

### **Issue: Wrong project selected**
- Click project dropdown at top
- Search for "ncleadconnect-donor"
- Click to select it

### **Issue: Upload button not visible**
- Click the **three dots** (⋮) in Cloud Shell
- Select "Upload" from menu

### **Issue: Command not found**
- Make sure you're in Cloud Shell (not local terminal)
- Cloud Shell has gsutil pre-installed

### **Issue: Permission denied**
- Make sure you're signed in with the correct Google account
- Account must have Owner or Editor role on the project

---

## 🎉 **Why This Method Works**

- ✅ No admin privileges needed on your computer
- ✅ gsutil is pre-installed in Cloud Shell
- ✅ Already authenticated with your Google account
- ✅ Direct access to Firebase Storage
- ✅ Works from any computer

---

## 📝 **Quick Reference**

**Cloud Console:** https://console.cloud.google.com/  
**Project:** ncleadconnect-donor  
**Bucket:** gs://ncleadconnect-donor.firebasestorage.app  
**File to upload:** cors.json  

**Command:**
```bash
gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app
```

---

## 🚀 **After CORS is Applied**

Your image uploads will work on:
- ✅ http://localhost:3000 (development)
- ✅ http://localhost:3001 (development)
- ✅ https://www.ncleadconnect.org (production)
- ✅ https://ncleadconnect.org (production)

---

**This is the easiest and most reliable method!** 🎯
