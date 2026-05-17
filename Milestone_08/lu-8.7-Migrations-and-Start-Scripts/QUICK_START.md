# Quick Start — Local Development & Deployment

## 🏃 Quick Start for Local Development

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Run migrations (creates tables if needed)
npm run db:migrate

# 4. Start development server
npm run dev

# Server will run on http://localhost:3000
```

## 📋 Pre-Deployment Checklist

Before pushing to production, verify:

```bash
# 1. Build succeeds
npm run db:generate
node src/server.js

# 2. Health endpoint works
curl http://localhost:3000/api/health

# 3. Environment variables set
cat .env

# 4. No secrets in git
git log --all -S "SECRET" --oneline
git log --all -S "API_KEY" --oneline

# 5. .env.example committed
git ls-files | grep .env.example

# 6. All changes committed
git status
git add .
git commit -m "your-message"
git push origin feat/deployment-checklist
```

## 🚀 Deployment Commands

### Deploy to Render

1. **Create PostgreSQL Database:**
   - Render Dashboard → New → PostgreSQL
   - Copy **Internal** connection string

2. **Create Web Service:**
   - Render Dashboard → New → Web Service
   - Select GitHub repo with feat/deployment-checklist branch
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

3. **Set Environment Variables:**
   ```
   DATABASE_URL=postgresql://...@....internal:5432/devlog
   JWT_SECRET=[generate-strong-secret]
   CORS_ORIGIN=https://devlog-api.onrender.com
   NODE_ENV=production
   ```

4. **Monitor Deployment:**
   ```bash
   # Watch logs in Render dashboard
   # Expected output:
   # ✅ All required environment variables are set.
   # 🚀 DevLog API running on port 3000
   ```

5. **Test Production:**
   ```bash
   curl https://devlog-api.onrender.com/api/health
   ```

## 📁 Project Structure

```
lu-8.7-Migrations-and-Start-Scripts/
├── src/
│   ├── server.js           # ✅ Main entry point (fixed)
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── logs.js         # Log entry operations
│   │   └── health.js       # Health check endpoint
│   ├── middleware/         # Express middleware
│   └── config/             # Configuration files
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── .env                    # Local environment (⚠️ not committed)
├── .env.example            # ✅ Template for environment variables
├── package.json            # ✅ Fixed start script & Node version
├── render.yaml             # ✅ Render deployment config
├── Dockerfile              # Docker image config
├── DEPLOYMENT_CHECKLIST.md # 12-item verification checklist
├── RENDER_DEPLOYMENT_GUIDE.md # Step-by-step deployment guide
└── screenshots/            # Evidence for checklist items
```

## 🔧 Available npm Scripts

```bash
npm start        # Start production server (node src/server.js)
npm run dev      # Start dev server with auto-reload (nodemon)
npm run db:migrate    # Deploy migrations to database
npm run db:generate   # Generate Prisma Client
npm run db:seed      # Seed database with sample data (if seed.js exists)
```

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'app.js'` | Start script pointing to wrong file | ✅ Fixed in package.json |
| Table 'User' does not exist | Migrations not deployed | ✅ Fixed in render.yaml buildCommand |
| FATAL: database auth failed | DATABASE_URL wrong or missing | Check environment variables on Render |
| No certificates in deploy | Using external DB URL on Render | Use `.internal` URL instead |
| Cannot GET /api/health | Health route not registered | Route exists at `GET /api/health` |

## 📊 Deployment Status

| Component | Local | Render | Status |
|-----------|-------|--------|--------|
| Build | ✅ Pass | ⏳ Testing | Ready |
| Server Start | ✅ Pass | ⏳ Testing | Ready |
| Migrations | ✅ Ready | ✅ Configured | Ready |
| Environment Variables | ✅ Ready | ⏳ Configure | Ready |
| Database Connection | ✅ Local | ✅ Configured | Ready |
| Health Endpoint | ✅ Working | ⏳ Testing | Ready |
| CORS Configuration | ✅ Configured | ✅ Configured | Ready |
| Secrets Management | ✅ Secure | ✅ Secure | Ready |

## 📞 Support Resources

- **Prisma Docs:** https://www.prisma.io/docs/
- **Render Docs:** https://render.com/docs
- **Express Docs:** https://expressjs.com/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

**Last Updated:** 2026-05-17  
**Version:** 1.0.0  
**Status:** ✅ Ready for Production
