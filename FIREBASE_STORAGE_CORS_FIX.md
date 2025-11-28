# Firebase Storage CORS Error - Fix Guide

## 🚨 **Error**

```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
It does not have HTTP ok status.
```

## 🎯 **Problem**

Firebase Storage is blocking requests from your localhost development server due to CORS (Cross-Origin Resource Sharing) restrictions. This prevents profile photos from being uploaded or accessed.

---

## ✅ **Solution: Configure Firebase Storage CORS**

### **Method 1: Using Google Cloud Console (Recommended)**

#### **Step 1: Create CORS Configuration File**

Create a file named `cors.json` in your project root:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

#### **Step 2: Install Google Cloud SDK**

1. **Download Google Cloud SDK:**
   - Visit: https://cloud.google.com/sdk/docs/install
   - Download and install for Windows

2. **Initialize gcloud:**
   ```bash
   gcloud init
   ```

3. **Login to your Google account:**
   ```bash
   gcloud auth login
   ```

4. **Set your project:**
   ```bash
   gcloud config set project ncleadconnect-donor
   ```

#### **Step 3: Apply CORS Configuration**

```bash
gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app
```

#### **Step 4: Verify CORS Configuration**

```bash
gsutil cors get gs://ncleadconnect-donor.firebasestorage.app
```

---

### **Method 2: Using Firebase Console (Alternative)**

If you can't use gcloud CLI, you'll need to:

1. **Go to Firebase Console:**
   - https://console.firebase.google.com/

2. **Select your project:**
   - ncleadconnect-donor

3. **Navigate to Storage:**
   - Click "Storage" in left sidebar
   - Click "Rules" tab

4. **Update Storage Rules:**
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

5. **Note:** This fixes permissions but not CORS. You still need Method 1 for CORS.

---

## 📝 **CORS Configuration File Details**

### **For Development:**

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

### **For Production (Add your domain):**

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

### **Wildcard (Allow All - Not Recommended for Production):**

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 🛠️ **Quick Fix Commands**

### **Windows PowerShell:**

```powershell
# 1. Create cors.json file
@"
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
"@ | Out-File -FilePath cors.json -Encoding UTF8

# 2. Apply CORS (requires gcloud CLI installed)
gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app

# 3. Verify
gsutil cors get gs://ncleadconnect-donor.firebasestorage.app
```

---

## 🔍 **Troubleshooting**

### **Issue: gsutil command not found**

**Solution:** Install Google Cloud SDK
- Download: https://cloud.google.com/sdk/docs/install
- After installation, restart your terminal

### **Issue: Permission denied**

**Solution:** Authenticate with proper permissions
```bash
gcloud auth login
gcloud config set project ncleadconnect-donor
```

### **Issue: Wrong bucket name**

**Solution:** Verify your bucket name
```bash
# List all buckets
gsutil ls

# Should show: gs://ncleadconnect-donor.firebasestorage.app/
```

### **Issue: CORS still not working after applying**

**Solutions:**
1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Clear cached images and files

2. **Hard refresh:**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)

3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Wait a few minutes:**
   - CORS changes can take 1-5 minutes to propagate

---

## 📊 **Verification Steps**

### **1. Check CORS is Applied:**

```bash
gsutil cors get gs://ncleadconnect-donor.firebasestorage.app
```

**Expected output:**
```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

### **2. Test Upload in Browser:**

1. Go to: http://localhost:3000/admin/lc-profile
2. Click "Upload Photo"
3. Select an image
4. Check browser console for errors

### **3. Check Network Tab:**

1. Open DevTools (F12)
2. Go to Network tab
3. Try uploading photo
4. Look for successful 200 responses

---

## 🎯 **Alternative: Use Firebase Storage SDK Properly**

If CORS continues to be an issue, ensure you're using Firebase Storage SDK correctly:

### **Check lib/memberProfileUtils.ts:**

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `profile-${userId}-${timestamp}.jpg`;
    const storageRef = ref(storage, `member-profiles/${userId}/${fileName}`);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};
```

---

## 📋 **Complete Setup Checklist**

- [ ] Google Cloud SDK installed
- [ ] Authenticated with `gcloud auth login`
- [ ] Project set to `ncleadconnect-donor`
- [ ] `cors.json` file created
- [ ] CORS configuration applied with `gsutil cors set`
- [ ] CORS configuration verified with `gsutil cors get`
- [ ] Browser cache cleared
- [ ] Dev server restarted
- [ ] Photo upload tested
- [ ] No CORS errors in console

---

## 🚀 **Quick Start (Complete Commands)**

```bash
# 1. Install Google Cloud SDK (if not installed)
# Download from: https://cloud.google.com/sdk/docs/install

# 2. Initialize and authenticate
gcloud init
gcloud auth login

# 3. Set project
gcloud config set project ncleadconnect-donor

# 4. Create CORS config
echo '[{"origin":["http://localhost:3000"],"method":["GET","POST","PUT","DELETE","HEAD"],"maxAgeSeconds":3600}]' > cors.json

# 5. Apply CORS
gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app

# 6. Verify
gsutil cors get gs://ncleadconnect-donor.firebasestorage.app

# 7. Restart dev server
npm run dev
```

---

## 💡 **Additional Notes**

### **About the "Could not establish connection" errors:**

These are browser extension errors (not related to your code):
- Usually from React DevTools or other extensions
- Safe to ignore
- Won't affect functionality

### **About the Image aspect ratio warning:**

Already fixed in `components/Header/index.tsx`:
```tsx
<Image
  src="/images/logo/LeadershipConnectionsLogo.png"
  width={40}
  height={40}
  style={{ width: '40px', height: 'auto' }}
/>
```

---

## 🎉 **Success Indicators**

You'll know CORS is fixed when:

1. ✅ No CORS errors in browser console
2. ✅ Photo uploads successfully
3. ✅ Download URL is generated
4. ✅ Photo displays in profile
5. ✅ Network tab shows 200 responses

---

## 📞 **Need Help?**

If CORS issues persist:

1. **Check Firebase Storage Rules:**
   - Ensure authenticated users can write
   - Ensure public read access (if needed)

2. **Verify Firebase Config:**
   - Check `.env.local` has correct values
   - Ensure `storageBucket` is correct

3. **Check Browser:**
   - Try in incognito mode
   - Try different browser
   - Disable extensions temporarily

---

**Follow this guide to fix Firebase Storage CORS errors and enable profile photo uploads!** 🚀
