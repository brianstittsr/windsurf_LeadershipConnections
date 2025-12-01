# 🚀 Vercel CLI Guide

## Installation & Setup

### **Vercel CLI is Already Installed** ✅
The Vercel CLI has been added to the project as a dev dependency.

```bash
# Already in package.json
"vercel": "^48.12.0"
```

---

## Quick Start

### **1. Login to Vercel**
First time setup - authenticate with your Vercel account:

```bash
npm run vercel:login
```

Or directly:
```bash
npx vercel login
```

**What happens:**
- Opens browser for authentication
- Links your local CLI to Vercel account
- Saves credentials locally

---

## Available Commands

### **Deployment Commands**

#### **Deploy to Production**
```bash
npm run vercel:deploy
```
- Deploys to production (www.ncleadconnect.org)
- Runs build process
- Updates live site
- Use when you want immediate production deployment

#### **Deploy Preview**
```bash
npm run vercel:preview
```
- Creates preview deployment
- Gets unique URL (e.g., `project-abc123.vercel.app`)
- Test changes before production
- Doesn't affect live site

---

### **Monitoring Commands**

#### **Check Deployment Status**
```bash
npm run vercel:status
```
- Lists recent deployments
- Shows deployment URLs
- Displays build status
- Shows creation time

**Example Output:**
```
Age    Deployment                          Status    Duration
2m     ncleadconnect-abc123.vercel.app    Ready     1m 45s
5m     ncleadconnect-xyz789.vercel.app    Ready     1m 52s
```

#### **View Deployment Logs**
```bash
npm run vercel:logs
```
- Shows real-time logs
- View build output
- Debug deployment issues
- Monitor runtime errors

**Options:**
```bash
# Follow logs in real-time
npx vercel logs --follow

# Logs for specific deployment
npx vercel logs [deployment-url]

# Production logs only
npx vercel logs --prod
```

---

### **Environment Variable Commands**

#### **List Environment Variables**
```bash
npm run vercel:env
```
- Shows all environment variables
- Displays which environments they're in (Production/Preview/Development)
- Helps verify configuration

#### **Add Environment Variable**
```bash
npx vercel env add VARIABLE_NAME
```
- Interactive prompt for value
- Select environments (Production/Preview/Development)
- Immediately available for next deployment

#### **Remove Environment Variable**
```bash
npx vercel env rm VARIABLE_NAME
```
- Removes variable from Vercel
- Select which environments to remove from

#### **Pull Environment Variables**
```bash
npm run vercel:pull
```
- Downloads environment variables from Vercel
- Creates `.env.local` file
- Useful for local development
- **Warning:** Will overwrite existing `.env.local`

---

## Common Workflows

### **Workflow 1: Check Current Deployment**

```bash
# 1. Check deployment status
npm run vercel:status

# 2. View logs of latest deployment
npm run vercel:logs

# 3. Open deployment in browser
# Copy URL from status command
```

---

### **Workflow 2: Deploy with Monitoring**

```bash
# 1. Test build locally first
npm run build

# 2. Deploy to production
npm run vercel:deploy

# 3. Monitor deployment
npm run vercel:logs --follow

# 4. Check status
npm run vercel:status

# 5. Visit site to verify
# https://www.ncleadconnect.org
```

---

### **Workflow 3: Preview Before Production**

```bash
# 1. Create preview deployment
npm run vercel:preview

# 2. Get preview URL from output
# Example: https://project-abc123.vercel.app

# 3. Test preview site thoroughly

# 4. If good, deploy to production
npm run vercel:deploy
```

---

### **Workflow 4: Debug Build Failure**

```bash
# 1. Check recent deployments
npm run vercel:status

# 2. View logs of failed deployment
npm run vercel:logs [failed-deployment-url]

# 3. Identify error in logs

# 4. Fix locally and test
npm run build

# 5. Redeploy
git add -A
git commit -m "Fix build error"
git push origin main

# 6. Monitor new deployment
npm run vercel:logs --follow
```

---

### **Workflow 5: Manage Environment Variables**

```bash
# 1. List current variables
npm run vercel:env

# 2. Add new variable
npx vercel env add OPENAI_API_KEY
# Enter value when prompted
# Select: Production, Preview, Development

# 3. Verify it was added
npm run vercel:env

# 4. Redeploy to use new variable
npm run vercel:deploy
```

---

## Advanced Commands

### **Link Project**
If project isn't linked to Vercel:
```bash
npx vercel link
```
- Links local project to Vercel project
- Creates `.vercel` directory
- One-time setup

### **Project Information**
```bash
npx vercel project ls
```
- Lists all your Vercel projects
- Shows project names and URLs

### **Inspect Deployment**
```bash
npx vercel inspect [deployment-url]
```
- Detailed deployment information
- Build settings
- Environment variables used
- Build duration

