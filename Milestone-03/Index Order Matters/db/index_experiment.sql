-- Composite Index Order Experiment
-- Run this file after schema.sql and sample_data.sql are loaded.

-- Optional stats refresh for consistent planner decisions.
ANALYZE employees;

-- 1) Baseline query with current schema index state.
EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
  AND salary > 50000;

-- 2) Explicitly test incorrect index order.
DROP INDEX IF EXISTS idx_department_salary;
DROP INDEX IF EXISTS idx_salary_department;
CREATE INDEX idx_salary_department ON employees(salary, department);

EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
  AND salary > 50000;

-- 3) Apply corrected index order for this filter pattern.
DROP INDEX IF EXISTS idx_salary_department;
CREATE INDEX idx_department_salary ON employees(department, salary);

EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
  AND salary > 50000;

-- 4) Optional second query from queries.sql
EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Engineering'
  AND salary >= 70000;
