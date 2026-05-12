# Space Mission Logs — Frontend

React 18 + Vite dashboard for Mission Control. This codebase intentionally contains 5 frontend performance bugs.

## Frontend Bugs (5)

1. **Unstable Prop Trap** — MissionCard receives inline style prop, breaks React.memo
2. **Expensive Computation in Render** — Filter/sort logic runs on every render, not in useMemo
3. **Double Fetch on Mount** — useEffect missing dependency array and AbortController cleanup
4. **DOM Overload** — Renders all 200 mission cards immediately, no slicing
5. **Unstable Callback** — handleDelete defined inline without useCallback

## Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Features

- Display 200 space missions with crew and event logs
- Search missions by name
- Sort by name or launch date
- Responsive grid layout
- Delete missions (for testing)
