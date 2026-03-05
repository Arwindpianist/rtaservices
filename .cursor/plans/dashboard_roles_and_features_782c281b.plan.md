---
name: Dashboard roles and features
overview: Add all roles-and-req.md dashboard features to the dashboard with hardcoded data and a simple role-based view, while structuring auth and data access so Outlook/MFA and Supabase can be added later without a rewrite.
todos: []
isProject: false
---

# Dashboard: Roles, Features, and Future Auth/DB Readiness

## Current state

- **Dashboard**: Single page at [app/dashboard/page.tsx](app/dashboard/page.tsx) with Zoho opportunities, pipeline KPIs, top customers/products/salespeople, and Xero connection.
- **Auth**: Cookie-based session via shared `DASHBOARD_SECRET` in [app/api/dashboard/auth/route.ts](app/api/dashboard/auth/route.ts); layout at [app/dashboard/layout.tsx](app/dashboard/layout.tsx) shows a "Secret" login form and a bar with logout.
- **No** Supabase or Outlook/MFA yet; no per-user identity.

---

## 1. Hardcoded user/role model (no DB)

- **Login page – preset buttons**: Replace the current "Secret" input with preset user buttons (Chris, Arnaud, Craig, Other staff). Clicking a button sends POST with `userId`; server sets session cookie. Optional: if DASHBOARD_SECRET is set, show "Access code" field first, then the four buttons. "Other staff" maps to same capabilities as Chris in `lib/dashboard-roles.ts`.
  - **Server**: Extend session to carry a **user id** (e.g. `chris`, `arnaud`, `craig`). Options:
    - **Option A (recommended for “hardcoded”)**: Keep one `DASHBOARD_SECRET` for login; after successful login, show a **user selector** (dropdown) and store chosen user id in cookie (e.g. `rta_dashboard_user=arnaud`). No DB, no extra env vars.
    - **Option B**: Multiple secrets in env (e.g. `DASHBOARD_SECRET_CHRIS`, `DASHBOARD_SECRET_ARNAUD`) and set user from which secret matched (more env to maintain).
  - **Shared role definition** in one place, e.g. `lib/dashboard-roles.ts`:
    - **Chris**: All invoices paid (supplier), expenses, all payment received; **no** salary, leave system, HRM.
    - **Arnaud**: Chris + salary, leave, HRM, master financial data.
    - **Craig**: Same as Arnaud but **no** HRM (doc says “temporarily same as Chris” — implement as Chris for now).
  - Export a type `DashboardRole` and a function `getRoleCapabilities(role: DashboardRole)` returning flags such as `canSeePayroll`, `canSeeHrm`, `canSeeMasterFinancials`, `canSeeSalaryAndLeave`, etc.
- **API**: POST `/api/dashboard/auth` accepts `{ userId }` (and optional `secret` when DASHBOARD_SECRET set); sets cookie; returns `{ ok: true, userId, role }`. GET `/api/dashboard/me` returns `{ userId, role, capabilities }` or 401.
- **Layout**: Unauthenticated = login UI (optional access code then four buttons). Authenticated = header with "Logged in as **X**" and Switch account dropdown; Log out unchanged. “Logged in as **Chris**” dropdown to switch user (for dev/demo). In production you’d remove or replace this with real identity.

This keeps everything hardcoded (no DB) while making it trivial to later replace “user from cookie” with “user from Outlook/MFA” or from Supabase.

---

## 2. Dashboard main page: quick access and role-based visibility

- **Quick access section** at the top (or sidebar) with links to the most important areas:
  - Finances (claims, payments, invoices, statements)
  - Payroll (if role can see it)
  - Sales forecast
  - Salesperson leaderboard
  - HRM (if role can see it)
- **Quick data**: Keep existing Zoho/Xero KPIs; add a few hardcoded summary cards (e.g. “Invoices out – to receive”, “Payments due”) that read from the same mock data used in sub-pages.
- **Customizable per user**: For now, “customization” = **role-based visibility**. No saved layout in DB; sections and nav links show/hide based on `getRoleCapabilities(role)`.

---

## 3. Finances section (hardcoded mock data)

