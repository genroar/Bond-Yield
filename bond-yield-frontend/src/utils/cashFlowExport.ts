import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CashFlow } from '../types/bond';
import { formatCurrency } from './currency';

const roundTwo = (value: number): number =>
  Math.round(value * 100) / 100;

/** Format date for export (DD/MM/YYYY) */
function formatDateExport(isoDate: string): string {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const CSV_HEADERS = [
  'Period',
  'Payment Date',
  'Coupon Payment',
  'Cumulative Interest',
  'Remaining Principal',
] as const;

function escapeCsvCell(value: string): string {
  const s = String(value);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Build CSV rows from cash flow schedule. Headers and values are formatted.
 */
export function buildCashFlowCsvRows(cashFlowSchedule: CashFlow[]): string[][] {
  const headerRow = [...CSV_HEADERS];
  const dataRows = cashFlowSchedule.map((row: CashFlow) => [
    String(row.period),
    formatDateExport(row.paymentDate),
    formatCurrency(roundTwo(row.couponPayment)),
    formatCurrency(roundTwo(row.cumulativeInterest)),
    formatCurrency(roundTwo(row.remainingPrincipal)),
  ]);
  return [headerRow, ...dataRows];
}

/**
 * Export cash flow schedule to CSV and trigger download.
 */
export function exportCashFlowToCsv(cashFlowSchedule: CashFlow[]): void {
  const rows = buildCashFlowCsvRows(cashFlowSchedule);
  const csvContent = rows
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'cash-flow-schedule.csv');
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export cash flow schedule to PDF and trigger download.
 */
export function exportCashFlowToPdf(cashFlowSchedule: CashFlow[]): void {
  const rows = buildCashFlowCsvRows(cashFlowSchedule);
  const headers = rows[0] as string[];
  const body = rows.slice(1) as string[][];

  const doc = new jsPDF();
  autoTable(doc, {
    head: [headers],
    body,
    startY: 20,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202] },
  });
  doc.save('cash-flow-schedule.pdf');
}
