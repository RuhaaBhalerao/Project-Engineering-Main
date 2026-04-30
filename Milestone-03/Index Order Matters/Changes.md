# Composite Index Investigation Notes

## Query Investigated

```sql
SELECT *
FROM employees
WHERE department = 'Sales'
	AND salary > 50000;
```

## Original Index

```sql
CREATE INDEX idx_salary_department ON employees(salary, department);
```

## Issue Observed

- The index existed, but query performance was still poor.
- The query filter pattern starts with `department = ...` and then applies a salary range.
- With index order `(salary, department)`, PostgreSQL cannot align as effectively with the filter pattern for fast narrowing.
- As data grows, this mismatch leads to inefficient plans and higher scan cost.

## Incorrect Index Experiment

I recreated and tested the incorrect index order:

```sql
DROP INDEX IF EXISTS idx_salary_department;
CREATE INDEX idx_salary_department ON employees(salary, department);

EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
	AND salary > 50000;
```

Observation summary:

- Plan was not optimal for this filter pattern.
- Performance did not improve meaningfully as expected.

## Fixed Index

```sql
DROP INDEX IF EXISTS idx_salary_department;
CREATE INDEX idx_department_salary ON employees(department, salary);

EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
	AND salary > 50000;
```

## Why the Corrected Index Works Better

- `department` is the leading indexed column and is used as equality filter first.
- `salary` is the second indexed column and is used as range condition.
- This matches the query's access pattern and reduces scanned rows.
- The planner can use the index path more effectively compared to the reversed order.

## Left-Most Prefix Rule

For a composite index `(a, b)`, efficient index usage starts from `a` (the left-most column). Queries that begin with `b` only are less likely to use the index efficiently. Here, `(department, salary)` follows this rule for the given query.

## Performance Comparison Template

Paste your actual EXPLAIN ANALYZE highlights below:

- Before fix (wrong order):
	- Scan type:
	- Execution time:
	- Rows/filters:

- After fix (correct order):
	- Scan type:
	- Execution time:
	- Rows/filters:

    Even after creating the correct index, PostgreSQL still used Seq Scan.

Reason:
The dataset was very small, so sequential scan was cheaper than using the index.

To demonstrate index usage, sequential scans were disabled using:
SET enable_seqscan = OFF;

After this, PostgreSQL used Index Scan, proving that the index was correctly designed.