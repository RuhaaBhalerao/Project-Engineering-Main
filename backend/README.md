# Retro Game High Score Wall - Backend

## Setup

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Runs on `http://localhost:3001`

## API Endpoints

- `GET /api/scores` - List all scores (BUGGY: returns all 300+, no pagination)
- `GET /api/scores/:id` - Get specific score
- `POST /api/scores` - Add new score
- `DELETE /api/scores/:id` - Delete score
- `GET /api/health` - Health check
