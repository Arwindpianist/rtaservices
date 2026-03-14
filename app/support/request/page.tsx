'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SUPPORTED_SOFTWARE, searchSupportedSoftware, type SupportedSoftware } from '@/lib/data/supported-software';
import { fadeInUp, getAnimationVariants, viewportOptions } from '@/lib/animations';
import { Search, ArrowLeft, CheckCircle2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const DROPDOWN_LIMIT = 120;
const TABLE_PAGE_SIZE = 50;

export default function SupportRequestPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SupportedSoftware | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [tablePage, setTablePage] = useState(0);
  const [tableFilter, setTableFilter] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [version, setVersion] = useState('');
  const [instances, setInstances] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const list = searchSupportedSoftware(query);
    return list.slice(0, DROPDOWN_LIMIT);
  }, [query]);

  const tableList = useMemo(() => {
    const list = searchSupportedSoftware(tableFilter);
    const start = tablePage * TABLE_PAGE_SIZE;
    return { items: list.slice(start, start + TABLE_PAGE_SIZE), total: list.length };
  }, [tableFilter, tablePage]);

  useEffect(() => {
    setTablePage(0);
  }, [tableFilter]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectSoftware(item: SupportedSoftware) {
    setSelected(item);
    setQuery(item.name);
    setDropdownOpen(false);
    setBrowseOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!selected) {
      setError('Please select a software from the list.');
      return;
    }
    if (!contactName.trim() || !email.trim() || !company.trim() || !phone.trim() || details.trim().length < 10) {
      setError('Please fill in name, email, company, phone, and details (at least 10 characters).');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/support/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          software: selected.name,
          contactName,
          email,
          company,
          phone,
          version,
          instances,
          details,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Network error. Please try again or email support@rtaservices.net');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-rta-bg-light min-h-[60vh] py-20">
        <div className="mx-auto max-w-lg px-5 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" aria-hidden />
          <h1 className="text-h2 font-bold text-rta-blue mb-2">Request received</h1>
          <p className="text-body text-rta-text-secondary mb-8">
            We’ve recorded your support request for <strong className="text-rta-text">{selected?.name}</strong>.
            Our team will contact you shortly.
          </p>
          <Button asChild className="bg-rta-gold-cta hover:bg-rta-gold-cta-hover text-white">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(tableList.total / TABLE_PAGE_SIZE));

  return (
    <div className="bg-rta-bg-light py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <Button asChild variant="ghost" size="sm" className="text-rta-text-secondary mb-6 -ml-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </Button>
          <h1 className="text-h1-md md:text-h1 font-bold text-rta-blue mb-2">
            Search for OSS support
          </h1>
          <p className="text-body-lg text-rta-text-secondary mb-2">
            Browse <strong>{SUPPORTED_SOFTWARE.length}</strong> supported technologies, select one, then request support with your details.
          </p>
          <p className="text-body-sm text-rta-text-secondary mb-10">
            All listings stay on this site—no external catalog.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative" ref={listRef}>
              <Label htmlFor="software-search" className="text-rta-text font-medium">
                Software / technology *
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-rta-text-secondary pointer-events-none" />
                <Input
                  id="software-search"
                  type="text"
                  placeholder="Type to filter, then pick from the list…"
                  value={selected ? selected.name : query}
                  onChange={(e) => {
                    setSelected(null);
                    setQuery(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  className="pl-10 border-rta-border focus-visible:ring-rta-blue"
                  autoComplete="off"
                />
              </div>
              {dropdownOpen && !selected && (
                <div className="absolute z-20 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-rta-border bg-white shadow-lg">
                  {!query.trim() && (
                    <p className="px-4 py-3 text-body-sm text-rta-text-secondary border-b border-rta-border">
                      Type at least one letter to search {SUPPORTED_SOFTWARE.length} technologies, or open &quot;Browse full list&quot; below.
                    </p>
                  )}
                  {query.trim() && filtered.length === 0 && (
                    <p className="px-4 py-3 text-body-sm text-rta-text-secondary">No matches. Adjust your search.</p>
                  )}
                  {query.trim() && filtered.length > 0 && (
                    <ul className="py-1">
                      {filtered.map((item) => (
                        <li key={item.name}>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2.5 text-body-sm text-rta-text hover:bg-rta-bg-light transition-colors"
                            onClick={() => selectSoftware(item)}
                          >
                            {item.name}
                            {item.supportLevel && item.supportLevel.length > 0 && (
                              <span className="text-rta-text-secondary text-xs ml-2">
                                ({item.supportLevel.join(', ')})
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {query.trim() && filtered.length === DROPDOWN_LIMIT && (
                    <p className="px-4 py-2 text-xs text-rta-text-secondary border-t border-rta-border">
                      Showing first {DROPDOWN_LIMIT} matches—refine search or use full list.
                    </p>
                  )}
                </div>
              )}
              {selected && (
                <p className="mt-2 text-body-sm text-rta-text">
                  Selected: <strong>{selected.name}</strong>
                  {selected.supportLevel && selected.supportLevel.length > 0 && (
                    <span className="text-rta-text-secondary"> — {selected.supportLevel.join(', ')}</span>
                  )}
                  <button
                    type="button"
                    className="ml-3 text-rta-blue hover:underline"
                    onClick={() => {
                      setSelected(null);
                      setQuery('');
                      setDropdownOpen(true);
                    }}
                  >
                    Change
                  </button>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact name *</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-2 border-rta-border"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 border-rta-border"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 border-rta-border"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 border-rta-border"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="version">Version (if known)</Label>
                <Input
                  id="version"
                  placeholder="e.g. 3.5, 17 LTS"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="mt-2 border-rta-border"
                />
              </div>
              <div>
                <Label htmlFor="instances">Instances / environment</Label>
                <Input
                  id="instances"
                  placeholder="e.g. 3 prod clusters"
                  value={instances}
                  onChange={(e) => setInstances(e.target.value)}
                  className="mt-2 border-rta-border"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="details">Additional details *</Label>
              <Textarea
                id="details"
                placeholder="Describe your support needs, severity, and any relevant context."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="mt-2 min-h-[120px] border-rta-border"
                required
              />
            </div>

            {error && (
              <p className="text-body-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="bg-rta-gold-cta hover:bg-rta-gold-cta-hover text-white px-8 py-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                  Submitting…
                </>
              ) : (
                'Submit support request'
              )}
            </Button>
          </form>

          {/* Full on-site list */}
          <Card className="mt-12 border-rta-border bg-white shadow-card">
            <button
              type="button"
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-rta-bg-light/50 transition-colors rounded-t-lg"
              onClick={() => setBrowseOpen((o) => !o)}
              aria-expanded={browseOpen}
            >
              <span className="font-semibold text-rta-blue">
                Browse full list ({SUPPORTED_SOFTWARE.length} technologies)
              </span>
              {browseOpen ? <ChevronUp className="w-5 h-5 text-rta-text-secondary" /> : <ChevronDown className="w-5 h-5 text-rta-text-secondary" />}
            </button>
            {browseOpen && (
              <CardContent className="pt-0 pb-6 px-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rta-text-secondary" />
                    <Input
                      placeholder="Filter table…"
                      value={tableFilter}
                      onChange={(e) => setTableFilter(e.target.value)}
                      className="pl-9 border-rta-border"
                    />
                  </div>
                  <p className="text-body-sm text-rta-text-secondary self-center">
                    {tableList.total} match{tableList.total !== 1 ? 'es' : ''}
                  </p>
                </div>
                <div className="overflow-x-auto rounded-md border border-rta-border max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left text-body-sm">
                    <thead className="bg-rta-bg-light sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-rta-text">Technology</th>
                        <th className="px-4 py-3 font-semibold text-rta-text">Support level(s)</th>
                        <th className="px-4 py-3 w-28" />
                      </tr>
                    </thead>
                    <tbody>
                      {tableList.items.map((item) => (
                        <tr key={item.name} className="border-b border-rta-border last:border-0 hover:bg-rta-bg-light/60">
                          <td className="px-4 py-2.5 text-rta-text">{item.name}</td>
                          <td className="px-4 py-2.5 text-rta-text-secondary">
                            {item.supportLevel && item.supportLevel.length > 0
                              ? item.supportLevel.join(', ')
                              : '—'}
                          </td>
                          <td className="px-4 py-2.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="border-rta-border text-rta-blue hover:bg-rta-blue hover:text-white"
                              onClick={() => selectSoftware(item)}
                            >
                              Select
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={tablePage <= 0}
                      onClick={() => setTablePage((p) => Math.max(0, p - 1))}
                      className="border-rta-border"
                    >
                      Previous
                    </Button>
                    <span className="text-body-sm text-rta-text-secondary">
                      Page {tablePage + 1} of {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={tablePage >= totalPages - 1}
                      onClick={() => setTablePage((p) => Math.min(totalPages - 1, p + 1))}
                      className="border-rta-border"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
