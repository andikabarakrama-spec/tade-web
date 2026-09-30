import { 
  SavingsTransaction, 
  PaymentTransaction, 
  PayrollRecord, 
  LedgerEntry, 
  UnifiedFinancialTransaction,
  FinancialPeriodClosing 
} from '../types';

/**
 * Authoritative Centralized Financial Calculation Engine for TADE.
 * Strictly implements requirement S: Formula Centralization across all components, exports, and reports.
 */

/**
 * Formula F01 & D: Calculates Student Savings Closing Balance.
 * CLOSING SAVINGS BALANCE = OPENING BALANCE + APPROVED DEPOSITS - APPROVED WITHDRAWALS + VALID ADJUSTMENTS
 * Pending deposits or pending withdrawals DO NOT alter the authoritative balance.
 */
export function calculateSavingsBalance(
  transactions: SavingsTransaction[],
  openingBalance: number = 0
): number {
  return transactions.reduce((acc, tx) => {
    // Only APPROVED or POSTED transactions contribute to balance
    if (tx.status !== 'APPROVED' && tx.status !== 'POSTED') {
      return acc;
    }

    if (tx.type === 'DEPOSIT') {
      return acc + tx.amount;
    } else if (tx.type === 'WITHDRAWAL') {
      return acc - tx.amount;
    } else if (tx.type === 'ADJUSTMENT') {
      return acc + tx.amount;
    } else if (tx.type === 'REVERSAL') {
      return acc - tx.amount;
    }
    return acc;
  }, openingBalance);
}

/**
 * Formula F02, F03, F04 & G: Calculates SPP Outstanding Balance.
 * OUTSTANDING = TOTAL BILL - TOTAL APPROVED/POSTED PAYMENTS - VALID DISCOUNTS
 * Pending payments DO NOT reduce outstanding balance.
 */
