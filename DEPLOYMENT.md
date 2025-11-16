# Deployment Guide for Aqua Loop

## Free Hosting Options

### 1. **Render** (Recommended - Easiest for Node.js)
- **Website**: https://render.com
- **Free Tier**: Yes (with limitations)
- **Best For**: Full-stack Node.js applications

#### Steps:
1. Push your code to GitHub
2. Sign up at render.com
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Deploy!

**Your site will be live at**: `https://aqua-loop.onrender.com` (or your custom name)

---

### 2. **Railway**
- **Website**: https://railway.app
- **Free Tier**: Yes ($5 credit/month)
- **Best For**: Quick deployments

#### Steps:
1. Sign up at railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Node.js and deploys
5. Done!

**Your site will be live at**: `https://aqua-loop.up.railway.app`

---

### 3. **Vercel** (For Frontend + Serverless)
- **Website**: https://vercel.com
- **Free Tier**: Yes
- **Note**: Requires converting Express routes to serverless functions

#### Steps:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts
4. Deploy!

---

### 4. **Heroku** (Classic Option)
- **Website**: https://heroku.com
- **Free Tier**: Discontinued, but has free credits
- **Best For**: Traditional deployments

#### Steps:
1. Install Heroku CLI
2. Run `heroku create`
3. Run `git push heroku main`
4. Done!

---

### 5. **Cyclic** (Serverless)
- **Website**: https://cyclic.sh
- **Free Tier**: Yes
- **Best For**: Serverless Node.js apps

---

## Quick Deploy with Render (Recommended)

### Prerequisites:
1. GitHub account
2. Code pushed to GitHub repository

### Step-by-Step:

1. **Create GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/aqua-loop.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to https://render.com
   - Sign up/Login
   - Click "New" → "Web Service"
   - Connect GitHub and select your repository
   - Settings:
     - **Name**: aqua-loop (or your choice)
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

3. **Your Live URL**: 
   ```
   https://aqua-loop.onrender.com
   ```

---

## Environment Variables (if needed)

If you add API keys later, add them in Render dashboard:
- Settings → Environment Variables
- Add: `PORT=3000` (usually auto-set)

---

## Important Notes:

1. **Data Persistence**: The current setup uses JSON files which reset on each deployment. For production:
   - Use a database (MongoDB Atlas - free tier available)
   - Or use Render's persistent disk (paid)

2. **CORS**: Already configured in server.js

3. **Static Files**: Already configured to serve from `/public`

---

## Testing Locally Before Deploying:

```bash
npm install
npm start
```

Visit: http://localhost:3000

---

## Quick Deploy Commands:

### Render:
- Auto-deploys on git push to main branch

### Railway:
- Auto-deploys on git push

### Manual Deploy:
```bash
# Build and test locally first
npm install
npm start

# Then push to your hosting platform
```

---

## Need Help?

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Node.js Deployment: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

