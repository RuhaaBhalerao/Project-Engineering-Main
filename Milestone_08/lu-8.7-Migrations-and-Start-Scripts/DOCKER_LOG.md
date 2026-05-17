DOCKER_LOG - containerization notes

Project: DevLog API (Milestone_08/lu-8.7-Migrations-and-Start-Scripts)

Files reviewed:
- package.json
- src/server.js
- src/routes/health.js
- prisma/schema.prisma

Findings:
- `package.json` start script: "node src/app.js" (but actual server file present is `src/server.js`). The project also exposes dev script `nodemon src/server.js`.
- Default port: The server reads `process.env.PORT || 3000` — defaulting to port 3000 when `PORT` is not set.
- Server start: `src/server.js` calls `app.listen(PORT, ...)` to start the Express server.
- Health route: `GET /api/health` implemented in `src/routes/health.js`. It returns JSON { status: "ok", timestamp: <ISO string>, uptime: <seconds> } with HTTP 200 and does not perform DB access.
- Prisma: `prisma/schema.prisma` exists and uses `provider = "postgresql"` with `url = env("DATABASE_URL")`. The project requires the Prisma Client to be generated before runtime.

Implications for Dockerfile (to be created):
- Must run `npx prisma generate` during the image build after copying `prisma/` so the generated client is available in the image.
- The container should rely on runtime environment variables passed via `--env-file .env` (do not bake secrets into image).
- The app listens on `PORT` (default 3000); the Dockerfile will expose `3000` and the run command should map host 3000 to container 3000.

Next steps (performed next): create `Dockerfile` and `.dockerignore` in this project folder, then provide build/run instructions.
