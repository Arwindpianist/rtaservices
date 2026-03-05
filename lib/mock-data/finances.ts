/**
 * Hardcoded mock data for dashboard finances: claims, invoices, payments, aging, statements.
 */

export type ClaimSource = 'client' | 'vendor' | 'staff';

export interface Claim {
  id: string;
  from: string;
  source: ClaimSource;
  amount: number;
  currency: string;
  status: string;
  date: string;
  description?: string;
}

export interface Invoice {
  id: string;
  type: 'in' | 'out';
  entity: string;
  entityType: 'customer' | 'supplier' | 'staff';
  amount: number;
  currency: string;
  dueDate: string;
  status: 'due' | 'overdue' | 'late' | 'on_time' | 'early';
  daysOverdue?: number;
  ageBucket: '0-30' | '30-60' | '60-90' | '>90';
}

export interface PaymentRow {
  id: string;
  entity: string;
  entityType: 'customer' | 'supplier' | 'staff';
  amount: number;
  currency: string;
  dueDate: string;
  status: 'due' | 'overdue' | 'late' | 'on_time' | 'early';
  description?: string;
}

export interface StatementLine {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface AccountStatement {
  entity: string;
  entityType: 'customer' | 'supplier' | 'staff';
  currency: string;
  lines: StatementLine[];
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export const MOCK_CLAIMS: Claim[] = [
  { id: 'c1', from: 'Acme Corp', source: 'client', amount: 12500, currency: 'USD', status: 'Pending', date: '2025-02-20' },
  { id: 'c2', from: 'TechVendor Inc', source: 'vendor', amount: 3200, currency: 'USD', status: 'Approved', date: '2025-02-18' },
  { id: 'c3', from: 'Jane Doe', source: 'staff', amount: 450, currency: 'USD', status: 'Submitted', date: '2025-02-22' },
  { id: 'c4', from: 'Beta Ltd', source: 'client', amount: 8700, currency: 'USD', status: 'Paid', date: '2025-02-10' },
  { id: 'c5', from: 'Office Supplies Co', source: 'vendor', amount: 890, currency: 'USD', status: 'Pending', date: '2025-02-21' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', type: 'in', entity: 'Supplier A', entityType: 'supplier', amount: 15000, currency: 'USD', dueDate: '2025-03-15', status: 'due', ageBucket: '0-30' },
  { id: 'inv2', type: 'out', entity: 'Customer X', entityType: 'customer', amount: 22000, currency: 'USD', dueDate: '2025-02-28', status: 'due', ageBucket: '0-30' },
  { id: 'inv3', type: 'in', entity: 'Supplier B', entityType: 'supplier', amount: 8500, currency: 'USD', dueDate: '2025-01-20', status: 'overdue', daysOverdue: 38, ageBucket: '30-60' },
  { id: 'inv4', type: 'out', entity: 'Customer Y', entityType: 'customer', amount: 12000, currency: 'USD', dueDate: '2025-02-01', status: 'on_time', ageBucket: '0-30' },
  { id: 'inv5', type: 'in', entity: 'Vendor C', entityType: 'supplier', amount: 4500, currency: 'USD', dueDate: '2024-11-10', status: 'overdue', daysOverdue: 109, ageBucket: '>90' },
];

export const MOCK_PAYMENTS: PaymentRow[] = [
  { id: 'p1', entity: 'Customer X', entityType: 'customer', amount: 22000, currency: 'USD', dueDate: '2025-02-28', status: 'due' },
  { id: 'p2', entity: 'Supplier A', entityType: 'supplier', amount: 15000, currency: 'USD', dueDate: '2025-03-15', status: 'due' },
  { id: 'p3', entity: 'Supplier B', entityType: 'supplier', amount: 8500, currency: 'USD', dueDate: '2025-01-20', status: 'overdue' },
  { id: 'p4', entity: 'Staff J. Smith', entityType: 'staff', amount: 3200, currency: 'USD', dueDate: '2025-02-25', status: 'on_time' },
  { id: 'p5', entity: 'Customer Z', entityType: 'customer', amount: 5000, currency: 'USD', dueDate: '2025-03-01', status: 'early' },
];

export const MOCK_STATEMENT_CUSTOMER: AccountStatement = {
  entity: 'Main Customer Account',
  entityType: 'customer',
  currency: 'USD',
  totalDebit: 45000,
  totalCredit: 32000,
  balance: 13000,
  lines: [
    { id: 's1', date: '2025-02-01', description: 'Invoice INV-001', debit: 15000, credit: 0, balance: 15000 },
    { id: 's2', date: '2025-02-05', description: 'Payment received', debit: 0, credit: 10000, balance: 5000 },
    { id: 's3', date: '2025-02-15', description: 'Invoice INV-002', debit: 22000, credit: 0, balance: 27000 },
    { id: 's4', date: '2025-02-20', description: 'Payment received', debit: 0, credit: 14000, balance: 13000 },
  ],
};

export const MOCK_STATEMENT_SUPPLIER: AccountStatement = {
  entity: 'Main Supplier Account',
  entityType: 'supplier',
  currency: 'USD',
  totalDebit: 20000,
  totalCredit: 23500,
  balance: -3500,
  lines: [
    { id: 's5', date: '2025-02-01', description: 'Payment made', debit: 12000, credit: 0, balance: -12000 },
    { id: 's6', date: '2025-02-10', description: 'Invoice from supplier', debit: 0, credit: 8500, balance: -3500 },
    { id: 's7', date: '2025-02-18', description: 'Payment made', debit: 8000, credit: 0, balance: -11500 },
    { id: 's8', date: '2025-02-22', description: 'Invoice from supplier', debit: 0, credit: 8000, balance: -3500 },
  ],
};

export const MOCK_STATEMENT_STAFF: AccountStatement = {
  entity: 'Main Staff Account',
  entityType: 'staff',
  currency: 'USD',
  totalDebit: 0,
  totalCredit: 0,
  balance: 0,
  lines: [
    { id: 's9', date: '2025-02-25', description: 'Payroll', debit: 0, credit: 0, balance: 0 },
  ],
};

export function getClaimsBySource(source: ClaimSource): Claim[] {
  return MOCK_CLAIMS.filter((c) => c.source === source);
}

export function getPaymentsByStatus(status: PaymentRow['status']): PaymentRow[] {
  return MOCK_PAYMENTS.filter((p) => p.status === status);
}

export function getPaymentsByEntityType(entityType: PaymentRow['entityType']): PaymentRow[] {
  return MOCK_PAYMENTS.filter((p) => p.entityType === entityType);
}

export function getInvoicesIn(): Invoice[] {
  return MOCK_INVOICES.filter((i) => i.type === 'in');
}

export function getInvoicesOut(): Invoice[] {
  return MOCK_INVOICES.filter((i) => i.type === 'out');
}

export function getInvoicesByAgeBucket(bucket: Invoice['ageBucket']): Invoice[] {
  return MOCK_INVOICES.filter((i) => i.ageBucket === bucket);
}
