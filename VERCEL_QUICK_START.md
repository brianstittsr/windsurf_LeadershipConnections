# ⚡ Vercel CLI - Quick Start

## 🚀 Setup (First Time Only)

```bash
# 1. Login to Vercel
npm run vercel:login

# 2. Link project (if needed)
npx vercel link
```

---

## 📋 Most Used Commands

### **Check Deployment Status**
```bash
npm run vercel:status
```
Shows recent deployments and their status

### **View Logs**
```bash
npm run vercel:logs
```
See build and runtime logs

### **Deploy to Production**
```bash
npm run vercel:deploy
```
Manual production deployment

### **Create Preview**
```bash
npm run vercel:preview
```
Test deployment with unique URL

### **List Environment Variables**
```bash
npm run vercel:env
```
View all environment variables

---

## 🔥 Quick Workflows

### **Check if Build Succeeded**
```bash
npm run vercel:status
# Look for "Ready" status
```

### **Debug Build Failure**
```bash
npm run vercel:logs
# Read error messages
# Fix locally
# Push to GitHub
```

### **Add Environment Variable**
```bash
npx vercel env add VARIABLE_NAME
# Follow prompts
# Redeploy after adding
```

---

## 📊 All Available Scripts

| Command | Description |
|---------|-------------|
| `npm run vercel:login` | Authenticate with Vercel |
| `npm run vercel:deploy` | Deploy to production |
| `npm run vercel:preview` | Create preview deployment |
| `npm run vercel:status` | List recent deployments |
| `npm run vercel:logs` | View deployment logs |
| `npm run vercel:env` | List environment variables |
| `npm run vercel:pull` | Download env vars to `.env.local` |

---

## 💡 Pro Tips

1. **Always test locally first:**
   ```bash
   npm run build
   ```

2. **Let GitHub auto-deploy:**
   ```bash
   git push origin main
   # Vercel deploys automatically
   ```

3. **Use CLI for emergencies only:**
   - Quick fixes
   - Manual deployments
   - Debugging

4. **Monitor in real-time:**
   ```bash
   npm run vercel:logs --follow
   ```

---

## 🆘 Common Issues

### **"Not authenticated"**
```bash
npm run vercel:login
```

### **"Project not linked"**
```bash
npx vercel link
```

### **Can't see logs**
```bash
# Make sure you're logged in
npm run vercel:login

# Try with specific deployment URL
npx vercel logs [deployment-url]
```

---

## 📚 Full Documentation

See `VERCEL_CLI_GUIDE.md` for complete documentation.

---

**Quick Reference - Keep this handy!** 📌
