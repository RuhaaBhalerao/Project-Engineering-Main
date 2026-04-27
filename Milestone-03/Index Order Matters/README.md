# Index Order Matters - Challenge 4

## Objective

Investigate why an existing composite index is not improving query performance, then fix the index order so PostgreSQL can optimize the filter pattern correctly.

## Repository Structure

```
Index Order Matters/
|-- README.md
|-- Changes.md
`-- db/
		|-- schema.sql
		|-- sample_data.sql
		|-- queries.sql
		`-- index_experiment.sql
```

## Local Setup

1. Open PostgreSQL with psql.
2. Create and connect to the database:

```sql
CREATE DATABASE employee_reporting;
\c employee_reporting
```

3. Load schema and data:

```sql
\i db/schema.sql
\i db/sample_data.sql
```

## Investigation Steps

Run the full experiment script:

```sql
\i db/index_experiment.sql
```

Or run manually in order:

1. Baseline query plan with current index.
2. Explicit incorrect composite index order.
3. Corrected composite index order.
4. Compare query plans and timings.

## Query Under Test

```sql
SELECT *
FROM employees
WHERE department = 'Sales'
	AND salary > 50000;
```

## Why Order Matters

Composite index performance follows the left-most prefix rule. With:

```sql
CREATE INDEX idx_department_salary ON employees(department, salary);
```

PostgreSQL can first narrow rows by `department` and then apply the salary range efficiently. Reversing order to `(salary, department)` is less effective for this filter pattern.

## What To Submit

1. Updated `Changes.md` with your observations and explanation.
2. SQL statements used for the experiment (`db/index_experiment.sql`).
3. Public GitHub repo with these files.
4. Pull Request link.
5. Google Drive video link (3-5 minutes) explaining:
	 - Slow query
	 - Incorrect index test
	 - Corrected index
	 - Plan/timing comparison
	 - Left-most prefix rule

## Notes

- Do not change table structure for this challenge.
- Capture screenshots of EXPLAIN ANALYZE output before and after the fix.
- If PostgreSQL still chooses a sequential scan on tiny datasets, use `ANALYZE employees;` and retest.
