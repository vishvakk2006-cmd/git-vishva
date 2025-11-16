# GitHub Pages Setup Guide

## ✅ Solution to "File not found" Error

This guide will help you fix the GitHub Pages error and deploy your website.

## Problem

GitHub Pages only serves **static files** (HTML, CSS, JS), not Node.js/Express applications. The error occurs because:
1. GitHub Pages looks for `index.html` in the root or `/docs` folder
2. Your files are in the `/public` folder
3. GitHub Pages doesn't run Node.js servers

## Solution

I've created a build script that copies your files to a `/docs` folder that GitHub Pages can serve.

## Steps to Fix

### Step 1: Build Static Site

Run this command in your project directory:
```bash
npm run build
```

Or if npm is not available:
```bash
node build-static.js
```

This will:
- Copy all files from `/public` to `/docs`
- Fix all file paths
- Create `.nojekyll` file (prevents Jekyll processing)

### Step 2: Push to GitHub

```bash
git add docs/
git add build-static.js
git add package.json
git commit -m "Add GitHub Pages support with docs folder"
git push origin main
```

### Step 3: Configure GitHub Pages

1. Go to your repository: https://github.com/vishvakk2006-cmd/git1-vishva
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/docs`
5. Click **Save**

### Step 4: Wait for Deployment

- GitHub will build your site (takes 1-2 minutes)
- Your site will be available at:
  ```
  https://vishvakk2006-cmd.github.io/git1-vishva/
  ```

## Important Notes

### ⚠️ Backend API Limitation

**GitHub Pages is static hosting** - your backend API (`server.js`) will NOT work.

**Solutions:**

1. **Deploy Backend Separately** (Recommended):
   - Deploy `server.js` to **Render** or **Railway**
   - Update API URLs in your JavaScript files
   - Example: `const API_BASE = 'https://your-backend.onrender.com';`

2. **Use Static Data**:
   - Modify JavaScript to work without backend
   - Use localStorage for data
   - Show demo/mock data

3. **Use GitHub Actions** (Advanced):
   - The `.github/workflows/deploy.yml` file will auto-deploy
   - But backend still needs separate hosting

## File Structure After Build

```
git1-vishva/
├── docs/              ← GitHub Pages serves from here
│   ├── index.html     ← Main page
│   ├── dashboard.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── .nojekyll
├── public/            ← Source files
├── server.js          ← Backend (needs separate hosting)
└── build-static.js    ← Build script
```

## Troubleshooting

### Still getting "File not found"?

1. **Check folder name**: Must be exactly `docs` (lowercase)
2. **Check index.html**: Must exist in `docs/index.html`
3. **Wait a few minutes**: GitHub Pages takes time to build
4. **Check Settings**: Ensure `/docs` folder is selected
5. **Clear cache**: Hard refresh (Ctrl+F5)

### Files not updating?

1. Make sure you ran `npm run build` after changes
2. Push the updated `docs/` folder
3. Wait 1-2 minutes for GitHub to rebuild

### Logo/images not showing?

- Check file paths in HTML (should be `./assets/logo.svg`)
- Ensure files are in `docs/assets/` folder
- Check browser console for 404 errors

## Quick Commands

```bash
# Build static site
npm run build

# Add and commit
git add docs/ build-static.js package.json
git commit -m "Update static build"
git push origin main

# Check if files exist
ls docs/
```

## Alternative: Deploy to Render/Railway (Full Stack)

If you need the backend to work:

1. **Deploy Backend**:
   - Push to Render/Railway
   - Get backend URL: `https://your-app.onrender.com`

2. **Update Frontend**:
   - Edit `public/js/main.js`
   - Change: `const API_BASE = 'https://your-app.onrender.com';`

3. **Rebuild**:
   - Run `npm run build`
   - Push to GitHub

## Support

If you still have issues:
1. Check GitHub Pages build logs (Settings → Pages → View deployment)
2. Check browser console for errors
3. Verify all files are in `docs/` folder

---

**Your site will be live at:**
`https://vishvakk2006-cmd.github.io/git1-vishva/`

