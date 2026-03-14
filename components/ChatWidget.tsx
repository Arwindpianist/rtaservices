'use client';

import Script from 'next/script';

/**
 * Zoho SalesIQ chat widget – loads when NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE is set.
 * Final goal: chat widget visible across the site; staff handle conversations in Zoho CRM.
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE=siqb1b0699b119340245e81b4c1f8e01422877bebc9217da3b85b6a3a5c5ac990f2
 * (Use your actual widget code from Zoho SalesIQ.)
 */
const widgetCode =
  typeof process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE === 'string' &&
  process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE.trim() !== ''
    ? process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE.trim()
    : null;

export default function ChatWidget() {
  if (!widgetCode) return null;

  return (
    <Script
      id="zoho-salesiq"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var $zoho = $zoho || {};
          $zoho.salesiq = $zoho.salesiq || { widgetcode: "${widgetCode}", values: {}, ready: function() {} };
          var d = document, s = d.createElement("script");
          s.type = "text/javascript"; s.id = "zsiqscript"; s.defer = true;
          s.src = "https://salesiq.zoho.com/widget";
          d.getElementsByTagName("head")[0].appendChild(s);
        `,
      }}
    />
  );
}
