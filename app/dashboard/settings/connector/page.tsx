'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

type ConnectorSettings = {
  ZOHO_QUOTE_WON_STAGE: string;
  XERO_DEFAULT_ACCOUNT_CODE: string;
  XERO_DEFAULT_TAX_TYPE: string;
  XERO_AUTO_SEND_INVOICE: boolean;
  ZOHO_CUSTOM_FIELD_XERO_PAID_DATE: string;
};

export default function ConnectorSettingsPage() {
  const [settings, setSettings] = useState<ConnectorSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/connector/settings')
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="text-rta-text-secondary">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>
        <h1 className="text-h3 font-bold text-rta-blue">Connector settings</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Current Zoho–Xero connector configuration (read-only, from environment)
        </p>

        {loading ? (
          <div className="flex items-center gap-2 py-12 justify-center text-rta-text-secondary">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-body-sm">Loading…</span>
          </div>
        ) : settings ? (
          <Card className="border-rta-border bg-white shadow-card mt-6">
            <CardContent className="pt-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">ZOHO_QUOTE_WON_STAGE</dt>
                  <dd className="text-body-sm font-medium text-rta-text mt-1">{settings.ZOHO_QUOTE_WON_STAGE}</dd>
                  <dd className="text-xs text-rta-text-secondary mt-0.5">Quote stage that triggers invoice creation</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">XERO_DEFAULT_ACCOUNT_CODE</dt>
                  <dd className="text-body-sm font-medium text-rta-text mt-1">{settings.XERO_DEFAULT_ACCOUNT_CODE}</dd>
                  <dd className="text-xs text-rta-text-secondary mt-0.5">Revenue account for new invoices (must exist in Xero)</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">XERO_DEFAULT_TAX_TYPE</dt>
                  <dd className="text-body-sm font-medium text-rta-text mt-1">{settings.XERO_DEFAULT_TAX_TYPE}</dd>
                  <dd className="text-xs text-rta-text-secondary mt-0.5">Tax type for line items</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">XERO_AUTO_SEND_INVOICE</dt>
                  <dd className="text-body-sm font-medium text-rta-text mt-1">{settings.XERO_AUTO_SEND_INVOICE ? 'true' : 'false'}</dd>
                  <dd className="text-xs text-rta-text-secondary mt-0.5">Create as SUBMITTED when true, else DRAFT</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">ZOHO_CUSTOM_FIELD_XERO_PAID_DATE</dt>
                  <dd className="text-body-sm font-medium text-rta-text mt-1">{settings.ZOHO_CUSTOM_FIELD_XERO_PAID_DATE || '(not set)'}</dd>
                  <dd className="text-xs text-rta-text-secondary mt-0.5">Zoho Quote custom field for payment sync (optional)</dd>
                </div>
              </dl>
              <p className="text-body-sm text-rta-text-secondary mt-6 pt-4 border-t border-rta-border">
                To change these values, update your <code className="bg-rta-bg-light px-1 rounded">.env</code> or deployment environment and restart. See <code className="bg-rta-bg-light px-1 rounded">.env.example</code> and the connector roadmap for details.
              </p>
            </CardContent>
          </Card>
        ) : (
          <p className="mt-6 text-body-sm text-rta-text-secondary">Failed to load settings.</p>
        )}
      </div>
    </div>
  );
}
