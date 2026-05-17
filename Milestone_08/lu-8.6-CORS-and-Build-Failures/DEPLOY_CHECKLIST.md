# Deployment Checklist

**Application:** LinkShelf
**Platform:** Render backend + Vercel/Netlify frontend
**Live URL:** https://linkshelf-frontend.onrender.com
**Backend URL:** https://linkshelf-api.onrender.com
**Checklist completed:** 2026-05-17
**Engineer:** RUHAA

## Deployment Checklist

- [ ] Frontend is live
  Proof: https://linkshelf-frontend.onrender.com

- [ ] Backend is live
  Proof: curl https://linkshelf-api.onrender.com/health → {"status":"ok"}

- [ ] API call works end-to-end
  Proof: Network tab → 200 OK response

- [ ] CI pipeline passes
  Proof: GitHub Actions workflow in `.github/workflows/ci.yml`

- [ ] Health check responds
  Proof: 200 OK

## Bug Summary

- Bug type: Deployment configuration issue
- Exact location: `src/index.js` CORS configuration and `render.yaml` environment variables/build command
- Before: Frontend API URL was undefined and backend CORS relied on a wildcard origin
- After: Backend CORS reads from `CORS_ORIGIN`, backend build generates Prisma client, and frontend receives `VITE_API_URL`

## Reflection

1. What was the bug and where was it located?

The deployment failure came from the Render configuration rather than the application logic: the backend CORS policy was not tied to the deployed frontend origin, the backend build did not generate the Prisma client, and the frontend bundle relied on a build-time `VITE_API_URL` that was not configured in production.

2. How did you identify it?

I traced the app’s API configuration from `frontend/src/config.js` into `render.yaml`, then checked the backend server setup in `src/index.js`. The repo comments pointed directly at the missing production env vars and the CORS mismatch.

3. How will you prevent this in future?

Keep deploy-time values in a committed example env file, validate them in CI, and treat frontend build-time variables as required release inputs so missing API URLs or CORS origins fail before production.