### **Rollback Deployment**
```bash
npx vercel rollback [deployment-url]
```
- Promotes previous deployment to production
- Instant rollback
- Use if current deployment has issues

### **Remove Deployment**
```bash
npx vercel rm [deployment-url]
```
- Deletes a deployment
- Useful for cleaning up old previews
- Cannot remove current production deployment

---

## Configuration Files

### **.vercel Directory**
Created after linking project:
```
.vercel/
├── project.json    # Project configuration
└── README.txt      # Vercel info
```

**Note:** This directory is gitignored

### **vercel.json**
Project configuration (already exists):
```json
{
  "version": 2,
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## Troubleshooting

### **"Not Authenticated" Error**
```bash
npm run vercel:login
```
Re-authenticate with Vercel

### **"Project Not Linked" Error**
```bash
npx vercel link
```
Link your local project to Vercel project

### **Build Fails in Vercel but Works Locally**
1. Check environment variables in Vercel
2. Ensure all required vars are set
3. Check Vercel Node.js version matches local
4. Review build logs: `npm run vercel:logs`

### **Can't See Logs**
```bash
# Make sure you're authenticated
npm run vercel:login

# Check you're in the right project
npx vercel project ls

# Try with deployment URL
npx vercel logs [deployment-url]
```

---

## Best Practices

### **1. Always Test Locally First**
```bash
npm run build
```
Never deploy without testing the build locally

### **2. Use Preview Deployments**
```bash
npm run vercel:preview
```
Test changes in preview before production

### **3. Monitor Deployments**
```bash
npm run vercel:logs --follow
```
Watch deployments in real-time

### **4. Keep Environment Variables Synced**
```bash
npm run vercel:env
```
Regularly check that all required variables are set

### **5. Use Git for Deployments**
- Push to GitHub
- Let Vercel auto-deploy
- CLI is for manual/emergency deployments

---

## Integration with Git

### **Automatic Deployments**
Vercel automatically deploys when you push to GitHub:

```bash
git push origin main
```
- Triggers production deployment
- No CLI needed
- Recommended workflow

### **Branch Deployments**
```bash
git checkout -b feature-branch
git push origin feature-branch
```
- Vercel creates preview deployment
- Each branch gets unique URL
- Test features before merging

---

## Useful Aliases

Add to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
# Vercel shortcuts
alias vd="npm run vercel:deploy"
alias vp="npm run vercel:preview"
alias vs="npm run vercel:status"
alias vl="npm run vercel:logs"
alias ve="npm run vercel:env"
```

Then use:
```bash
vd    # Deploy to production
vp    # Create preview
vs    # Check status
vl    # View logs
ve    # List env vars
```

---

## Quick Reference

### **Most Common Commands:**

```bash
# Login
npm run vercel:login

# Deploy to production
npm run vercel:deploy

# Check status
npm run vercel:status

# View logs
npm run vercel:logs

# List env vars
npm run vercel:env
```

### **Emergency Commands:**

```bash
# Rollback to previous deployment
npx vercel rollback

# View production logs
npx vercel logs --prod

# Inspect current production
npx vercel inspect --prod
```

---

## Monitoring Dashboard

### **Vercel Dashboard**
Best for visual monitoring:
- https://vercel.com/dashboard
- Real-time build progress
- Deployment history
- Analytics
- Error tracking

### **CLI Monitoring**
Best for quick checks:
```bash
# Quick status check
npm run vercel:status

# Watch logs
npm run vercel:logs --follow

# Check specific deployment
npx vercel inspect [url]
```

---

## Security Notes

### **Authentication Token**
- Stored in `~/.vercel/auth.json`
- Keep secure
- Don't commit to Git
- Regenerate if compromised

### **Environment Variables**
- Never commit `.env.local` to Git
- Use Vercel dashboard or CLI to manage
- Rotate secrets regularly
- Use different values for preview/production

---

## Getting Help

### **Vercel CLI Help**
```bash
npx vercel --help
npx vercel [command] --help
```

### **Documentation**
- Official Docs: https://vercel.com/docs/cli
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs

### **Support**
- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

---

## Summary

### **Setup (One-Time):**
1. ✅ Vercel CLI installed
2. Run `npm run vercel:login`
3. Run `npx vercel link` (if needed)

### **Daily Usage:**
1. Develop locally
2. Test with `npm run build`
3. Push to GitHub (auto-deploys)
4. Monitor with `npm run vercel:status`
5. Check logs if issues: `npm run vercel:logs`

### **Manual Deployment:**
1. `npm run vercel:preview` - Test first
2. `npm run vercel:deploy` - Deploy to production
3. `npm run vercel:logs` - Monitor deployment

---

**Last Updated:** November 30, 2025
**Vercel CLI Version:** 48.12.0
**Project:** Leadership Connections Website
