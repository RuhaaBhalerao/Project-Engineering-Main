# Movie Quote API - Load Testing Challenge

A Node.js + Express API that serves 1,000 famous English movie quotes. The API demonstrates the performance difference between unpaginated and paginated endpoints under concurrent load.

## Endpoints

- **GET /api/quotes/unpaginated** – Returns all 1,000 quotes in a single response (~200-300 KB)
- **GET /api/quotes?page=1&limit=20** – Returns 20 quotes per page with pagination metadata
- **POST /api/favorites** – Accepts `{ "quoteId": number }` and stores it
- **GET /health** – Health check endpoint

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the API

```bash
npm start
```

The API will start on `http://localhost:3001`

### 3. Manual Testing

Test the unpaginated endpoint:

```bash
curl -w "\nTime: %{time_total}s\nSize: %{size_download} bytes\n" \
  "http://localhost:3001/api/quotes/unpaginated" -o /dev/null -s
```

Test the paginated endpoint:

```bash
curl -w "\nTime: %{time_total}s\nSize: %{size_download} bytes\n" \
  "http://localhost:3001/api/quotes?page=1&limit=20" -o /dev/null -s
```

Test the POST endpoint:

```bash
curl -X POST http://localhost:3001/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"quoteId": 1}'
```

## Load Testing

### Install Artillery (if not already installed)

```bash
npm install -g artillery
```

### Run the Load Test

```bash
npm run test:load
```

Or:

```bash
artillery run load-test.yml
```

## Expected Findings

This API intentionally contains 5 hidden performance and implementation errors:

1. **Missing CORS headers** – No CORS configuration
2. **No chunked transfer encoding** – Large payload sent all at once
3. **Pagination off-by-one error** – Incorrect slice calculation
4. **Synchronous blocking** – Heavy computation in request handlers
5. **No input validation** – Missing validation on query and body parameters

Your load test will reveal these issues through response times, throughput, and error rates.

## Key Metrics to Compare

- **Unpaginated endpoint**: Large response size, high memory usage, slower response times under load
- **Paginated endpoint**: Small response size, faster response times, higher throughput
- **Difference**: Should see 5-10x improvement in response time and 100x+ improvement in payload size

## Files

- `index.js` – Express API server
- `load-test.yml` – Artillery load test configuration
- `processor.js` – Artillery hooks and processors
- `LOAD_TEST.md` – Load test results and analysis
