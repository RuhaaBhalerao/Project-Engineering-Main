# Monitor Log — Logging & Silent Failure Diagnosis

**Application:** DevLog API
**Branch:** feat/morgan-logging
**Date:** 2026-05-17

---

## Before

No logs / silent failure

Before: No logs were visible in Render (silent failure)

---

## Morgan Log Line

Paste the exact Morgan request log line observed in Render after adding Morgan and setting `NODE_ENV=production`.

Observed (local run with Morgan enabled):

POST /api/auth/signup 201 159.799 ms - 271
POST /api/auth/login 200 76.428 ms - 262
GET /api/logs 200 10.778 ms - 2

---

## Root Cause

Explain the root cause discovered via logs. Include file name, line number, and brief explanation of the issue.

Root cause (found via logs):

- Error: `Prisma connection error: Database \`shipdb\` does not exist on the database server at \`localhost:5432\`.`
- Triggered during Prisma calls in `src/routes/auth.js` at the following locations:
	- `src/routes/auth.js` — line ~20 (existingUser lookup)
	- `src/routes/auth.js` — line ~56 (login user lookup)
- Explanation: On startup the app could not connect to the configured Postgres database (missing database / migrations). This produced `PrismaClientInitializationError` on first DB calls and caused 500 responses. Locally the issue was resolved by running `npx prisma db push` (or by ensuring `npx prisma migrate deploy` runs during production deploy), which created the database/schema so subsequent requests succeeded.

---

## After Fix

Paste the updated Morgan log line (with increased response size) after the bug fix and redeploy.

After fix (local verification after running `npx prisma db push` and creating a test log entry):

POST /api/auth/signup 201 161.137 ms - 260
POST /api/auth/login 200 86.198 ms - 251
POST /api/logs 201 152.267 ms - 262
GET /api/logs 200 12.227 ms - 312

---

## Key Learning

This document records production log evidence and the fix applied. Replace placeholders above with the real log lines from the Render dashboard.
