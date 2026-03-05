# Zoho–Xero Connector & Quote-to-Cash Roadmap

This document outlines how to turn the RTA dashboard into a **connector** between Zoho CRM and Xero, with a **single pane of management** and **zero-touch quote-to-cash**.

---

## 1. Quote-to-Cash Flow (Target State)

```
Zoho CRM (Quote)  →  RTA Connector  →  Xero (Invoice)  →  Xero (Payment)  →  Sync back to Zoho
     │                      │                    │                    │
  Win / Close          Create draft          Send to customer    Mark paid
  quote stage          invoice in Xero      (or auto-send)      → update Zoho
```

**Zero touch** = Once a quote is marked Won in Zoho (or “Ready to invoice”), the system automatically creates the invoice in Xero and, when payment is recorded in Xero, can update Zoho so sales and finance stay in sync without manual steps.

---

## 2. Features to Add

### Phase A: Connector Core (Zoho ↔ Xero)

| # | Feature | Description | Zoho | Xero |
|---|---------|-------------|------|------|
| A1 | **Contact sync** | Keep contacts in sync so “Create invoice from quote” can use the right Xero Contact. | Read Contacts / Accounts | Create/update Contact by name/email; store mapping (Zoho ID ↔ Xero ContactID) in DB or config. |
| A2 | **Quote → Invoice (create in Xero)** | When a Zoho quote reaches “Won” (or a dedicated “Ready to invoice” stage), create a **draft** invoice in Xero with same contact, line items, amounts, currency, due date. | Read Quote + Quoted_Items | POST Invoices (Type=ACCREC, Contact, LineItems, DueDate, Reference=quote number). |
| A3 | **Link quote ↔ invoice** | Store Xero InvoiceID (and optionally InvoiceNumber) against the Zoho quote (custom field or app DB) so both systems stay linked. | Write custom field or use RTA DB | Read only (we create). |
| A4 | **Payment status → Zoho** | When an invoice is paid in Xero (or status becomes PAID), update Zoho (e.g. custom field “Invoice paid date” or “Xero invoice status”) so sales sees cash received. | Update quote/deal custom field | GET Invoices (status), or use webhooks if available. |

### Phase B: Single Pane of Management

| # | Feature | Description |
|---|---------|-------------|
| B1 | **Quote-to-cash pipeline (single view)** | One dashboard page: table/cards showing **Quote (Zoho)** → **Invoice (Xero)** → **Payment status**. Columns e.g.: Quote #, Customer, Amount, Quote stage, Xero invoice #, Invoice status, Paid amount, Paid date. Filter by date, customer, salesperson. |
| B2 | **Unified customer view** | One page per customer (or modal): Zoho (quotes, deals, contact) + Xero (invoices, balance, payments). Enables “see everything for this customer” in one place. |
| B3 | **Aged receivables (combined)** | Combine “expected” from Zoho (won but not yet invoiced) with Xero ageing (invoiced but not paid). One ageing report: 0–30, 30–60, 60–90, 90+. |
| B4 | **Expected cash (pipeline + receivables)** | Single number or chart: “Expected cash next 30/60/90 days” = Xero receivables due in that window + (optional) high-probability Zoho pipeline converting to invoice in that window. |

### Phase C: Automation & Zero Touch

| # | Feature | Description |
|---|---------|-------------|
| C1 | **Auto-create invoice on “Won”** | Background job or webhook (if Zoho supports): when quote stage = Won (or “Ready to invoice”), call connector to create draft invoice in Xero and link it. Optional: only for quotes above a certain value or with a “Sync to Xero” flag. |
| C2 | **Optional: auto-send invoice** | After creating draft in Xero, optionally call Xero to send the invoice to the customer (zero touch from quote to sent invoice). |
| C3 | **Payment sync job** | Periodic job (e.g. every 15 min): fetch Xero invoices that became PAID since last run; for each linked Zoho quote, update custom field (e.g. “Paid date”, “Xero status”). |
| C4 | **Matching & reconciliation** | Simple view: list Xero invoices with payments; allow “link to quote” if not yet linked. Improves data quality and supports reporting. |

### Phase D: Better Use of Zoho & Xero (No New Integrations)

| # | Feature | Description |
|---|---------|-------------|
| D1 | **Zoho: Deals + Quotes in one list** | Use both Deals and Quotes APIs; show “Deal → Quote” where applicable; use quote for line items when creating Xero invoice. |
| D2 | **Zoho: End-customer / TPM/OSS** | Expose “End customer” and product type (TPM, OSS, Professional Services) in dashboard and in quote-to-cash view (from existing or new Zoho fields). |
| D3 | **Xero: Payments and bank usage** | Use Xero Payments API (and optionally bank transactions) to show “paid” and “expected” cash; feed into B3/B4. |
| D4 | **Xero: Purchase bills (ACCPAY)** | You already support “invoices in”; add a dedicated view for supplier bills (due dates, ageing) and optionally “bills to pay” from a chosen bank account. |

