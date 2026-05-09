## Sensitive Fields
- salary -> only visible to admin

## Tenant Isolation
- All tables include tenant_id
- Queries must filter by tenant_id

## Role-Based Access

Admin:
- Full access within tenant
- Can view salary

Manager:
- Can view team members
- Cannot view salary

User:
- Can only view own data
- No access to others

## Security Decisions
- tenant_id ensures strict isolation
- UNIQUE(email, tenant_id) prevents conflicts
- Foreign keys enforce valid relationships

## Indexing Strategy
- tenant_id indexed for fast queries