- **Data**: Add `lib/mock-data/finances.ts` (or similar) with:
  - Claims: from clients, from vendor, from staff (arrays of `{ id, from, amount, status, date }`).
  - Invoices in (to pay) / out (to receive) with amounts and aging.
  - Payment lists: due, overdue, late, on time, early (each with customer/supplier/staff and amount).
  - Aging buckets: 0–30, 30–60, 60–90, >90 days (for invoices/payments).
  - Main account statements: one mock “customer”, “supplier”, “staff” statement (line items + balance).
- **UI**: Add dashboard sub-routes, e.g.:
  - `app/dashboard/finances/page.tsx` – landing with links to sub-views and summary numbers.
  - `app/dashboard/finances/claims/page.tsx` – claims from clients/vendor/staff (tabs or sections).
  - `app/dashboard/finances/payments/page.tsx` – filters or tabs: due / overdue / late / on time / early; entity type: customer / supplier / staff.
  - `app/dashboard/finances/invoices/page.tsx` – invoices in (to pay) vs out (to receive); optional aging table (0–30, 30–60, 60–90, >90).
  - `app/dashboard/finances/statements/page.tsx` – main customer, supplier, staff account statements (tabs or dropdown + table).
- **Role**: Show “Master financial data” (e.g. full statements or some columns) only for Arnaud; Chris/Craig see a reduced set if you want a distinction; otherwise same views, all from mock data.

---

## 4. Payroll section (hardcoded mock data)

- **Data**: `lib/mock-data/payroll.ts` – “Starts with SG”, e.g. Singapore-centric list of payslips/entries with: country, department, role, employee, pay period, pay date, pay amount, pay method, pay status, pay type, pay frequency, taxes.
- **UI**: `app/dashboard/payroll/page.tsx` – table with filters: country, department, role, employee, pay period/date, pay amount, method, status, type, frequency, and a “taxes” summary or column. All filters client-side on mock data.
- **Visibility**: Shown only if `canSeePayroll` (Arnaud; Chris/Craig per doc don’t see payroll — confirm requirement). If “Craig = temporarily same as Chris”, then Chris and Craig both hide payroll until you change the spec.

---

## 5. Sales forecast

- **Data**: Either reuse Zoho opportunities and derive “forecasted sales next 12 months”, “deal closing %”, “target closing month”, “current quarter”, “closing stages”, or add `lib/mock-data/sales-forecast.ts` with the same structure for when Zoho isn’t configured.
- **UI**: `app/dashboard/sales-forecast/page.tsx` – 12-month forecast (chart or table), deal closing possibility %, target closing month, current quarter summary, and closing stages (can align with existing Zoho stage terminology used in [app/dashboard/page.tsx](app/dashboard/page.tsx)).

---

## 6. Salesperson leaderboard

- **Current**: [TopSalespeopleChart](app/dashboard/page.tsx) already shows top salespeople; ensure it’s “Top 10 by closed value” (limit to 10, sort by closed).
- **Placement**: Keep on main dashboard and/or add a dedicated `app/dashboard/sales-leaderboard/page.tsx` linked from quick access.

---

## 7. Arnaud presentation mode

- **Mechanism**: Query param or toggle (e.g. `?presentation=true` or a button “Presentation mode”) that:
  - Hides: HRM, payroll, master financial data.
  - Shows: All other features (finances at non-master level, sales forecast, leaderboard, etc.) in a presentation-friendly layout (e.g. larger cards, fewer controls).
- **Implementation**: A small context or URL state read by the dashboard layout and sub-pages; when true, override visibility so HRM/payroll/master financials are hidden even for Arnaud.

---

## 8. Future: Outlook-email login and MFA

- **Auth abstraction**: Keep all session logic behind a thin layer (e.g. `lib/dashboard-auth.ts` and API route). Today: read/write cookie with `userId` (and optional `role`). Later:
  - Replace “login with secret” by “login with Outlook” (e.g. OAuth 2 / OpenID with Microsoft).
  - After OAuth, resolve user (and role) from email (e.g. hardcoded map `email -> userId/role` or later from DB).
  - Add MFA step (e.g. Microsoft MFA as part of same flow, or a second factor). Session cookie (or Supabase session) would still store the same conceptual `userId`/`role` so the rest of the app is unchanged.