---

## 3. Data & Technical Notes

### Storing the link (Quote ↔ Invoice)

- **Option 1 – Zoho custom field:** Add a field on Quote (e.g. “Xero_Invoice_ID”). When we create an invoice, update the quote with the Xero InvoiceID. Requires Zoho API scope to update Quotes.
- **Option 2 – App database:** Store in your DB: `zoho_quote_id`, `xero_invoice_id`, `xero_invoice_number`, `created_at`, `paid_at`. No Zoho schema change; single source of truth in RTA.

### Contact sync (Zoho → Xero)

- When creating an invoice from a quote, need a Xero **ContactID**.
- **Flow:** Get Contact name (and email if possible) from Zoho quote (Account/Contact). Search Xero for contact by name/email; if found use that ContactID; if not, create contact in Xero then use new ContactID.
- Requires: Zoho read (Account/Contact), Xero GET Contacts (search) + POST Contacts (create).

### Xero: Creating an invoice

- **Endpoint:** `POST https://api.xero.com/api.xro/2.0/Invoices`
- **Body:** Type (ACCREC), Contact { ContactID }, LineItems (Description, Quantity, UnitAmount, AccountCode, TaxType), Date, DueDate, Reference (e.g. quote number), Status (DRAFT or SUBMITTED).
- **AccountCode / TaxType:** Use a default revenue account and tax type from Xero settings, or make configurable per org.

### Zoho: Detecting “Won” and getting quote details

- You already fetch Quotes with `Quote_Stage`. When `Quote_Stage` contains “Won” (or a configured stage), treat as ready to invoice.
- Use existing Quotes API with `Quoted_Items` (or Product_Details) for line items; map to Xero LineItems (description, quantity, unit amount).

### Persistence (for production)

- **Xero tokens:** Replace in-memory `lib/xero-store.ts` with a persistent store (DB, Vercel KV, or env-backed server secret) so OAuth survives restarts and multi-instance.
- **Link table / config:** If you use Option 2 for quote–invoice link, add a table or key-value store for `quote_id`, `xero_invoice_id`, etc.

---

## 4. Suggested Implementation Order

1. **A2 + A3** – Create Xero invoice from Zoho quote (manual trigger first, e.g. “Create in Xero” button on quote detail) and store the link (Zoho custom field or DB).
2. **A1** – Contact sync: find or create Xero contact from Zoho quote’s account/contact so A2 can always attach a valid ContactID.
3. **B1** – Quote-to-cash pipeline page: list Zoho quotes (won/recent) with linked Xero invoice and payment status (from Xero).
4. **C1** – Automate: when quote stage = Won, call the same “create invoice” flow (with idempotency: if link already exists, skip).
5. **C3 + A4** – Payment sync job + update Zoho when invoice is paid.
6. **B2, B3, B4** – Unified customer view, aged receivables, expected cash.
7. **C2, C4, D1–D4** – Auto-send, reconciliation, and richer Zoho/Xero usage.

---

## 5. New Dashboard Pages / UI (Summary)

| Page / Area | Purpose |
|-------------|--------|
| **Quote to cash** | Pipeline: Quote → Invoice → Payment; filters; “Create in Xero” for unlinked won quotes. |
| **Customer 360** | Single view per customer: Zoho activity + Xero balance/invoices/payments. |
| **Aged receivables** | Combined ageing (Zoho “to be invoiced” + Xero “outstanding”) and optional expected cash. |
| **Connector settings** | (Optional) Configure which Zoho quote stage triggers invoice creation; default Xero account/tax; enable/disable auto-sync. |

---

## 6. Environment / Config (New or Existing)

- Existing: `ZOHO_*`, `XERO_*`, `NEXT_PUBLIC_APP_URL`.
- Optional: `ZOHO_QUOTE_WON_STAGE` (e.g. `Won`), `XERO_DEFAULT_ACCOUNT_CODE`, `XERO_DEFAULT_TAX_TYPE`, `ZOHO_CUSTOM_FIELD_XERO_INVOICE_ID` (if using Zoho custom field).
- If using DB for link: add table or use existing DB for `quote_invoice_links`.

---

This roadmap keeps Zoho as the source of truth for quotes and Xero for invoicing and cash; RTA is the connector and single pane for management and zero-touch automation.