export function calculateSPPOutstanding(
  totalBill: number,
  payments: PaymentTransaction[],
  discounts: number = 0
): {
  totalBill: number;
  totalPaid: number;
  pendingPayments: number;
  discounts: number;
  outstanding: number;
  status: 'BELUM_BAYAR' | 'PARTIAL' | 'LUNAS';
} {
  const totalPaid = payments
    .filter(p => p.paymentStatus === 'APPROVED' || p.paymentStatus === ('POSTED' as any))
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments
    .filter(p => p.paymentStatus === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const rawOutstanding = totalBill - totalPaid - discounts;
  const outstanding = Math.max(0, rawOutstanding);

  let status: 'BELUM_BAYAR' | 'PARTIAL' | 'LUNAS' = 'BELUM_BAYAR';
  if (outstanding === 0 && (totalPaid + discounts) >= totalBill) {
    status = 'LUNAS';
  } else if (totalPaid > 0) {
    status = 'PARTIAL';
  }

  return {
    totalBill,
    totalPaid,
    pendingPayments,
    discounts,
    outstanding,
    status
  };
}

/**
 * Formula F06 & J: Calculates Payroll Net Salary.
 * NET PAY = BASE PAY + ALLOWANCES - DEDUCTIONS
 */
export function calculatePayrollNet(
  baseSalary: number,
  allowances: number = 0,
  deductions: number = 0
): number {
  return baseSalary + allowances - deductions;
}

/**
 * Formula F05 & F07: Calculates Account Balance from Transactions / Ledger.
 * CLOSING = OPENING + POSTED INFLOW - POSTED OUTFLOW
 */
export function calculateAccountBalance(
  openingBalance: number,
  transactions: UnifiedFinancialTransaction[],
  accountId?: string
): number {
  return transactions.reduce((acc, tx) => {
    if (tx.paymentStatus !== 'APPROVED' && tx.paymentStatus !== 'POSTED') {
      return acc;
    }

    // Filter by accountId if specified
    if (accountId) {
      if (tx.direction === 'INFLOW' && tx.destinationAccountId === accountId) {
        return acc + tx.amount;
      } else if (tx.direction === 'OUTFLOW' && tx.sourceAccountId === accountId) {
        return acc - tx.amount;
      }
      return acc;
    }

    // Overall organization balance
    if (tx.direction === 'INFLOW') {
      return acc + tx.amount;
    } else if (tx.direction === 'OUTFLOW') {
      return acc - tx.amount;
    }
    return acc;
  }, openingBalance);
}

/**
 * Formula F15 & C: Verifies Double-Entry Ledger Debit and Credit Equality.
 * TOTAL DEBIT == TOTAL CREDIT
 * Strictly checks numerical validity (no NaN, Infinity, undefined, or negative values).
 */
export function verifyLedgerBalance(entry: {
  debitAmount: number;
  creditAmount: number;
}): boolean {
  if (
    typeof entry.debitAmount !== 'number' ||
    typeof entry.creditAmount !== 'number' ||
    isNaN(entry.debitAmount) ||
    isNaN(entry.creditAmount) ||
    !isFinite(entry.debitAmount) ||
    !isFinite(entry.creditAmount) ||
    entry.debitAmount < 0 ||
    entry.creditAmount < 0
  ) {
    return false;
  }
  return Math.abs(entry.debitAmount - entry.creditAmount) < 0.001;
}

/**
 * Formula F13 & M: Calculates Monthly Period Financial Summary.
 */
export function calculatePeriodClosing(
  openingBalance: number,
  periodTransactions: UnifiedFinancialTransaction[]
): {
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalPayroll: number;
  totalSavingsInflow: number;
  totalSavingsOutflow: number;
  closingBalance: number;
} {
  let totalIncome = 0;
  let totalExpense = 0;
  let totalPayroll = 0;
  let totalSavingsInflow = 0;
  let totalSavingsOutflow = 0;

  periodTransactions.forEach(tx => {
    if (tx.paymentStatus !== 'APPROVED' && tx.paymentStatus !== 'POSTED') return;

    if (tx.type === 'SPP_PAYMENT') {
      totalIncome += tx.amount;
    } else if (tx.type === 'OPERATIONAL_EXPENSE') {
      totalExpense += tx.amount;
    } else if (tx.type === 'PAYROLL_DISBURSEMENT') {
      totalPayroll += tx.amount;
    } else if (tx.type === 'SAVINGS_DEPOSIT') {
      totalSavingsInflow += tx.amount;
    } else if (tx.type === 'SAVINGS_WITHDRAWAL') {
      totalSavingsOutflow += tx.amount;
    }
  });

  const netFlow = totalIncome + totalSavingsInflow - totalExpense - totalPayroll - totalSavingsOutflow;
  const closingBalance = openingBalance + netFlow;

  return {
    openingBalance,
    totalIncome,
    totalExpense,
    totalPayroll,
    totalSavingsInflow,
    totalSavingsOutflow,
    closingBalance
  };
}

/**
 * Formula F14 & N: Reconciles Yearly Total with Monthly Period Closings.
 */
export function calculateYearlyClosing(monthlyClosings: FinancialPeriodClosing[]): {
  annualOpeningBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalPayroll: number;
  totalSavingsInflow: number;
  totalSavingsOutflow: number;
  annualClosingBalance: number;
  reconciled: boolean;
} {
  if (monthlyClosings.length === 0) {
    return {
      annualOpeningBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
      totalPayroll: 0,
      totalSavingsInflow: 0,
      totalSavingsOutflow: 0,
      annualClosingBalance: 0,
      reconciled: true
    };
  }

  // Sort monthly closings chronologically by period YYYY-MM
  const sorted = [...monthlyClosings].sort((a, b) => a.period.localeCompare(b.period));

  const annualOpeningBalance = sorted[0].openingBalance;
  const totalIncome = sorted.reduce((sum, m) => sum + m.totalIncome, 0);
  const totalExpense = sorted.reduce((sum, m) => sum + m.totalExpense, 0);
  const totalPayroll = sorted.reduce((sum, m) => sum + m.totalPayroll, 0);
  const totalSavingsInflow = sorted.reduce((sum, m) => sum + m.totalSavingsInflow, 0);
  const totalSavingsOutflow = sorted.reduce((sum, m) => sum + m.totalSavingsOutflow, 0);

  const calculatedClosing = annualOpeningBalance + totalIncome + totalSavingsInflow - totalExpense - totalPayroll - totalSavingsOutflow;
  const lastMonthClosing = sorted[sorted.length - 1].closingBalance;

  const reconciled = Math.abs(calculatedClosing - lastMonthClosing) < 0.001;

  return {
    annualOpeningBalance,
    totalIncome,
    totalExpense,
    totalPayroll,
    totalSavingsInflow,
    totalSavingsOutflow,
    annualClosingBalance: calculatedClosing,
    reconciled
  };
}
