# Support System – Final Goal

## Target architecture

### User side (RTA website)

| Component | Purpose | Status |
|-----------|---------|--------|
| **Support form** | Submit enquiries → create Lead in Zoho CRM | ✅ Live at `/support/contact` (Zoho Web-to-Lead) |
| **Chat widget** | Live chat (Zoho SalesIQ) | ✅ Wired: set `NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE` in env to enable site-wide |
| **Ticket status page** | Customer checks status of support ticket | ✅ Placeholder at `/support/status` – connect to Zoho CRM when ready |

### Backend (Zoho CRM)

| Module | Purpose |
|--------|--------|
| **Leads** | From support form and other sources |
| **Contacts** | Linked to Leads / orgs |
| **Support Tickets** | Custom module; staff manage lifecycle here |

Staff handle all support workflow inside Zoho CRM (no separate support backend).

---

## Implementation notes

- **Support form:** Posts to Zoho Web-to-Lead; return URL `/support/thank-you`. Form is styled to match the site. Optional: map form to Lead + create Support Ticket in Zoho (workflow/automation in CRM).
- **Chat widget:** `components/ChatWidget.tsx` is included in the root layout. Set `NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE` in `.env.local` (or deployment env) to your Zoho SalesIQ widget code to show the chat site-wide.
- **Ticket status page:** Route `/support/status` exists with a placeholder. Customer will enter ticket reference (+ email or token) and see status (e.g. Open / In progress / Resolved). Options:
  - Zoho CRM API (server-side): look up Support Ticket by ref, return status.
  - Zoho Creator / external “portal” that reads CRM and is embedded or linked.
  - Simple “coming soon” or “check your email” page until the lookup is implemented.

---

## Suggested order

1. ✅ Support form live and styled.
2. ✅ Chat widget: set `NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE` and deploy.
3. Define Support Ticket custom module and fields in Zoho CRM.
4. Implement ticket status lookup on `/support/status` (Zoho CRM API or Creator portal).
