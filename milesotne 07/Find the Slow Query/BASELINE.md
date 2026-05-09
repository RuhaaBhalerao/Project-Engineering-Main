# ShopLens — Performance Baseline

Date: 2026-05-09

## Environment
- Database: PostgreSQL on `localhost:5432/postgres`
- Seeded data: 5,000 users, 50,000 products, 25,000 orders, 75,000 order items, 100,000 activities

## Baseline Metrics

### Query 1 — `GET /api/products?category=electronics`
- Response time: `34,223.71 ms`
- Payload size: `23,950,377 bytes` (`~22.84 MB`)
- Database queries observed: `1`
- Compression header: none

### Query 2 — `GET /api/orders/recent`
- Response time: `953.52 ms`
- Payload size: `4,297 bytes`
- Database queries observed: `2`
- Compression header: none

### Query 3 — `GET /api/users/:id/activity`
- Sample user id: `cmoyksq5o0000bkwca1rn5cdx`
- Response time: `3,199.85 ms`
- Payload size: `178,171 bytes` (`~174 KB`)
- Database queries observed: `1`
- Compression header: none

## After Fixes

### Query 1 — `GET /api/products?category=electronics&page=1&limit=20`
- Response time: `832.69 ms`
- Payload size: `3,554 bytes`
- Database queries observed: `2`
- Compression header: `gzip`

### Query 2 — `GET /api/orders/recent`
- Response time: `60.8 ms`
- Payload size: `3,557 bytes`
- Database queries observed: `1`
- Compression header: `gzip`

### Query 3 — `GET /api/users/:id/activity`
- Sample user id: `cmoyksq5o0000bkwca1rn5cdx`
- Response time: `31.57 ms`
- Payload size: `4,014 bytes`
- Database queries observed: `1`
- Compression header: `gzip`

## Improvement Summary
- Product payload size reduction: about `99.99%`
- Product response time reduction: about `97.56%`
- Orders response time reduction: about `93.62%`
- Activity response time reduction: about `99.02%`

## Suspicious Findings
- `backend/routes/products.js` returns every matching product row with no pagination and no explicit `select`.
- `prisma/schema.prisma` intentionally has no index on `Product.category`, which explains the very slow category filter.
- `backend/routes/orders.js` fetches recent orders and then resolves users separately; Prisma appears to batch some of the concurrent lookups, but the endpoint still spends nearly a second on 20 rows.
- `backend/routes/users.js` returns the full activity rows, including large text fields, which makes the payload much larger than the frontend needs.
- All post-fix responses returned `Content-Encoding: gzip` when the client advertised `Accept-Encoding: gzip`.

## Notes
- The baseline was captured before any optimization changes.
- Prisma query logging was measured with a temporary throwaway script so the application code itself remained untouched during baseline collection.