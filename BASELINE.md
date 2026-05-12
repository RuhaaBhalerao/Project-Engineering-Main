# BASELINE.md — Performance Metrics

## Baseline Measurements (Before Optimization)

### Backend Metrics

#### GET /api/missions Response
- **Response Time**: _measure after first run_
- **Payload Size**: _measure after first run_
- **Status Code**: 200

#### Database Queries
- **Total Queries on Load**: _count from terminal logs_
- **Queries per Mission**: ~2 (N+1 problem: 1 mission + 1 crew + 1 logs = 3 per mission, but batched somewhat)
- **Query Count for 200 Missions**: ~401 (1 initial + 200*2)

### Frontend Metrics

#### React Profiler (Unoptimized)
- **App Mount Time**: _measure with React DevTools_
- **Render Count**: _count commits_
- **Commit Duration**: _total time for initial render_

#### Network (Chrome DevTools)
- **Number of Requests**: _count requests_
- **Total Transferred**: _measure_
- **DOM Content Loaded**: _measure_
- **Load Time**: _measure_

#### DOM Metrics
- **Total DOM Nodes**: _measure with Elements inspector_
- **MissionCard Elements**: 200 × (avg 20 nodes per card) = ~4000 nodes

---

## Optimizations Applied & Delta Measurements

After each fix, record the delta:

### 1. Fix N+1 Query (Backend)

**Commit**: `perf: fix N+1 query with Prisma select`

**Changes**:
- Replace `include: { crew: true, logs: true }` with `select` to only fetch needed fields
- Use Prisma's optimized query batching

**Metrics**:
- Queries Before: ~401
- Queries After: _measure_
- **Delta**: _calculate_
- Response Time Before: _measure_
- Response Time After: _measure_
- **Delta**: _calculate_

---

### 2. Add Pagination (Backend)

**Commit**: `perf: add pagination with metadata`

**Changes**:
- Add `page` and `limit` query parameters (default: page=1, limit=20)
- Implement `skip` and `take` in Prisma
- Return metadata: `{ total, totalPages, hasNextPage, hasPrevPage }`

**Metrics**:
- Payload Size Before: _measure_
- Payload Size After: _measure_ (now only 20 missions + metadata)
- **Delta**: _calculate %_
- Response Time Before: _measure_
- Response Time After: _measure_
- **Delta**: _calculate %_

---

### 3. Trim Payload (Backend)

**Commit**: `perf: trim payload – only required fields`

**Changes**:
- Use Prisma `select` to return only: `id`, `name`, `launchDate`, `rocket`
- Remove `description` field (5000+ characters not used on list)
- Keep crew and logs minimal

**Metrics**:
- Payload Size Before: _measure_
- Payload Size After: _measure_
- **Delta**: _calculate %_
- Rows Returned: 20 (paginated)

---

### 4. Enable Compression (Backend)

**Commit**: `perf: enable gzip compression`

**Changes**:
- Import `compression` middleware
- Add `app.use(compression())` before routes

**Metrics**:
- Content-Length Before: _measure_
- Content-Length After: _measure_ (with Content-Encoding: gzip)
- **Delta**: _calculate %_ reduction
- Response Time: _measure_ (may see slight improvement from reduced bandwidth)

---

### 5. Stable Props + React.memo (Frontend)

**Commit**: `perf: stabilise style prop + React.memo`

**Changes**:
- Move inline `cardStyle` to module-level constant
- Wrap `MissionCard` with `React.memo`
- Ensure parent passes stable props

**Metrics**:
- MissionCard Re-renders (before): _count in React Profiler_
- MissionCard Re-renders (after): _count_
- **Delta**: _reduce unnecessary re-renders_

---

### 6. useMemo for Filter/Sort (Frontend)

**Commit**: `perf: useMemo for expensive filter/sort`

**Changes**:
- Wrap filter/sort logic in `useMemo` with dependencies `[missions, searchTerm, sortBy]`
- Prevent expensive computation on every render

