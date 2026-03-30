# Dashboard Completion Matrix

## Completion Criteria

A dashboard module is considered **Complete** when all conditions are true:

1. Data source finalized (`live` or explicit `live+fallback`).
2. Role gating is correctly enforced for restricted content.
3. Loading, empty, and error states are present.
4. Route is exposed correctly from dashboard navigation and quick access.
5. Page has no obvious placeholder copy (unless explicitly marked as preview).

## Route Status Matrix

| Route | Data Source | Role Gating | UX States | Status | Notes |
|---|---|---|---|---|---|
| `/dashboard` | Zoho + Xero | Partial (feature-level) | Yes | In Progress | Strong core dashboard; presentation workflow pending |
| `/dashboard/finances` | Xero + mock fallback | No | Yes | In Progress | Parent finance hub complete enough; downstream pages mixed |
| `/dashboard/finances/invoices` | Xero + mock fallback | No | Yes | In Progress | Operational with fallback; good filter coverage |
| `/dashboard/finances/bills` | Xero + mock fallback | No | Yes | In Progress | Operational with fallback; based on invoice endpoint |
| `/dashboard/finances/payments` | Mock | No | Yes | Pending | Needs live source or explicit preview marker |
| `/dashboard/finances/claims` | Mock | No | Yes | Pending | Needs live source or explicit preview marker |
| `/dashboard/finances/statements` | Mock | Yes (`master financials` + presentation mode) | Yes | Pending | Role guard exists; data still mock |
| `/dashboard/receivables` | Connector (Zoho + Xero) | No | Yes | In Progress | Good live composition; can improve defensive messaging |
| `/dashboard/quote-to-cash` | Connector (Zoho + Xero + links) | No | Yes | In Progress | Core flow exists; presentation integration pending |
| `/dashboard/customers` | Connector (Zoho) | No | Yes | In Progress | Functional; Xero details handled in customer detail |
| `/dashboard/customers/[customerId]` | Connector (Zoho + Xero) | No | Yes | In Progress | Functional detail page |
| `/dashboard/sales-leaderboard` | Zoho | No | Yes | In Progress | Good analytics page, live-backed |
| `/dashboard/sales-forecast` | Mock | No | Yes | Pending | Needs live aggregation endpoint |
| `/dashboard/payroll` | Mock | Yes (`payroll` + presentation mode) | Yes | Pending | Good structure; still mock-backed |
| `/dashboard/hrm` | Placeholder | Yes (`hrm` + presentation mode) | Minimal | Pending | Replace placeholder with concrete MVP |
| `/dashboard/settings/connector` | Env-backed API | No | Yes | In Progress | Read-only settings is acceptable for MVP |
| `/dashboard/connector/reconciliation` | Connector APIs | No | Yes | In Progress | Manual linking flow works |

## API Status Matrix

| API Route | Source | Status | Notes |
|---|---|---|---|
| `/api/dashboard/auth` | Internal auth cookie + env secret | Complete | Supports gate + account selection |
| `/api/dashboard/me` | Internal auth + roles | Complete | Capability projection endpoint |
| `/api/dashboard/finances/summary` | Xero + mock fallback | In Progress | Reliable fallback |
| `/api/dashboard/finances/invoices` | Xero + mock fallback | In Progress | Shared by invoices/bills |
| `/api/zoho/opportunities` | Zoho Deals/Quotes | In Progress | Central sales analytics source |
| `/api/connector/pipeline` | Zoho + Xero + link store | In Progress | Core connector path |
| `/api/connector/receivables` | Zoho + Xero + link store | In Progress | Live composition endpoint |
| `/api/connector/customers` | Zoho | In Progress | Works for customer list/detail |
| `/api/connector/create-invoice` | Zoho->Xero connector | In Progress | Core action endpoint |
| `/api/connector/reconciliation` (via pages) | Composite | In Progress | Driven by pipeline + link endpoints |

## Immediate Completion Targets

1. Top-5 presentation flow for `chris`, `craig`, `other`.
2. Sales forecast live endpoint integration.
3. Replace placeholder HRM with role-gated MVP blocks.
4. Add explicit preview tags for mock-backed modules where live integration is deferred.
5. Final regression pass on role transitions and presentation mode navigation.
