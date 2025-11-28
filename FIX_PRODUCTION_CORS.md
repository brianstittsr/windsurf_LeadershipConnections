# Fix Production CORS - URGENT

## 🚨 **Issue**

Image uploads are failing on **https://www.ncleadconnect.org** because Firebase Storage CORS is not configured for your production domain.

**Error:**
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'https://www.ncleadconnect.org' 
has been blocked by CORS policy
```

---

## ✅ **Solution: Apply CORS Configuration**

### **Step 1: Open PowerShell as Administrator**

1. Press `Windows Key`
2. Type "PowerShell"
3. Right-click "Windows PowerShell"
4. Select **"Run as Administrator"**

### **Step 2: Navigate to Project**

```powershell
cd "c:\Users\Buyer\Documents\CascadeProjects\LeadershipConnections"
```

### **Step 3: Apply CORS Configuration**

```powershell
gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app
```

### **Step 4: Verify CORS Configuration**

```powershell
gsutil cors get gs://ncleadconnect-donor.firebasestorage.app
```

**Expected Output:**
```json
[
  {
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://www.ncleadconnect.org",
      "https://ncleadconnect.org"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 🔧 **Alternative: Using Google Cloud Console**

If gsutil doesn't work, use the Google Cloud Console:

### **Option 1: Cloud Shell (Easiest)**

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Select Project:**
   - Click project dropdown
   - Select "ncleadconnect-donor"

3. **Open Cloud Shell:**
   - Click the terminal icon (top right)
   - Wait for shell to load

4. **Upload cors.json:**
   - Click "Upload file" button
   - Select `cors.json` from your computer

5. **Apply CORS:**
   ```bash
   gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app
   ```

6. **Verify:**
   ```bash
   gsutil cors get gs://ncleadconnect-donor.firebasestorage.app
   ```

### **Option 2: Firebase Console Storage Rules**

1. **Go to Firebase Console:**
   - https://console.firebase.google.com/

2. **Select Project:**
   - ncleadconnect-donor

3. **Go to Storage:**
   - Click "Storage" in left menu
   - Click "Rules" tab

4. **Update Rules:**
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

5. **Publish Rules**

**Note:** This fixes permissions but you still need CORS configuration via gsutil.

---

## 📋 **Updated cors.json**

The file has been updated to include your production domain:

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://www.ncleadconnect.org",
      "https://ncleadconnect.org"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

---

## ⚡ **Quick Fix Commands**

**Run PowerShell as Administrator, then:**

```powershell
# Navigate to project
cd "c:\Users\Buyer\Documents\CascadeProjects\LeadershipConnections"

# Authenticate (if needed)
gcloud auth login

# Set project
gcloud config set project ncleadconnect-donor

# Apply CORS
gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app

# Verify
gsutil cors get gs://ncleadconnect-donor.firebasestorage.app
```

---

## 🧪 **After Applying CORS**

1. **Wait 1-2 minutes** for changes to propagate
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Hard refresh** the page (Ctrl+Shift+R)
4. **Try uploading photo again**

---

## ✅ **Success Indicators**

You'll know it's fixed when:

1. ✅ No CORS errors in browser console
2. ✅ "Uploading..." changes to "Upload Photo"
3. ✅ Photo appears in profile
4. ✅ Success message shows

---

## 🚨 **If gsutil Command Not Found**

**Install Google Cloud SDK:**

1. Download: https://cloud.google.com/sdk/docs/install
2. Install for Windows
3. Restart PowerShell
4. Run: `gcloud init`
5. Authenticate: `gcloud auth login`
6. Try CORS commands again

---

## 📞 **Troubleshooting**

### **Error: Permission Denied**
- Run PowerShell as Administrator
- Or use Google Cloud Console Cloud Shell

### **Error: Bucket Not Found**
- Verify bucket name: `ncleadconnect-donor.firebasestorage.app`
- Check project is set: `gcloud config get-value project`

### **CORS Still Not Working**
- Wait 2-5 minutes for propagation
- Clear browser cache completely
- Try incognito mode
- Check browser console for different error

---

## 🎯 **Why This Happened**

The original `cors.json` only had localhost domains:
```json
"origin": ["http://localhost:3000", "http://localhost:3001"]
```

Your production site `https://www.ncleadconnect.org` was not included, so Firebase Storage blocked the requests.

Now it includes:
```json
"origin": [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.ncleadconnect.org",
  "https://ncleadconnect.org"
]
```

---

## 🚀 **Next Steps**

1. **Run the gsutil command as Administrator**
2. **Wait 1-2 minutes**
3. **Test photo upload on production**
4. **Commit updated cors.json to git**

---

**This will fix your image upload issue on both localhost and production!** 🎉
