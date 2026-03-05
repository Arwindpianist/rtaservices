export type InvoiceItem = {
  id: string;
  type: 'in' | 'out';
  entity: string;
  entityType?: 'customer' | 'supplier' | 'staff';
  amount: number;
  currency: string;
  dueDate: string;
  status: string;
  ageBucket?: string;
  paidAmount?: number;
  paidDate?: string;
};
