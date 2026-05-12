# Retro Game High Score Wall

A full-stack performance debugging challenge with 6 intentional bugs.

## Project Structure

```
├── backend/           # Node + Express + Prisma
├── frontend/          # React 18 + Vite + Tailwind
└── BASELINE.md        # Performance measurements
```

## Quick Start

### Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

## Performance Issues (6 total)

### Backend (3)
1. No Pagination
2. Over-fetching  
3. No Compression

### Frontend (3)
4. Double Fetch on Mount
5. Expensive Computation in Render
6. Unstable Callback

See BASELINE.md for measurements.
