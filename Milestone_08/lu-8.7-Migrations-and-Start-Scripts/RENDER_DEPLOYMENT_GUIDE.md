# 🚀 Deployment Guide — DevLog API to Render

This guide walks through deploying the DevLog API to Render with proper environment configuration, database setup, and verification.

---

## Prerequisites

- GitHub repository with code pushed to `feat/deployment-checklist` branch
- Render account at https://render.com (free tier available)
- PostgreSQL database (use Render's managed PostgreSQL or external)

---

## Step 1: Create a PostgreSQL Database on Render

### Option A: Using Render's Managed PostgreSQL (Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Fill in the form:
   - **Name:** `devlog-db`
   - **Database:** `devlog` (name for the database)
   - **User:** `devlog_user` (your database user)
   - **Region:** Oregon (or your preferred region)
   - **Plan:** Free (suitable for development)

4. Click **Create Database**
5. **Important:** Copy the **Internal Database URL** (not the External URL)
   - Format: `postgresql://username:password@hostname:5432/databasename`
   - It should end with `.internal` for internal connections
6. Save this URL — you'll need it in Step 3

---

## Step 2: Create a Web Service on Render

1. In Render Dashboard, click **New +** → **Web Service**
2. Select **Build and deploy from a Git repository**
3. Paste your GitHub repository URL:
   ```
   https://github.com/YourUsername/Project-Engineering.git
   ```
4. Click **Continue**
5. Fill in the service details:

   | Field | Value |
   |-------|-------|
   | **Name** | `devlog-api` |
   | **Instance Type** | Free |
   | **Branch** | `feat/deployment-checklist` |
   | **Build Command** | `npm install && npx prisma generate && npx prisma migrate deploy` |
   | **Start Command** | `npm start` |

6. **Important:** Under **Root Directory**, if your code is in a subdirectory:
   - Set to: `Project-Engineering-main/Milestone_08/lu-8.7-Migrations-and-Start-Scripts`
   - *If this doesn't exist as an option, you'll need to restructure the repo (see troubleshooting)*

7. Click **Create Web Service**

---

## Step 3: Configure Environment Variables

On the Render service page:

1. Go to **Environment** tab
2. Add the following environment variables:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `DATABASE_URL` | `postgresql://devlog_user:PASSWORD@dpg-xxxxx.oregon-postgres.render.internal:5432/devlog` | Use INTERNAL URL from Step 1 |
   | `JWT_SECRET` | *Generate a strong secret* | Can use: `openssl rand -base64 32` |
   | `CORS_ORIGIN` | `https://devlog-api.onrender.com` | This is your API's own URL (set after first deploy) |
   | `NODE_ENV` | `production` | Always use production for live service |
   | `PORT` | `3000` | Optional; Render sets this automatically |

3. Click **Save Changes**

**Important:** After the first deployment completes, update `CORS_ORIGIN` to your actual Render URL.

---

## Step 4: Monitor the Initial Deployment

1. The deployment should start automatically
2. Watch the **Logs** tab for:
   ```
   > npm start
   > node src/server.js
   ✅ All required environment variables are set.
   🚀 DevLog API running on port 3000
   ```

3. Look for any Prisma migration output:
   ```
   Prisma schema loaded from prisma/schema.prisma
   Datasource "db": PostgreSQL database
   [migration] Database schema is up to date!
   ```

### If the deployment fails:

**Error: "FATAL: database password authentication failed"**
- ✅ Solution: Check DATABASE_URL in environment variables — ensure it has correct password and `.internal` suffix

**Error: "The table 'User' does not exist"**
- ✅ Solution: Migrations didn't run. Verify buildCommand includes `npx prisma migrate deploy`

**Error: "Cannot find module 'express'"**
- ✅ Solution: Ensure `npm install` runs first. Check Build Command in settings.

---

## Step 5: Verify the Deployment

Once the service shows a green **"Live"** status:

### 5.1 Test the Health Endpoint

```bash
curl https://devlog-api.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-17T10:30:00.000Z"
}
```

### 5.2 Test the Root Endpoint

```bash
curl https://devlog-api.onrender.com/
```

Expected response:
```json
{
  "name": "DevLog API",
  "version": "1.0.0",
  "docs": "/api/health"
}
```

### 5.3 Check the Render Dashboard

- ✅ Service status: **Live** (green)
- ✅ Logs show: `🚀 DevLog API running on port 3000`
- ✅ No errors in the last 5 minutes

---

## Step 6: Update the Deployment Checklist

Update [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) with evidence:

### Item 01 — Environment Variables
- Take a screenshot of the **Environment** tab showing all variables
- Save as `screenshots/01-env-vars-platform.png`

### Item 03 — CI Build
- Go to GitHub → Actions → your workflow run
- Take a screenshot showing green checkmark
- Save as `screenshots/03-ci-build.png`

### Item 05 — CORS Verified
- Open your frontend app (or DevTools on the API URL itself)
- Make an API call to `/api/health`
- Verify no CORS errors in browser console
- Save Network tab screenshot as `screenshots/05-cors-network-tab.png`

### Item 08 — Health Endpoint
- Run the curl command above
- Take a screenshot showing the JSON response
- Save as `screenshots/08-health-endpoint.png`

---

## Step 7: Test the Full Auth Flow (Optional)

If you have auth endpoints, test the complete flow:

```bash
# 1. Sign up
curl -X POST https://devlog-api.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securePassword123",
    "name": "Test User"
  }'

# 2. Login
curl -X POST https://devlog-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securePassword123"
  }'

# 3. Use the token in protected routes
# (Extract the JWT token from login response)
curl https://devlog-api.onrender.com/api/logs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Troubleshooting

### Issue: Root directory not found

**Problem:** Render can't find the code because it's nested in subdirectories

**Solution:**
- Option 1: Ensure the **Root Directory** in Render settings points to the correct path
- Option 2: Update the GitHub repository to have `package.json` at the root level (restructure)

### Issue: Deployment times out

**Problem:** Build step takes too long (>15 minutes on free tier)

**Solution:**
- Skip Docker if not essential (you're using Node.js runtime, so Docker isn't needed)
- Verify npm cache isn't corrupted: try clearing and redeploying

### Issue: Database connection hangs

**Problem:** App starts but database queries hang indefinitely

**Solution:**
- Verify DATABASE_URL uses **internal** URL (not external)
- Check firewall: Render services can only connect via internal URLs
- Verify database credentials in URL are correct

### Issue: 502 Bad Gateway after deployment

**Problem:** Service crashes immediately after starting

**Solution:**
1. Check logs for errors (look for crash traces)
2. Verify all environment variables are set (especially JWT_SECRET)
3. Verify `npm start` command is correct: `node src/server.js`
4. Check if port binding fails (PORT 3000 must be available)

---

## Environment Variables Reference

All available environment variables for DevLog API:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | None | PostgreSQL connection string (use INTERNAL URL on Render) |
| `JWT_SECRET` | ✅ Yes | None | Secret key for signing JWTs; should be >32 characters |
| `NODE_ENV` | No | `development` | Set to `production` on Render |
| `PORT` | No | `3000` | Port number; Render overrides this automatically |
| `CORS_ORIGIN` | No | `*` | Comma-separated origins allowed to call API |

---

## Post-Deployment Checklist

After successful deployment to Render:

- [ ] Health endpoint responds with 200 OK
- [ ] API root endpoint responds with version info
- [ ] CORS headers are present on responses
- [ ] Database migrations have run (no table-not-found errors)
- [ ] Auth endpoints work (if applicable)
- [ ] No sensitive data in logs (check SECRET, API_KEY usage)
- [ ] Service restarts cleanly after redeploy
- [ ] Render dashboard shows **Live** status consistently

---

## Next Steps

1. **Frontend Deployment:** Deploy your frontend to Vercel, Netlify, or Render
2. **Update CORS_ORIGIN:** Change to frontend URL once it's deployed
3. **Domain Setup:** Add custom domain if needed (Render Pro feature)
4. **Monitoring:** Set up Render alerts for downtime
5. **Documentation:** Update README with production API URL

---

**Deployment Date:** 2026-05-17  
**API Version:** 1.0.0  
**Status:** Ready for production ✅