**Metrics**:
- Main Thread Blocking Time (before): _measure_
- Main Thread Blocking Time (after): _measure_
- **Delta**: _calculate %_ reduction
- Search Responsiveness: _subjective but measure Time to Interactive_

---

### 7. AbortController + Single Fetch (Frontend)

**Commit**: `perf: AbortController + single fetch`

**Changes**:
- Add `AbortController` in useEffect
- Pass `signal` to axios request
- Add cleanup function: `return () => controller.abort()`
- Set dependency array to `[]`

**Metrics**:
- Network Requests on Mount (before): 2 (React Strict Mode)
- Network Requests on Mount (after): 1
- **Delta**: -1 duplicate request, saves bandwidth and time

---

### 8. Client-Side Slicing + Load More (Frontend)

**Commit**: `perf: client-side slicing + Load More`

**Changes**:
- Store all missions in state
- Track `visibleCount` state (start with 12)
- Render only first `visibleCount` missions
- Add "Load More" button that increases `visibleCount` by 12

**Metrics**:
- Initial DOM Nodes (before): ~4000 (200 cards × 20 nodes)
- Initial DOM Nodes (after): ~240 (12 cards × 20 nodes)
- **Delta**: _calculate %_ reduction
- Initial Paint Time (before): _measure_
- Initial Paint Time (after): _measure_
- **Delta**: _calculate %_ improvement

---

### 9. useCallback for Handler (Frontend)

**Commit**: `perf: useCallback for stable handler`

**Changes**:
- Wrap `handleDelete` with `useCallback` and empty dependency array
- Prevents child re-renders due to function reference changes

**Metrics**:
- Child Component Re-renders (before): _count_
- Child Component Re-renders (after): _count_
- **Delta**: _reduce unnecessary re-renders_

---

## Load Test Results

**Command**: `artillery run load-test.yml`

**Target**: `GET /api/missions?page=1&limit=20`

**Configuration**: 100 virtual users, 60-second ramp-up

### Before Optimization
- **Response Time (p50)**: _measure_
- **Response Time (p95)**: _measure_
- **Response Time (p99)**: _measure_
- **Throughput**: _requests/sec_
- **Error Rate**: _percentage_

### After Optimization
- **Response Time (p50)**: _measure_
- **Response Time (p95)**: _measure_
- **Response Time (p99)**: _measure_
- **Throughput**: _requests/sec_
- **Error Rate**: _percentage_

### Load Test Delta
- **p50 Improvement**: _calculate %_
- **p95 Improvement**: _calculate %_
- **Throughput Increase**: _calculate %_

---

## Summary Table

| Issue | Category | Fix | Baseline | Optimized | Delta |
|-------|----------|-----|----------|-----------|-------|
| N+1 Query | Backend | Prisma select | 401 queries | ? | ? |
| No Pagination | Backend | page/limit | 200 missions | 20 missions | -90% payload |
| Over-fetching | Backend | select fields | ~500KB | ~50KB | -90% |
| No Compression | Backend | gzip | - | - | ? |
| Unstable Props | Frontend | React.memo | ? re-renders | ? | ? |
| Expensive Compute | Frontend | useMemo | ? ms block | ? ms | ? |
| Double Fetch | Frontend | AbortController | 2 requests | 1 request | -50% |
| DOM Overload | Frontend | Slicing | ~4000 nodes | ~240 nodes | -94% |
| Unstable Callback | Frontend | useCallback | ? re-renders | ? | ? |

---

## Deployment

**Platform**: _Render / Railway_
**Live URL**: _your-app.onrender.com_
**Status**: _measure live endpoint performance_

---

## Final Conclusion

_Write a summary of total improvements across all 9 fixes, including:_
- _Overall performance improvement percentage_
- _Best-performing fix_
- _Most impactful fix (user experience)_
- _Lessons learned_
