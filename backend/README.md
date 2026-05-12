# Space Mission Logs — Backend API

A Node.js + Express + Prisma API for managing space missions. This codebase intentionally contains 4 backend performance bugs that need to be fixed.

## Backend Bugs (4)

1. **N+1 Query Problem** — Fetches missions then loops to fetch crew/logs per mission (401 queries for 200 missions)
2. **No Pagination** — Returns all 200 missions regardless of page/limit
3. **Over-fetching** — Returns every column including large description field (5,000+ chars)
4. **No Compression** — Sends raw JSON without gzip

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Server runs on `http://localhost:3001`

## Endpoints

- `GET /api/health` — Health check
- `GET /api/missions` — Fetch all missions (buggy)
- `DELETE /api/missions/:id` — Delete a mission
- `GET /api/missions/search/:query` — Search missions
