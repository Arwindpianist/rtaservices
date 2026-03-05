/**
 * Hardcoded mock payroll data. Starts with SG (Singapore); by country, department, role, employee, pay period/date/amount/method/status/type/frequency, taxes.
 */

export interface PayrollEntry {
  id: string;
  country: string;
  department: string;
  role: string;
  employee: string;
  payPeriod: string;
  payDate: string;
  payAmount: number;
  currency: string;
  payMethod: string;
  payStatus: string;
  payType: string;
  payFrequency: string;
  taxes: number;
  grossAmount: number;
}

export const MOCK_PAYROLL: PayrollEntry[] = [
  { id: 'pr1', country: 'SG', department: 'Engineering', role: 'Developer', employee: 'Alice Tan', payPeriod: '2025-02', payDate: '2025-02-28', payAmount: 5200, currency: 'SGD', payMethod: 'Bank transfer', payStatus: 'Paid', payType: 'Salary', payFrequency: 'Monthly', taxes: 520, grossAmount: 5720 },
  { id: 'pr2', country: 'SG', department: 'Sales', role: 'Account Manager', employee: 'Bob Lee', payPeriod: '2025-02', payDate: '2025-02-28', payAmount: 4800, currency: 'SGD', payMethod: 'Bank transfer', payStatus: 'Paid', payType: 'Salary', payFrequency: 'Monthly', taxes: 480, grossAmount: 5280 },
  { id: 'pr3', country: 'SG', department: 'Engineering', role: 'Developer', employee: 'Carol Wong', payPeriod: '2025-02', payDate: '2025-02-28', payAmount: 5500, currency: 'SGD', payMethod: 'Bank transfer', payStatus: 'Pending', payType: 'Salary', payFrequency: 'Monthly', taxes: 550, grossAmount: 6050 },
  { id: 'pr4', country: 'SG', department: 'HR', role: 'HR Manager', employee: 'David Ng', payPeriod: '2025-02', payDate: '2025-02-28', payAmount: 6200, currency: 'SGD', payMethod: 'Bank transfer', payStatus: 'Paid', payType: 'Salary', payFrequency: 'Monthly', taxes: 620, grossAmount: 6820 },
  { id: 'pr5', country: 'SG', department: 'Sales', role: 'Sales Rep', employee: 'Eve Lim', payPeriod: '2025-02', payDate: '2025-02-28', payAmount: 3800, currency: 'SGD', payMethod: 'Bank transfer', payStatus: 'Paid', payType: 'Salary', payFrequency: 'Monthly', taxes: 380, grossAmount: 4180 },
];

export function getPayrollByCountry(country: string): PayrollEntry[] {
  return MOCK_PAYROLL.filter((p) => p.country === country);
}

export function getPayrollByDepartment(department: string): PayrollEntry[] {
  return MOCK_PAYROLL.filter((p) => p.department === department);
}

export function getPayrollByStatus(status: string): PayrollEntry[] {
  return MOCK_PAYROLL.filter((p) => p.payStatus === status);
}

export function getPayrollTaxSummary(): { totalTaxes: number; totalGross: number; totalNet: number } {
  const totalGross = MOCK_PAYROLL.reduce((s, p) => s + p.grossAmount, 0);
  const totalTaxes = MOCK_PAYROLL.reduce((s, p) => s + p.taxes, 0);
  const totalNet = MOCK_PAYROLL.reduce((s, p) => s + p.payAmount, 0);
  return { totalTaxes, totalGross, totalNet };
}
