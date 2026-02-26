/**
 * Bond Yield Calculator — type definitions matching backend API.
 */

/** Request payload for POST /bond/calculate */
export interface CalculateBondDto {
  faceValue: number;
  annualCouponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 'ANNUAL' | 'SEMI_ANNUAL';
}

/** Single row in the cash flow schedule */
export interface CashFlow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

/** Response from POST /bond/calculate */
export interface BondResponse {
  currentYield: number;
  ytm: number;
  totalInterest: number;
  premiumOrDiscount: 'PREMIUM' | 'DISCOUNT' | 'PAR';
  cashFlowSchedule: CashFlow[];
}
