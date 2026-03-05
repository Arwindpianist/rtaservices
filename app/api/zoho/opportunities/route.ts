import { NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';

function getSinceDate(period: string): string | null {
  const now = new Date();
  let since: Date;
  switch (period) {
    case 'week':
      since = new Date(now);
      since.setDate(since.getDate() - 7);
      break;
    case 'month':
      since = new Date(now);
      since.setDate(since.getDate() - 30);
      break;
    case 'quarter':
      since = new Date(now);
      since.setDate(since.getDate() - 90);
      break;
    case 'year':
      since = new Date(now);
      since.setDate(since.getDate() - 365);
      break;
    default:
      return null;
  }
  return since.toISOString();
}

async function getAccessToken(): Promise<{ token: string | null; error?: string }> {
  return getZohoAccessToken();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'all';
  const debug = searchParams.get('debug') === '1';

  const { token: accessToken, error: tokenError } = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: tokenError || 'Zoho not configured or token refresh failed', opportunities: [], winPercentage: null },
      { status: 200 }
    );
  }

  const sinceDate = getSinceDate(period);
  const reqHeaders: Record<string, string> = {
    Authorization: `Zoho-oauthtoken ${accessToken}`,
  };
  const ZOHO_CRM_DOMAIN = getZohoCrmDomain();

  const filterByDate = <T extends { Created_Time?: string; createdAt?: string }>(records: T[]): T[] => {
    if (!sinceDate) return records;
    return records.filter((r) => {
      const dt = r.Created_Time ?? r.createdAt;
      return dt && new Date(dt) >= new Date(sinceDate);
    });
  };

  try {
    const QUOTE_FIELDS = [
      'Auto_Number_1', 'Currency_2', 'Grand_Total', 'Quote_Stage', 'Subject', 'Description',
      'Account_Name', 'Deal_Name', 'Contact_Name', 'Valid_Till', 'Quote_Date',
      'Payment_Terms', 'Delivery_Terms', 'Delivery_Time', 'Carrier',
      'Billing_Country', 'Billing_City', 'Billing_Street', 'Billing_Code', 'Billing_State',
      'Sub_Total', 'Tax', 'Discount', 'Adjustment', 'Exchange_Rate',
      'Created_Time', 'Modified_Time', 'Created_By', 'Modified_By', 'Owner',
      'Terms_and_Conditions', 'End_Customer', 'Quoted_Items',
    ].join(',');
    const quotesUrl = `${ZOHO_CRM_DOMAIN}/crm/v2/Quotes?sort_by=Grand_Total&sort_order=desc&per_page=200&fields=${QUOTE_FIELDS}`;
    const DEAL_FIELDS = 'Deal_Name,Amount,Stage,Account_Name,Closing_Date,Description,Created_Time,Modified_Time,Created_By,Owner,Currency';
    const [dealsRes, quotesRes] = await Promise.all([
      fetch(`${ZOHO_CRM_DOMAIN}/crm/v2/Deals?sort_by=Amount&sort_order=desc&per_page=200&fields=${DEAL_FIELDS}`, {
        headers: reqHeaders,
      }),
      fetch(quotesUrl, { headers: reqHeaders }),
    ]);

    if (!dealsRes.ok) {
      return NextResponse.json(
        { error: `Zoho Deals API error: ${dealsRes.status}`, opportunities: [], winPercentage: null },
        { status: 200 }
      );
    }
    const dealsData = await dealsRes.json();
    const deals = dealsData.data || dealsData.deals || [];

    type QuoteRecord = Record<string, unknown>;

    const extractVal = (v: unknown): string | undefined => {
      if (v == null) return undefined;
      if (typeof v === 'string' && v.trim()) return v.trim();
      if (v && typeof v === 'object') {
        const o = v as Record<string, unknown>;
        if (typeof o.name === 'string' && o.name.trim()) return o.name.trim();
        if (typeof o.full_name === 'string' && o.full_name.trim()) return o.full_name.trim();
      }
      return undefined;
    };

    const getCreatorName = (record: Record<string, unknown>): string | undefined => {
      const keys = ['Created_By', 'created_by', '$created_by', 'Owner', 'owner', 'Creator', 'creator'];
      for (const k of keys) {
        const val = record[k];
        const name = extractVal(val);
        if (name && String(name).trim()) return String(name).trim();
      }
      for (const [key, val] of Object.entries(record)) {
        if (/created.?by|creator|owner/i.test(key)) {
          const name = extractVal(val);
          if (name && String(name).trim()) return String(name).trim();
        }
      }
      return undefined;
    };

    const quoteNumberField = process.env.ZOHO_QUOTE_NUMBER_FIELD || 'Auto_Number_1';
    const extractQuoteName = (q: QuoteRecord): string => {
      if (q[quoteNumberField] != null) {
        const val = typeof q[quoteNumberField] === 'string' ? q[quoteNumberField] : extractVal(q[quoteNumberField]);
        if (val) return String(val);
      }
      for (const [, v] of Object.entries(q)) {
        const val = typeof v === 'string' ? v : extractVal(v);
        if (val && val.toString().startsWith('RTA')) return val;
      }
      const candidates = [
        q.Name,
        q.Quote_Number,
        q.Quote_No,
        q.RTA_Quote_Number,
        q.Auto_Number,
        q.Record_Name,
      ];
      for (const c of candidates) {
        const val = typeof c === 'string' ? c : extractVal(c);
        if (val) return val;
      }
      const dealName = extractVal(q.Deal_Name);
      if (dealName) return dealName;
      return (extractVal(q.Subject) || q.Subject as string) || 'Unnamed';
    };

    const currencyField = process.env.ZOHO_CURRENCY_OPTION_FIELD || 'Currency_2';
    const extractCurrencyFromQuote = (q: QuoteRecord): string => {
      if (q[currencyField] != null) {
        const val = extractVal(q[currencyField]);
        if (val) return String(val).toUpperCase();
      }
      const priority = [
        q.Currency_Option,
        q.Currency_Option1,
        q.Currency_Option2,
        q.Currency_Options,
      ];
      for (const c of priority) {
        const val = extractVal(c);
        if (val) return String(val).toUpperCase();
      }
      for (const [k, v] of Object.entries(q)) {
        if (/currency.*option/i.test(k)) {
          const val = extractVal(v);
          if (val) return String(val).toUpperCase();
        }
      }
      const std = extractVal(q.Currency);
      if (std) return String(std).toUpperCase();
      return 'USD';
    };

    type Opportunity = {
      id?: string;
      name: string;
      amount: number;
      currency: string;
      stage: string;
      subject?: string;
      accountName?: string;
      dealName?: string;
      contactName?: string;
      validTill?: string;
      quoteDate?: string;
      description?: string;
      paymentTerms?: string;
      deliveryTerms?: string;
      deliveryTime?: string;
      carrier?: string;
      billingCountry?: string;
      billingCity?: string;
      billingStreet?: string;
      subTotal?: number;
      tax?: number;
      discount?: number;
      adjustment?: number;
      exchangeRate?: number;
      createdAt?: string;
      modifiedAt?: string;
      createdBy?: string;
      modifiedBy?: string;
      termsAndConditions?: string;
      endCustomer?: string;
    };

    const mapQuoteToOpportunity = (q: QuoteRecord): Opportunity => {
      const stage = typeof q.Quote_Stage === 'string' ? q.Quote_Stage : extractVal(q.Quote_Stage);
      const acct = q.Account_Name as { name?: string } | undefined;
      const deal = q.Deal_Name as { name?: string } | undefined;
      const contact = q.Contact_Name as { name?: string } | undefined;
      const createdBy = getCreatorName(q as Record<string, unknown>) ?? extractVal(q.Modified_By) ?? extractVal(q.Owner);
      const modifiedBy = extractVal(q.Modified_By);
      const endCust = q.End_Customer as { name?: string } | undefined;
      return {
        id: q.id as string,
        name: extractQuoteName(q),
        amount: (q.Grand_Total as number) ?? 0,
        currency: extractCurrencyFromQuote(q),
        stage: stage || '—',
        subject: q.Subject as string,
        accountName: acct?.name,
        dealName: deal?.name,
        contactName: contact?.name,
        validTill: q.Valid_Till as string,
        quoteDate: q.Quote_Date as string,
        description: q.Description as string,
        paymentTerms: q.Payment_Terms as string,
        deliveryTerms: q.Delivery_Terms as string,
        deliveryTime: q.Delivery_Time as string,
        carrier: q.Carrier as string,
        billingCountry: q.Billing_Country as string,
        billingCity: q.Billing_City as string,
        billingStreet: q.Billing_Street as string,
        subTotal: q.Sub_Total as number,
        tax: q.Tax as number,
        discount: q.Discount as number,
        adjustment: q.Adjustment as number,
        exchangeRate: q.Exchange_Rate as number,
        createdAt: q.Created_Time as string,
        modifiedAt: q.Modified_Time as string,
        createdBy: createdBy ?? undefined,
        modifiedBy: modifiedBy ?? undefined,
        termsAndConditions: q.Terms_and_Conditions as string,
        endCustomer: endCust?.name,
      };
    };

    let top: Opportunity[];
    let allOpportunities: Opportunity[] = [];
    let productCounts: Record<string, number> = {};
    let salespersonMapRaw: Record<string, { quoted: number; closed: number }> = {};
    let quotesData: { data?: unknown[]; quotes?: unknown[] } | null = null;

    if (quotesRes.ok) {
      quotesData = await quotesRes.json();
      let quotes = (quotesData && (quotesData.data || quotesData.quotes)) || [];
      quotes = filterByDate(quotes as { Created_Time?: string }[]);
      allOpportunities = quotes.map((q) => mapQuoteToOpportunity(q as QuoteRecord));
      top = allOpportunities.slice(0, 10);
      const productMap: Record<string, number> = {};
      for (const quote of quotes) {
        const q = quote as Record<string, unknown>;
        const creator = getCreatorName(q) ?? extractVal(q.Modified_By) ?? extractVal(q.Owner);
        if (creator) {
          const r = q as QuoteRecord & { Grand_Total?: number; Quote_Stage?: string };
          const amt = (r.Grand_Total as number) ?? 0;
          if (!salespersonMapRaw[creator]) salespersonMapRaw[creator] = { quoted: 0, closed: 0 };
          salespersonMapRaw[creator].quoted += amt;
          const stage = (typeof r.Quote_Stage === 'string' ? r.Quote_Stage : extractVal(r.Quote_Stage) || '').toLowerCase();
          if (stage.includes('won')) salespersonMapRaw[creator].closed += amt;
        }
        const items = (q.Quoted_Items as Array<{ Product_Name?: { name?: string }; Product_Name1?: { name?: string }; quantity?: number }>) || [];
        for (const item of items) {
          const name = extractVal(item.Product_Name ?? item.Product_Name1) || 'Unnamed product';
          const qty = (item.quantity as number) ?? 1;
          productMap[name] = (productMap[name] ?? 0) + qty;
        }
      }
      productCounts = productMap;
    } else {
      let filteredDeals = filterByDate(deals as { Created_Time?: string }[]);
      type DealRecord = Record<string, unknown>;
      const dealCurrencyField = process.env.ZOHO_CURRENCY_OPTION_FIELD || 'Currency_2';
      const extractCurrencyFromDeal = (d: DealRecord): string => {
        if (d[dealCurrencyField] != null) {
          const val = extractVal(d[dealCurrencyField]);
          if (val) return String(val).toUpperCase();
        }
        for (const f of [d.Currency_Option, d.Currency_Option1, d.Currency_Option2]) {
          const val = extractVal(f);
          if (val) return String(val).toUpperCase();
        }
        for (const [k, v] of Object.entries(d)) {
          if (/currency.*option/i.test(k)) {
            const val = extractVal(v);
            if (val) return String(val).toUpperCase();
          }
        }
        const std = extractVal(d.Currency);
        return std ? String(std).toUpperCase() : 'USD';
      };
      const getDealCreator = (d: DealRecord) => getCreatorName(d) ?? extractVal(d.Modified_By) ?? extractVal(d.Owner);
      top = filteredDeals.slice(0, 10).map((d: DealRecord) => {
        const stage = typeof d.Stage === 'string' ? d.Stage : (d.Stage && typeof d.Stage === 'object' && 'name' in d.Stage ? d.Stage.name : undefined);
        const acct = d.Account_Name as { name?: string } | undefined;
        return {
          id: d.id as string,
          name: (d.Deal_Name as string) || 'Unnamed',
          amount: (d.Amount as number) ?? 0,
          currency: extractCurrencyFromDeal(d),
          stage: (typeof stage === 'string' ? stage : '—'),
          accountName: acct && typeof acct === 'object' ? acct.name : undefined,
          validTill: d.Closing_Date as string,
          description: d.Description as string,
          createdAt: d.Created_Time as string,
          modifiedAt: d.Modified_Time as string,
          createdBy: getDealCreator(d),
          modifiedBy: extractVal(d.Modified_By) ?? undefined,
        };
      });
      allOpportunities = top;
      for (const o of allOpportunities) {
        const creator = (o.createdBy || o.modifiedBy || '').trim();
        if (!creator) continue;
        if (!salespersonMapRaw[creator]) salespersonMapRaw[creator] = { quoted: 0, closed: 0 };
        salespersonMapRaw[creator].quoted += o.amount || 0;
        if ((o.stage || '').toLowerCase().includes('won')) salespersonMapRaw[creator].closed += o.amount || 0;
      }
    }

    const customerMap: Record<string, number> = {};
    for (const o of allOpportunities) {
      const name = o.accountName || o.endCustomer || 'Unknown';
      if (!customerMap[name]) customerMap[name] = 0;
      customerMap[name] += o.amount || 0;
    }
    const topCustomers = Object.entries(customerMap)
      .filter(([name]) => name !== 'Unknown')
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    const topProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    if (Object.keys(salespersonMapRaw).length === 0) {
      for (const o of allOpportunities) {
        const name = (o.createdBy || o.modifiedBy || '').trim();
        if (!name) continue;
        if (!salespersonMapRaw[name]) salespersonMapRaw[name] = { quoted: 0, closed: 0 };
        const amt = o.amount || 0;
        salespersonMapRaw[name].quoted += amt;
        if ((o.stage || '').toLowerCase().includes('won')) salespersonMapRaw[name].closed += amt;
      }
    }
    const topSalespeople = Object.entries(salespersonMapRaw)
      .map(([name, data]) => ({ name, quoted: data.quoted, closed: data.closed }))
      .sort((a, b) => b.closed - a.closed)
      .slice(0, 10);

    let debugInfo: Record<string, unknown> | undefined;
    if (debug && topSalespeople.length === 0 && allOpportunities.length > 0) {
      const firstOpp = allOpportunities[0];
      const arr = quotesData ? (quotesData.data || quotesData.quotes) : null;
      const firstRaw = Array.isArray(arr) ? (arr[0] as Record<string, unknown>) : (deals as Record<string, unknown>[])[0];
      debugInfo = {
        source: quotesRes.ok ? 'quotes' : 'deals',
        oppCount: allOpportunities.length,
        firstOppCreatedBy: firstOpp?.createdBy,
        firstOppModifiedBy: firstOpp?.modifiedBy,
        firstRawCreatedBy: firstRaw ? (firstRaw as Record<string, unknown>).Created_By : null,
        firstRawOwner: firstRaw ? (firstRaw as Record<string, unknown>).Owner : null,
        getCreatorResult: firstRaw ? getCreatorName(firstRaw as Record<string, unknown>) : null,
      };
    }

    const stageMap: Record<string, { count: number; value: number }> = {};
    for (const o of allOpportunities) {
      const stage = o.stage || '—';
      if (!stageMap[stage]) stageMap[stage] = { count: 0, value: 0 };
      stageMap[stage].count += 1;
      stageMap[stage].value += o.amount || 0;
    }
    const stageDistribution = Object.entries(stageMap).map(([stage, data]) => ({
      stage,
      count: data.count,
      value: data.value,
    }));

    const closed = allOpportunities.filter((o) => {
      const s = (o.stage || '').toLowerCase();
      return s.includes('closed') || s.includes('won') || s.includes('lost');
    });
    const won = closed.filter((o) => (o.stage || '').toLowerCase().includes('won'));
    const winPercentage = closed.length > 0
      ? Math.round((won.length / closed.length) * 100)
      : null;

    return NextResponse.json(
      {
        opportunities: top,
        winPercentage,
        topCustomers,
        topProducts,
        topSalespeople,
        stageDistribution,
        ...(debugInfo && { _debug: debugInfo }),
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: 'Failed to fetch deals',
        opportunities: [],
        winPercentage: null,
        topCustomers: [],
        topProducts: [],
        topSalespeople: [],
        stageDistribution: [],
      },
      { status: 200 }
    );
  }
}
