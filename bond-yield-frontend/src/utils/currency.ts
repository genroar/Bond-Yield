/**
 * Currency formatting for display only. Does not affect calculations.
 */

const AED_FORMATTER = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'AED',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as AED currency (e.g. "AED 1,000.00").
 * Use for display only; underlying values remain numbers.
 */
export function formatCurrency(value: number): string {
  return AED_FORMATTER.format(value);
}
