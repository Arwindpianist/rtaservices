# Deploying to rtaservices.net - Environment & tokens

Steps to move from localhost to **rtaservices.net**. The main site is **https://www.rtaservices.net/** (canonical; bare `rtaservices.net` redirects to `www`).

---

## 1. Set production environment variables

Where you set them depends on where you host:

- **Vercel**: Project → Settings → Environment Variables  
- **Netlify**: Site → Build & deploy → Environment  
- **Other host**: Use their “Environment variables” or “Config” UI

Add (or override) these for **Production**:

| Variable | Purpose | Production value |
|----------|---------|------------------|
| `NEXT_PUBLIC_APP_URL` | Base URL for OAuth redirects and links | `https://www.rtaservices.net` |
| `DASHBOARD_SECRET` | Shared secret for dashboard login | **Generate a new, strong secret** (e.g. 32+ random chars). Do **not** reuse the one from `.env.local`. |
| `ZOHO_CLIENT_ID` | Zoho OAuth app | Same as dev (or a separate Zoho app for production) |
| `ZOHO_CLIENT_SECRET` | Zoho OAuth app | Same as dev (or production app secret) |
| `ZOHO_REFRESH_TOKEN` | Zoho API access | See **Zoho refresh token** below |
| `ZOHO_QUOTE_WON_STAGE` | Connector: stage that triggers invoice | `Won` (or your stage name) |
| `ZOHO_QUOTE_NUMBER_FIELD` | Optional | e.g. `Auto_Number_1` |
| `ZOHO_CURRENCY_OPTION_FIELD` | Optional | e.g. `Currency_2` |
| `ZOHO_CUSTOM_FIELD_XERO_PAID_DATE` | Optional: Zoho field for paid date | Leave empty or set API name of custom field |
| `ZOHO_ACCOUNTS_URL` | Optional (non‑EU) | `https://accounts.zoho.com` |
| `ZOHO_CRM_DOMAIN` | Optional (non‑EU) | `https://www.zohoapis.com` |
| `XERO_CLIENT_ID` | Xero OAuth app | Same as dev (or production app) |
| `XERO_CLIENT_SECRET` | Xero OAuth app | Same as dev (or production app) |
| `XERO_DEFAULT_ACCOUNT_CODE` | Connector: revenue account | e.g. `200` (must exist in Xero) |
| `XERO_DEFAULT_TAX_TYPE` | Connector: tax type | e.g. `NONE` |
| `XERO_AUTO_SEND_INVOICE` | Auto‑submit new invoices | `false` or `true` |

Use **exactly** `https://www.rtaservices.net` for `NEXT_PUBLIC_APP_URL`. All OAuth redirect URIs must use this base (with `www`).

---

## 2. Xero: Redirect URI and re‑connect

1. **Xero Developer Portal**  
   - Go to [developer.xero.com](https://developer.xero.com) → your app → Configuration.  
   - Add (or set) **Redirect URI**:  
     `https://www.rtaservices.net/api/xero/callback`  
   - Save.

2. **No token copy from localhost**  
   - Xero tokens are stored in `data/xero-tokens.json` (or in memory) on the server.  
   - Production is a different deployment, so it has no access to your local tokens.

3. **Connect Xero in production**  
   - After deploy, open **https://www.rtaservices.net/dashboard**.  
   - Use your app’s “Connect Xero” (or equivalent) flow.  
   - Sign in to Xero and approve; the callback will run at `https://www.rtaservices.net/api/xero/callback` and save tokens on the production server.

---

## 3. Zoho: Refresh token for production

Zoho refresh tokens are tied to the redirect URI used when they were generated.

- **If you use the same Zoho app and same redirect URI**  
  You can try copying the **refresh token** from `.env.local` into production. It may work if the app’s redirect URI in Zoho matches how you generated the token.

- **If production uses a different domain (e.g. www.rtaservices.net)**  
  1. In Zoho API Console, add the production redirect URI (e.g. `https://www.rtaservices.net/` or the exact callback Zoho expects).  
  2. Generate a **new refresh token** using that production redirect URI (same flow you used for localhost: auth in browser, get code, exchange for refresh token).  
  3. Put that new **refresh token** in production env as `ZOHO_REFRESH_TOKEN`.

Keep **client id** and **client secret** in production env the same as (or set to) the app you use for production.

---

## 4. Checklist before go‑live

- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.rtaservices.net` everywhere (env and Xero/Zoho config).
- [ ] Xero app redirect URI is `https://www.rtaservices.net/api/xero/callback`.
- [ ] Zoho refresh token is for the correct Zoho app and redirect URI (or newly generated for `https://www.rtaservices.net`).
- [ ] `DASHBOARD_SECRET` is a new, strong value only in production env (never in repo).
- [ ] After first deploy, open **https://www.rtaservices.net/dashboard** and complete “Connect Xero” once so production has tokens.
- [ ] If you use file persistence (`data/`), ensure the production environment can write to that directory (e.g. Vercel serverless may need a different store; see plan for Vercel KV/DB).

---

## 5. Optional: Vercel

- Add all variables under **Settings → Environment Variables**, scope to **Production**.
- Redeploy after changing env so the new values are applied.
- For Xero token persistence on serverless, consider moving from file to **Vercel KV** or a DB and updating `lib/xero-store.ts` when you’re ready.

---

## Quick reference: copy from .env.local

You can **copy** these to production **after** adjusting as above:

- `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_QUOTE_WON_STAGE`, optional Zoho vars  
- `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET`, `XERO_DEFAULT_ACCOUNT_CODE`, `XERO_DEFAULT_TAX_TYPE`, `XERO_AUTO_SEND_INVOICE`

You **must change**:

- `NEXT_PUBLIC_APP_URL` → `https://www.rtaservices.net`
- `DASHBOARD_SECRET` → new strong production secret

You **may need to change**:

- `ZOHO_REFRESH_TOKEN` → new token if production redirect URI differs

You **do not copy** (generate on production):

- Xero tokens → connect Xero once from the live dashboard after deploy
