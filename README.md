# Space Mission Logs — End-to-End Optimization Sprint

A full-stack performance engineering challenge. The app displays 200 space missions with crew members and event logs, but contains **9 intentional performance bottlenecks** (4 backend + 5 frontend) that make it slow and wasteful.

Your job is to systematically fix all 9 issues, measure the improvement after each step, and produce a final report showing the total delta from baseline to optimized.

## Project Structure

```
├── backend/        # Node.js + Express + Prisma API
├── frontend/       # React 18 + Vite dashboard
└── BASELINE.md     # Baseline and optimization metrics
```

## The 9 Performance Issues

### Backend (4)

1. **N+1 Query Problem** — GET /api/missions fetches all missions first, then loops to fetch crew and logs per mission (401 DB queries for 200 missions)
2. **No Pagination** — Returns all 200 missions at once regardless of page/limit
3. **Over-fetching** — Returns every column including large description (5,000+ chars) not used on list page
4. **No Compression** — Sends raw JSON without gzip

### Frontend (5)

5. **Unstable Prop Trap** — MissionCard receives inline style prop, breaks React.memo
6. **Expensive Computation in Render** — Filter/sort logic runs on every render, not in useMemo
7. **Double Fetch on Mount** — useEffect missing dependency array and AbortController cleanup
8. **DOM Overload** — Renders all 200 mission cards immediately, no client-side slicing
9. **Unstable Callback** — handleDelete defined inline without useCallback

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Baseline Metrics

Before running any fixes, document baseline performance:

- [ ] Response time for GET /api/missions (use curl -w or Network tab)
- [ ] Payload size (KB/MB)
- [ ] Number of database queries (watch terminal logs)
- [ ] React commit duration (React DevTools Profiler)
- [ ] Number of DOM nodes (Elements tab)

See [BASELINE.md](./BASELINE.md) for detailed metrics and improvement tracking.

## Optimization Steps

Follow this exact order. Measure after each step:

**Backend First:**
1. Fix N+1 → commit "perf: fix N+1 query with Prisma select"
2. Add pagination → commit "perf: add pagination with metadata"
3. Trim payload → commit "perf: trim payload – only required fields"
4. Enable compression → commit "perf: enable gzip compression"

**Then Frontend:**
5. Stable props + memo → commit "perf: stabilise style prop + React.memo"
6. useMemo → commit "perf: useMemo for expensive filter/sort"
7. AbortController → commit "perf: AbortController + single fetch"
8. Client slicing → commit "perf: client-side slicing + Load More"
9. useCallback → commit "perf: useCallback for stable handler"

## Load Testing

Run Artillery load tests after all fixes:

```bash
npm install -g artillery
artillery run load-test.yml
```

## Deployment

Deploy the optimized version to Render or Railway and confirm live endpoints.

## PR Submission

When complete, create a PR with:
- Title: `perf: end-to-end optimisation sprint (9 fixes)`
- Description including all 9 issues fixed and final metrics

---

**Start with [BASELINE.md](./BASELINE.md)** to document current performance.