- **Concrete steps when you’re ready**: (1) Add Microsoft auth provider (e.g. NextAuth with Azure AD, or custom OAuth). (2) Replace POST `/api/dashboard/auth` body from `secret` to `code` (or token) and validate with Microsoft. (3) Set same cookie (or Supabase session) with `userId`/`role`. (4) Optional: add a small “MFA required” middleware or step after first factor.

---

## 9. Future: Optional Supabase

- **Optional dependency**: Add `@supabase/supabase-js` (and optionally `@supabase/ssr` for Next) only when you decide to use it. Use env: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or anon key) and gate all Supabase usage behind `if (process.env.NEXT_PUBLIC_SUPABASE_URL)`.
- **Initial use cases**: (1) **Auth**: Store users and sessions in Supabase Auth; map email to `userId`/`role` in a `profiles` or `users` table. (2) **Dashboard data**: Replace mock data with Supabase tables (claims, invoices, payments, payroll, statements); keep the same TypeScript types and API shape so pages just switch from importing mock data to calling `getClaims()`, `getInvoices()`, etc., that read from Supabase when configured.
- **Structure**: Create a small `lib/supabase.ts` (or `lib/data/index.ts`) that exports `getClaims()`, `getInvoices()`, … and internally either return mock data or query Supabase. No DB required for the current “hardcoded” phase.

---

## 10. File and route summary


| Area                  | Action                                                                                                                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Roles / auth**      | Add `lib/dashboard-roles.ts` (role type + capabilities). Login: preset buttons (Chris, Arnaud, Craig, Other staff); optional access-code gate if `DASHBOARD_SECRET` set. POST auth accepts `userId`; GET `/api/dashboard/me` returns user + capabilities. Header: “Switch account” dropdown with same four options. |
| **Dashboard home**    | Add quick-access links and role-based visibility; optional summary cards from mock finances.                                                                                                                                                                                                                        |
| **Finances**          | Add `lib/mock-data/finances.ts`; routes under `app/dashboard/finances/` (main, claims, payments, invoices, statements).                                                                                                                                                                                             |
| **Payroll**           | Add `lib/mock-data/payroll.ts`; `app/dashboard/payroll/page.tsx`; visible only when `canSeePayroll`.                                                                                                                                                                                                                |
| **Sales forecast**    | Add `lib/mock-data/sales-forecast.ts` (optional) or use Zoho; `app/dashboard/sales-forecast/page.tsx`.                                                                                                                                                                                                              |
| **Leaderboard**       | Ensure top 10 by closed value; add `app/dashboard/sales-leaderboard/page.tsx` if desired.                                                                                                                                                                                                                           |
| **Presentation mode** | Query param or toggle; layout + pages hide HRM/payroll/master financials when on.                                                                                                                                                                                                                                   |
| **Later**             | Auth layer swap for Outlook + MFA; optional `lib/supabase.ts` and env-gated Supabase for users and data.                                                                                                                                                                                                            |


---

## 11. Suggested implementation order

1. **Roles and session** – `lib/dashboard-roles.ts` (users: chris, arnaud, craig, other; capabilities). Login page: preset buttons (Chris, Arnaud, Craig, Other staff); optional access-code step when `DASHBOARD_SECRET` set. Auth API: POST with `userId` sets session cookie; GET `/api/dashboard/me` returns current user and capabilities. Header: “Logged in as **X**” + Switch account dropdown (same four options).
2. **Dashboard main page** – Quick access links + role-based visibility; optional small finance summary from mock data.
3. **Mock data** – `lib/mock-data/finances.ts`, `lib/mock-data/payroll.ts`, (optional) `lib/mock-data/sales-forecast.ts`.
4. **Finances** – Sub-routes and pages (claims, payments, invoices, statements) consuming mock data.
5. **Payroll** – Single page with filters; gate by `canSeePayroll`.
6. **Sales forecast** – Page with 12-month forecast, closing %, quarter, stages.
7. **Leaderboard** – Top 10 by closed value + dedicated page if needed.
8. **Presentation mode** – Toggle/query param and visibility overrides.

After that, integrating Outlook/MFA and Supabase will be a matter of swapping the auth implementation and optionally the data layer behind the same APIs and types.