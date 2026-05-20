---
name: granular_module_access_control
overview: Add tenant-aware, module-level access control managed from the superadmin console, plus centralized Xero governance in Neon so Arnaud can authorize once and only Arnaud/superadmin can access Xero-backed data.
todos:
  - id: schema-module-access
    content: Add Neon schema tables/indexes for modules, role permissions, user overrides, tenant toggles
    status: completed
  - id: service-module-access
    content: Implement module access service/resolver with precedence logic and CRUD helpers
    status: completed
  - id: session-integration
    content: Expose resolved module permissions through auth-session current user helper
    status: completed
  - id: api-admin-module-access
    content: Add superadmin APIs to manage role matrix, user overrides, and module toggles with audit logging
    status: completed
  - id: ui-superadmin-module-access
    content: Build superadmin module access page and add header navigation
    status: completed
  - id: enforce-phase-1
    content: Apply module permission guard to selected dashboard and pipeline APIs
    status: completed
  - id: dehardcode-staff-dashboard
    content: Inventory and migrate hardcoded role/module behaviors from staff/dashboard pages into superadmin-managed policies
    status: completed
  - id: xero-governance-model
    content: Refactor Xero integration to shared Neon token governance with Arnaud-authorized connection and strict visibility gates
    status: completed
  - id: zoho-xero-payment-tracking
    content: Add superadmin/Arnaud payment-tracking view mapping Zoho quotes to Xero invoice/payment status
    status: completed
  - id: seed-and-rollout
    content: Seed defaults from current RBAC model and validate incremental rollout
    status: completed
isProject: false
---

# Granular Module Access Control Plan

## Goal

Introduce true module-level permission management (beyond static role/person checks), so superadmin can control access by module and action for each role/user from the console.

## Current Baseline

- Static role capability map in [c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\rbac.ts](c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\rbac.ts)
- Session user + capability resolution in [c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\auth-session.ts](c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\auth-session.ts)
- Admin-protected APIs using `canManageUsers` checks under [c:\Users\arwin\Desktop\ADPMC\rtaservices\app\api\admin(c:\Users\arwin\Desktop\ADPMC\rtaservices\app\api\admin
- Superadmin route guard in [c:\Users\arwin\Desktop\ADPMC\rtaservices\middleware.ts](c:\Users\arwin\Desktop\ADPMC\rtaservices\middleware.ts)
- Existing Neon schema/migrations in [c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\neon-schema.ts](c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\neon-schema.ts)

## Implementation Steps

### 1) Extend Neon schema for policy storage

Add policy tables to [c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\neon-schema.ts](c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\neon-schema.ts):

- `access_modules` (module catalog: key, label, enabled)
- `role_module_permissions` (role defaults per module/action)
- `user_module_overrides` (per-user overrides)
- `tenant_module_toggles` (global module on/off)

Also add indexes/unique constraints for deterministic lookup and idempotent writes.

### 2) Add a policy repository/service layer

Create `lib/module-access.ts` to encapsulate:

- list modules
- get effective permissions (role defaults + user overrides + tenant toggle)
- upsert role permission rows
- upsert user overrides
- toggle modules globally
- produce normalized permission shape for server/client use

### 3) Integrate effective permissions into session access helpers

Update [c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\auth-session.ts](c:\Users\arwin\Desktop\ADPMC\rtaservices\lib\auth-session.ts) to return:

- existing static capabilities (for backward compatibility)
- resolved module permissions from `module-access` service

This keeps current code working while enabling gradual migration.

### 4) Add superadmin APIs for module policy management

Add endpoints under [c:\Users\arwin\Desktop\ADPMC\rtaservices\app\api\admin(c:\Users\arwin\Desktop\ADPMC\rtaservices\app\api\admin:

- `GET/PUT /api/admin/module-access/roles`
- `GET/PUT /api/admin/module-access/users`
- `GET/PUT /api/admin/module-access/modules`

All endpoints:

- require `canManageUsers`
- write audit events via existing audit utilities in `lib/users.ts`

### 5) Add superadmin Module Access UI

Add new page and navigation entry:

- `app/dashboard/superadmin/module-access/page.tsx`
- update [c:\Users\arwin\Desktop\ADPMC\rtaservices\components\dashboard\SuperadminHeader.tsx](c:\Users\arwin\Desktop\ADPMC\rtaservices\components\dashboard\SuperadminHeader.tsx)

UI sections:

- Module toggles (global enable/disable)
- Role permission matrix (view/edit/admin or boolean actions)
- User overrides table (search by email/name, override per module)
- Save/apply actions with audit feedback

### 6) Enforce module permissions in selected APIs and routes (phase 1)

Start with high-value surfaces:

- pipeline draft routes under `app/api/pipeline-drafts/*`
- dashboard finance/sales endpoints under `app/api/dashboard/*`

Use a single helper guard (in `lib/module-access.ts`) so enforcement is consistent and easy to roll out module-by-module.

### 7) Add migration/backfill defaults

On bootstrap:

- seed `access_modules`
- map existing `rbac.ts` capabilities into default role-module permissions
- preserve current behavior until explicit policy edits happen

### 8) Validation and rollout

- Add unit/integration coverage for effective permission resolution and precedence rules.
- Verify no regressions for existing roles.
- Roll out enforcement incrementally (start read-only checks/logging, then enforce deny).

## Permission Precedence Model

```mermaid
flowchart TD
  tenantToggle[TenantModuleToggle] --> effectivePerm[EffectivePermission]
  roleDefault[RoleModulePermission] --> effectivePerm
  userOverride[UserModuleOverride] --> effectivePerm
  effectivePerm --> apiGuard[APIAndRouteGuard]
```



Priority:

1. Tenant toggle deny (hard stop)
2. User override
3. Role default
4. Fallback deny

## Deliverables

- Schema + seed updates
- Module access repository + resolver
- Superadmin management APIs
- Superadmin module access page
- Phase-1 guarded APIs
- Audit logs for all policy changes

