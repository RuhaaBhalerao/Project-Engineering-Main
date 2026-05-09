## Problems in Existing Schema

1. No tenant_id column
- All users share same data
- One query can expose all users

2. No tenant isolation in projects
- Any user can access any project

3. Sensitive fields exposed
- salary is visible to all users

4. No role-based access
- No restriction for admin/manager/user

5. No indexing
- Queries will be slow at scale

6. Cross-tenant risk
- Foreign keys do not enforce tenant boundaries
