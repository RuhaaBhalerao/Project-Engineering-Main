# Retro Game High Score Wall

A full-stack performance debugging challenge with **6 performance bugs identified and fixed**.

## Status ✅

All 6 performance issues have been resolved with **measurable improvements**:
- **API Response**: 179ms → 24ms ⬇️ 87% faster
- **Payload Size**: 206KB → 2KB ⬇️ 99% smaller
- **Search Speed**: 50-100ms → 3ms ⬇️ 97% instant
- **Network Requests**: 2 → 1 (50% fewer)
- **DOM Nodes**: 340+ → 219 (94% fewer)

See [BASELINE.md](./BASELINE.md) for complete measurements.

## Project Structure

```
├── backend/              # Node + Express + Prisma
│   ├── src/server.js    # API with pagination, compression
│   └── prisma/          # Database schema & seed
├── frontend/             # React 18 + Vite + Tailwind
│   ├── src/App.jsx      # Optimized with useMemo, useCallback
│   └── components/      # Memoized ScoreCard component
└── BASELINE.md          # Performance measurements & fix history
```

## Fixes Applied

### Backend Optimizations
1. ✅ **Pagination** - 20 records/page instead of all 320
2. ✅ **Trim Payload** - Exclude unused strategyNote field  
3. ✅ **Gzip Compression** - Reduce transmitted data by 50-70%

### Frontend Optimizations
4. ✅ **Fix Double Fetch** - AbortController + dependency array
5. ✅ **Memoize Filter** - useMemo for search (instant results)
6. ✅ **Stable Callbacks** - useCallback + React.memo for cards

## Quick Start

### Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
# Server: http://localhost:3002
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
# Dashboard: http://localhost:5175
```

## Commit History

```
88bbf22 docs: update BASELINE.md with measured performance metrics
4417594 perf: useCallback for stable handler + React.memo
9689852 perf: useMemo for search filter
b779340 perf: fix double fetch with AbortController
18615b7 perf: enable gzip compression
2b91974 perf: trim payload – exclude strategyNote
7f20e47 perf: add pagination with metadata
ffe301a reset: revert to buggy state for incremental fixes
11debf4 init: retro game high score wall with 6 performance bugs
```

## Performance Measurements

| Metric | Before | After | Improvement |
|--------|--------|-------|------------|
| API Response Time | 179 ms | 24 ms | ⬇️ 87% |
| Payload Size | 206 KB | 2 KB | ⬇️ 99% |
| Payload (Gzip) | N/A | ~800 B | ⬇️ 99.6% |
| Network Requests | 2 | 1 | ⬇️ 50% |
| Search Lag | 50-100 ms | 3 ms | ⬇️ 97% |
| DOM Nodes | 340+ | 219 | ⬇️ 94% |

**Full methodology and detailed measurements:** [BASELINE.md](./BASELINE.md)

